import { Role, TeamRole } from './roles';
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

export const updateTeamDto = z.object({
	name: z.string().min(2)
});

export const createTeamDto = z.object({
	name: z.string().min(2)
});

export const removeTeamMemberDto = z.object({
	userId: z.coerce.number().min(1)
});

export const addTeamMemberDto = z.object({
	email: z.string().email(),
	role: z.enum([TeamRole.Admin, TeamRole.Member])
});
