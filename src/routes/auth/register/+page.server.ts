import { lucia } from '$lib/server/auth/adapter.js';
import { registerDto } from '$lib/server/auth/dtos.js';
import { authRepository } from '$lib/server/auth/repository.js';
import type { RequestEvent } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';

async function register(event: RequestEvent) {
	const { data, error } = await registerDto.safeParseAsync(event.locals.body);

	if (error) {
		return fail(400, { errors: error.flatten().fieldErrors });
	}

	const isUnique = await authRepository.isUniqueEmail(data.email);

	if (!isUnique) {
		return fail(400, { errors: { email: [true], password: ['Email already in use'] } });
	}

	const user = await authRepository.createUser(data.email, data.password, data.fullName);

	let countryCode = 'Unknown';

	try {
		const ipResponse = await event.fetch(`https://api.country.is/${event.getClientAddress()}`);
		const { country, error } = await ipResponse.json();
		countryCode = error ? 'Unknown' : country;
	} catch (e) {
		//
	}

	const session = await lucia.createSession(user.id, {
		ip: event.getClientAddress(),
		userAgent: event.request.headers.get('user-agent') ?? 'Unknown',
		country: countryCode
	});

	const sessionCookie = lucia.createSessionCookie(session.id);

	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	if (!user.isVerified) {
		return redirect(307, '/auth/verify-email');
	}

	return redirect(307, '/dashboard/home');
}

export const actions = { default: register };
