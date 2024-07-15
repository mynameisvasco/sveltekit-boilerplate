import { SECRET_DATABASE_URL } from '$env/static/private';
import {
	sessionTable,
	teamMemberRelations,
	teamMemberTable,
	teamTable,
	userTable,
	verificationCodesTable
} from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(SECRET_DATABASE_URL);

export const db = drizzle(client, {
	schema: {
		userTable,
		sessionTable,
		verificationCodesTable,
		teamTable,
		teamMemberTable,
		teamMemberRelations
	}
});
