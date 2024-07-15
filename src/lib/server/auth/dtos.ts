import { Role } from './roles';
import { z } from 'zod';

export const loginDto = z.object({
	email: z.string().email(),
	password: z.string().min(6)
});

export const registerDto = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	fullName: z.string().min(2)
});

export const verifyEmailDto = z.object({
	code: z.string().length(16)
});

export const deleteSessionDto = z.object({
	sessionId: z.string()
});

export const updateCredenitlasDto = z.object({
	email: z.string().email(),
	fullName: z.string().min(2),
	password: z.string().optional().nullable(),
	role: z.enum([Role.Admin, Role.User])
});
