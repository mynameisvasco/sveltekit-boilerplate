import { oauthService } from '$lib/server/auth/services/oauth-service.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const provider = event.url.searchParams.get('provider') ?? '';

	if (!oauthService.isSupportedProvider(provider)) {
		return redirect(307, '/auth/login');
	}

	const { state, codeVerifier, redirectUrl } = await oauthService.getRedirectUrl(provider);

	event.cookies.set('oauth_state', state, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	event.cookies.set('code_verifier', codeVerifier, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	event.cookies.set('oauth_provider', provider, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	if (!redirectUrl) {
		return redirect(307, '/auth/login');
	}

	return redirect(302, redirectUrl.toString());
};
