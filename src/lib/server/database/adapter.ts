import { SECRET_DATABASE_URL } from '$env/static/private';
import {
	permissionRelations,
	permissionTable,
	sessionTable,
	userPermissionRelations,
	userPermissionTable,
	userRelations,
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
		permissionTable,
		userPermissionTable,
		verificationCodesTable,
		userRelations,
		permissionRelations,
		userPermissionRelations
	}
});
