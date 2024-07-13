import { sessionTable, userTable } from '$lib/server/database/schema';
import type { Role } from './roles';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import { db } from '../database/adapter';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	getUserAttributes: (attributes) => {
		return {
			id: attributes.id,
			fullName: attributes.fullName,
			email: attributes.email,
			isVerified: attributes.isVerified,
			role: attributes.role
		};
	},
	getSessionAttributes: (attributes) => {
		return {
			ip: attributes.ip,
			userAgent: attributes.userAgent,
			country: attributes.country
		};
	},
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === 'production'
		}
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		UserId: number;
		DatabaseUserAttributes: {
			id: number;
			fullName: string;
			email: string;
			isVerified: boolean;
			role: Role;
		};
		DatabaseSessionAttributes: {
			ip: string;
			userAgent: string;
			country: string;
		};
	}
}
