import { authRepository } from '$lib/server/auth/repository.js';
import { redirect, type RequestEvent } from '@sveltejs/kit';

const change = async (event: RequestEvent) => {
	const teamId = Number(event.params.id);

	if (!event.params.id || isNaN(teamId)) {
		return redirect(307, '/home');
	}

	const isMember = await authRepository.isTeamMember(teamId, event.locals.user!.id);
	console.log(isMember);
	if (!isMember) {
		return redirect(307, '/home');
	}

	await authRepository.changeActiveTeam(teamId, event.locals.user!.id);
};

export const actions = { change };
