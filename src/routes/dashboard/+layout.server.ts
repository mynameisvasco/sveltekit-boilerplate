import { authRepository } from '$lib/server/auth/repository.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.locals.user) {
		return redirect(307, '/auth/login');
	}

	if (!event.locals.user.isVerified) {
		return redirect(307, '/auth/verify-email');
	}

	const routes = await authRepository.findRoutesByRole(event.locals.user.role);

	return {
		user: event.locals.user,
		routes: ['/dashboard/home', ...routes]
	};
};
