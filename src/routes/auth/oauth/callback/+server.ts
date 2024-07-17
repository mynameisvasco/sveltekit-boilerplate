import { lucia } from '$lib/server/auth/adapter.js';
import { authRepository } from '$lib/server/auth/repository.js';
import { oauthService } from '$lib/server/auth/services/oauth-service.js';
import { error, redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('oauth_state') ?? null;
	const codeVerifier = event.cookies.get('code_verifier') ?? null;
	const provider = event.cookies.get('oauth_provider') ?? null;

	if (!code || !codeVerifier || !state || !storedState || !provider) {
		return error(404);
	}

	const tokens = await oauthService.validateAuthorizationCode(provider, code, codeVerifier);

	if (!tokens) {
		return error(404);
	}

	const profile = await oauthService.getProfile(provider, tokens.accessToken, fetch);
	if (!profile) {
		return error(404);
	}

	const oauthConnection = await authRepository.createOAuthConnection(provider, profile);

	if (!oauthConnection) {
		console.error('Failed to create OAuth connection');
		return error(400);
	}

	let countryCode = 'Unknown';

	try {
		const ipResponse = await event.fetch(`https://api.country.is/${event.getClientAddress()}`);
		const { country, error } = await ipResponse.json();
		countryCode = error ? 'Unknown' : country;
	} catch (e) {
		//
	}

	const session = await lucia.createSession(oauthConnection.userId, {
		ip: event.getClientAddress(),
		userAgent: event.request.headers.get('user-agent') ?? 'Unknown',
		country: countryCode
	});

	const sessionCookie = lucia.createSessionCookie(session.id);

	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	return redirect(307, '/home');
};
