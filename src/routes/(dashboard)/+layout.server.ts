import { authRepository } from '$lib/server/auth/repository.js';

export const load = async (event) => {
	return {
		user: event.locals.user,
		team: event.locals.team,
		teams: authRepository.findTeamsByUserId(event.locals.user!.id)
	};
};
