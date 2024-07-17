import { SECRET_GOOGLE_CLIENT_KEY } from '$env/static/private';
import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_OAUTH_SUPPORTED_PROVIDERS } from '$env/static/public';
import { capitalize } from '$lib/utils';
import { generateCodeVerifier, generateState, Google } from 'arctic';

class OAuthService {
	isSupportedProvider(provider: string) {
		return PUBLIC_OAUTH_SUPPORTED_PROVIDERS.split(',').includes(provider);
	}

	async getRedirectUrl(provider: string) {
		const state = generateState();
		const codeVerifier = generateCodeVerifier();
		let redirectUrl: URL | undefined;

		if (provider === 'google') {
			redirectUrl = await this.getGoogleProvider().createAuthorizationURL(state, codeVerifier, {
				scopes: ['https://www.googleapis.com/auth/userinfo.email']
			});
		}

		return { state, codeVerifier, redirectUrl };
	}

	async validateAuthorizationCode(provider: string, code: string, codeVerifier: string) {
		if (provider === 'google') {
			return await this.getGoogleProvider().validateAuthorizationCode(code, codeVerifier);
		}
	}

	async getProfile(provider: string, bearerToken: string, fetch: typeof window.fetch) {
		if (provider === 'google') {
			return await this.getGoogleProfile(bearerToken, fetch);
		}
	}

	private getGoogleProvider() {
		return new Google(
			PUBLIC_GOOGLE_CLIENT_ID,
			SECRET_GOOGLE_CLIENT_KEY,
			`${import.meta.env.DEV ? 'http://localhost:5173' : 'https://example.com'}/auth/oauth/callback`
		);
	}

	private async getGoogleProfile(bearerToken: string, fetch: typeof window.fetch) {
		try {
			const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: { Authorization: `Bearer ${bearerToken}` }
			});

			if (!response.ok) {
				return;
			}

			const profile = await response.json();

			return {
				avatarUrl: profile.picture,
				name: capitalize(profile.email.split('@')[0]),
				email: profile.email,
				providerUserId: profile.id
			};
		} catch (e) {
			console.error(e);
		}
	}
}

export const oauthService = new OAuthService();
