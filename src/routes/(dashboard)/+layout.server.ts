import { authRepository } from '$lib/server/auth/repository.js';
import { teamRepository } from '$lib/server/teams/repository.js';

export const load = async (event) => {
	return {
		user: event.locals.user,
		team: event.locals.team,
		teams: teamRepository.findTeamsByUserId(event.locals.user!.id)
	};
};
