import { lucia } from '$lib/server/auth/adapter';
import { Role } from '$lib/server/auth/roles';
import { teamRepository } from '$lib/server/teams/repository';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authHandler: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);

	if (!sessionId && !event.url.pathname.startsWith('/auth')) {
		return redirect(307, '/auth/login');
	}

	if (!sessionId && event.url.pathname === '/auth/verify-email') {
		return redirect(307, '/auth/login');
	}

	if (sessionId) {
		const { session, user } = await lucia.validateSession(sessionId);

		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}

		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}

		if (user) {
			event.locals.user = user;
			event.locals.session = session;
			event.locals.team = (await teamRepository.findTeamById(user.activeTeamId)) ?? null;
		}
	}

	if (sessionId && event.url.pathname !== '/auth/verify-email' && !event.locals.user?.isVerified) {
		return redirect(307, '/auth/verify-email');
	}

	if (event.url.pathname.startsWith('/admin') && event.locals.user?.role !== Role.Admin) {
		return redirect(307, '/home');
	}

	return resolve(event);
};

const bodyParseHandler: Handle = async ({ event, resolve }) => {
	if (event.request.body) {
		event.locals.body = Object.fromEntries(await event.request.formData());
	}

	return resolve(event);
};

export const handle: Handle = sequence(authHandler, bodyParseHandler);
