import { relations, sql } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { Role } from '../auth/roles';

export const userTable = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').unique().notNull(),
	password: text('password').notNull(),
	fullName: text('full_name').notNull(),
	phone: text('phone'),
	country: text('country'),
	role: text('role').notNull().default(Role.User),
	isVerified: boolean('is_verified').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

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
