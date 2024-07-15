import { createTeamDto } from '$lib/server/auth/dtos.js';
import { authRepository } from '$lib/server/auth/repository.js';
import { fail, type RequestEvent } from '@sveltejs/kit';

const create = async (event: RequestEvent) => {
	const { data, error } = await createTeamDto.safeParseAsync(event.locals.body);

	if (error) {
		return fail(400, { errors: error.flatten().fieldErrors });
	}

	await authRepository.createTeam(data.name, event.locals.user!.id);

	return {
		message: 'Team has been created'
	};
};

export const actions = { create };
