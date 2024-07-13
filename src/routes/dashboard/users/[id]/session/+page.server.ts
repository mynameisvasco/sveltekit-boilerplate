import { lucia } from '$lib/server/auth/adapter.js';
import { deleteSessionDto } from '$lib/server/auth/dtos.js';
import { Role } from '$lib/server/auth/roles.js';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';

const destroy = async (event: RequestEvent) => {
	if (event.locals.user?.role !== Role.Admin) {
		return redirect(307, '/dashboard/home');
	}

	const { data, error } = await deleteSessionDto.safeParseAsync(event.locals.body);

	if (error) {
		return fail(400, { errors: error.flatten().fieldErrors });
	}

	await lucia.invalidateSession(data.sessionId);
};

export const actions = { destroy };
