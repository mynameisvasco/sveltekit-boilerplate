import { TeamRole } from './roles';
import { and, asc, count, desc, eq } from 'drizzle-orm';
import { db } from '../database/adapter';
import { teamMemberTable, teamTable, userTable } from '../database/schema';

class TeamRepository {
	async findTeamsByUserId(userId: number) {
		const memberships = await db.query.teamMemberTable.findMany({
			where: eq(teamMemberTable.userId, userId),
			with: { team: true }
		});

		return {
			data: memberships.flatMap((membership) => membership.team),
			count: memberships.length
		};
	}

	async findTeamById(teamId: number) {
		const team = await db.query.teamTable.findFirst({ where: eq(teamTable.id, teamId) });

		if (!team) {
			return;
		}

		return team;
	}

	async findTeamMemberByUserId(teamId: number, userId: number) {
		return db.query.teamMemberTable.findFirst({
			where: and(eq(teamMemberTable.userId, userId), eq(teamMemberTable.teamId, teamId))
		});
	}

	async isTeamMember(teamId: number, userId: number) {
		const teamMember = await db.query.teamMemberTable.findFirst({
			where: and(eq(teamMemberTable.userId, userId), eq(teamMemberTable.teamId, teamId)),
			columns: { teamId: true }
		});

		return !!teamMember;
	}

	async updateTeamMember(teamId: number, userId: number, role: TeamRole) {
		await db
			.update(teamMemberTable)
			.set({ role })
			.where(and(eq(teamMemberTable.teamId, teamId), eq(teamMemberTable.userId, userId)));
	}

	async findTeamMembers(teamId: number, page: number, limit: number = 20) {
		const members = await db.query.teamMemberTable.findMany({
			where: eq(teamMemberTable.teamId, teamId),
			offset: limit * (page - 1),
			orderBy: [desc(teamMemberTable.userId)],
			with: { user: true }
		});

		return {
			data: members.map((member) => ({
				...member.user,
				joinedAt: member.createdAt,
				teamRole: member.role
			})),
			count: await db
				.select({ count: count() })
				.from(teamMemberTable)
				.where(eq(teamMemberTable.teamId, teamId))
		};
	}

	async updateTeam(id: number, name: string) {
		await db.update(teamTable).set({ name }).where(eq(teamTable.id, id));
	}

	async createTeam(name: string, userId: number) {
		return await db.transaction(async (trx) => {
			const [team] = await db.insert(teamTable).values({ name: name }).returning();
			await trx.insert(teamMemberTable).values({ teamId: team.id, userId, role: TeamRole.Admin });
			return team;
		});
	}

	async addTeamMember(teamId: number, userId: number, role: TeamRole) {
		const membership = await db.query.teamMemberTable.findFirst({
			where: and(eq(teamMemberTable.teamId, teamId), eq(teamMemberTable.userId, userId))
		});

		if (membership) {
			return false;
		}

		await db.insert(teamMemberTable).values({ teamId, userId, role });
		return true;
	}

	async removeTeamMember(teamId: number, userId: number) {
		return db.transaction(async (trx) => {
			await trx
				.delete(teamMemberTable)
				.where(and(eq(teamMemberTable.teamId, teamId), eq(teamMemberTable.userId, userId)));

			const [{ count: membersCount }] = await db
				.select({ count: count() })
				.from(teamMemberTable)
				.where(eq(teamMemberTable.teamId, teamId));

			const [{ count: adminCount }] = await db
				.select({ count: count() })
				.from(teamMemberTable)
				.where(and(eq(teamMemberTable.teamId, teamId), eq(teamMemberTable.role, TeamRole.Admin)));

			if (membersCount < 0) {
				trx.rollback();
				return false;
			}

			if (adminCount === 0) {
				const oldestMembership = await trx.query.teamMemberTable.findFirst({
					orderBy: [asc(teamMemberTable.createdAt)]
				});

				await trx
					.update(teamMemberTable)
					.set({ role: TeamRole.Admin })
					.where(eq(teamMemberTable.userId, oldestMembership!.userId));
			}

			return true;
		});
	}

	async changeActiveTeam(teamId: number, userId: number) {
		await db.update(userTable).set({ activeTeamId: teamId }).where(eq(userTable.id, userId));
	}
}

export const teamRepository = new TeamRepository();
