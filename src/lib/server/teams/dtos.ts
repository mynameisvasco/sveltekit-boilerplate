import { TeamRole } from './roles';
import { z } from 'zod';

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
