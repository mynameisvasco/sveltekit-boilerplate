import { lucia } from '$lib/server/auth/adapter.js';
import { redirect, type RequestEvent } from '@sveltejs/kit';

const logout = async (event: RequestEvent) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		return redirect(307, '/auth/login');
	}

	await lucia.invalidateSession(sessionId);
};

export const actions = { default: logout };
