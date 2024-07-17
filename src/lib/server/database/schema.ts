import { relations } from 'drizzle-orm';
import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp
} from 'drizzle-orm/pg-core';
import { Role } from '../auth/roles';
import { TeamRole } from '../teams/roles';

export const userTable = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').unique().notNull(),
	password: text('password').notNull(),
	fullName: text('full_name').notNull(),
	phone: text('phone'),
	country: text('country'),
	role: text('role').notNull().default(Role.User),
	activeTeamId: integer('active_team_id')
		.references(() => teamTable.id)
		.notNull(),
	isVerified: boolean('is_verified').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export const oauthConnectionsTable = pgTable(
	'oauth_connections',
	{
		userId: integer('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		email: text('email').notNull(),
		providerUserId: text('provider_user_id').notNull(),
		provider: text('provider').notNull()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.providerUserId, table.userId] })
	})
);

export const teamTable = pgTable('teams', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export const teamMemberTable = pgTable(
	'team_members',
	{
		teamId: integer('team_id')
			.notNull()
			.references(() => teamTable.id, { onDelete: 'cascade' }),
		userId: integer('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		role: text('role').notNull().default(TeamRole.Member),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.teamId, table.userId] })
	})
);

export const sessionTable = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	ip: text('ip').notNull(),
	country: text('country').notNull(),
	userAgent: text('user_agent').notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const verificationCodesTable = pgTable('verification_codes', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	validUntil: timestamp('valid_until', { withTimezone: true, mode: 'date' }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export const teamMemberRelations = relations(teamMemberTable, ({ one }) => ({
	user: one(userTable, {
		fields: [teamMemberTable.userId],
		references: [userTable.id]
	}),
	team: one(teamTable, {
		fields: [teamMemberTable.teamId],
		references: [teamTable.id]
	})
}));
