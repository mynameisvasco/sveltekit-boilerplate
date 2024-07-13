import { lucia } from '$lib/server/auth/adapter';
import { sendEmailWorker } from '$lib/server/email/workers';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authHandler: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

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

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

const bodyParseHandler: Handle = async ({ event, resolve }) => {
	if (event.request.body) {
		event.locals.body = Object.fromEntries(await event.request.formData());
	}

	return resolve(event);
};

export const handle: Handle = sequence(authHandler, bodyParseHandler);
