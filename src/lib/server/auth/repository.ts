import { type Role } from './roles';
import { hash, verify } from '@node-rs/argon2';
import { subMinutes } from 'date-fns';
import { and, count, desc, eq, gte } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { db } from '../database/adapter';
import {
	userTable,
	teamTable,
	verificationCodesTable,
	sessionTable,
	teamMemberTable,
	oauthConnectionsTable
} from '../database/schema';
import { TeamRole } from '../teams/roles';

class AuthRepository {
	async findUsers(page: number, limit: number = 20) {
		const users = await db.query.userTable.findMany({
			offset: limit * (page - 1),
			orderBy: [desc(userTable.id)]
		});

		const [{ count: usersCount }] = await db
			.select({ count: count() })
			.from(userTable)
			.offset(limit * (page - 1));

		return { data: users, count: usersCount };
	}

	async findUserByEmail(email: string) {
		const user = await db.query.userTable.findFirst({ where: eq(userTable.email, email) });

		if (!user) {
			return;
		}

		return user;
	}

	async findUserById(id: number) {
		const user = await db.query.userTable.findFirst({ where: eq(userTable.id, id) });

		if (!user) {
			return;
		}

		return user;
	}

	async isUniqueEmail(email: string) {
		const user = await db.query.userTable.findFirst({
			where: eq(userTable.email, email),
			columns: {
				email: true
			}
		});

		return !user;
	}

	async findUserByEmailAndPassword(email: string, password: string) {
		const user = await db.query.userTable.findFirst({ where: eq(userTable.email, email) });

		if (!user) {
			return;
		}

		const isValid = await verify(user.password, password);

		if (isValid) {
			return user;
		}
	}

	async findSessionsByUserId(userId: number) {
		const sessions = await db.query.sessionTable.findMany({
			where: eq(sessionTable.userId, userId)
		});

		const [{ count: sessionsCount }] = await db
			.select({ count: count() })
			.from(sessionTable)
			.where(eq(sessionTable.userId, userId));

		return { data: sessions, count: sessionsCount };
	}

	async createUser(email: string, password: string, fullName: string) {
		const hashedPassword = await hash(password);

		return await db.transaction(async (trx) => {
			const [{ id: teamId }] = await trx
				.insert(teamTable)
				.values({ name: `${fullName}'s Team` })
				.returning();

			const [user] = await trx
				.insert(userTable)
				.values({
					email,
					password: hashedPassword,
					fullName,
					activeTeamId: teamId
				})
				.returning();

			await trx.insert(teamMemberTable).values({
				teamId: teamId,
				userId: user.id,
				role: TeamRole.Admin
			});

			return user;
		});
	}

	async createVerificationCode(userId: number, validUntil: Date) {
		const existingCode = await db.query.verificationCodesTable.findFirst({
			where: and(
				eq(verificationCodesTable.userId, userId),
				gte(verificationCodesTable.validUntil, subMinutes(new Date(), 30))
			)
		});

		if (existingCode) {
			return existingCode;
		}

		const code = await db
			.insert(verificationCodesTable)
			.values({
				id: generateIdFromEntropySize(10),
				userId,
				validUntil
			})
			.returning();

		return code[0];
	}

	async updateUser(
		id: number,
		email: string,
		fullName: string,
		role: Role,
		password?: string | null
	) {
		const hashedPassword = password ? await hash(password) : undefined;

		if (password) {
			await db
				.update(userTable)
				.set({ email, fullName, password: hashedPassword })
				.where(eq(userTable.id, id));
		}

		const user = await db
			.update(userTable)
			.set({ email, fullName, role })
			.where(eq(userTable.id, id))
			.returning();

		return user[0];
	}

	async verifyEmail(id: number, code: string) {
		const verificationCode = await db.query.verificationCodesTable.findFirst({
			where: and(
				eq(verificationCodesTable.id, code),
				eq(verificationCodesTable.userId, id),
				gte(verificationCodesTable.validUntil, new Date())
			)
		});

		if (!verificationCode) {
			return false;
		}

		await db.transaction(async (trx) => {
			await trx.delete(verificationCodesTable).where(eq(verificationCodesTable.id, code));
			await trx.update(userTable).set({ isVerified: true }).where(eq(userTable.id, id));
		});

		return true;
	}

	async verifyEmailWithoutCode(id: number) {
		await db.update(userTable).set({ isVerified: true }).where(eq(userTable.id, id));
	}

	async deleteUser(id: number) {
		await db.transaction(async (trx) => {
			await trx.delete(verificationCodesTable).where(eq(verificationCodesTable.userId, id));
			await trx.delete(sessionTable).where(eq(sessionTable.userId, id));
			await trx.delete(userTable).where(eq(userTable.id, id));
		});
	}

	async createOAuthConnection(
		provider: string,
		profile: { avatarUrl: string; email: string; providerUserId: string; name: string }
	) {
		const user = await db.query.userTable.findFirst({
			columns: { id: true },
			where: eq(userTable.email, profile.email)
		});

		const existingConnection = await db.query.oauthConnectionsTable.findFirst({
			where: and(
				eq(oauthConnectionsTable.provider, provider),
				eq(oauthConnectionsTable.providerUserId, profile.providerUserId)
			)
		});

		if (user) {
			if (existingConnection) {
				return existingConnection;
			}

			const [connection] = await db
				.insert(oauthConnectionsTable)
				.values({
					provider,
					providerUserId: profile.providerUserId,
					userId: user.id,
					email: profile.email
				})
				.returning();

			return connection;
		}

		return db.transaction(async (trx) => {
			const [{ id: teamId }] = await trx
				.insert(teamTable)
				.values({ name: `${profile.name}'s Team` })
				.returning();

			const [user] = await trx
				.insert(userTable)
				.values({
					email: profile.email,
					password: generateIdFromEntropySize(10),
					fullName: profile.name,
					activeTeamId: teamId,
					isVerified: true
				})
				.returning();

			await trx.insert(teamMemberTable).values({
				teamId: teamId,
				userId: user.id,
				role: TeamRole.Admin
			});

			const [connection] = await trx
				.insert(oauthConnectionsTable)
				.values({
					provider,
					providerUserId: profile.providerUserId,
					email: profile.email,
					userId: user.id
				})
				.returning();

			return connection;
		});
	}
}

export const authRepository = new AuthRepository();
