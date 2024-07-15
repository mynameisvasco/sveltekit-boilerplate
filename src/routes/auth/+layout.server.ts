import { redirect } from '@sveltejs/kit';

export const load = (event) => {
	if (event.locals.user && event.locals.user.isVerified) {
		return redirect(307, '/home');
	}

	if (
		event.locals.user &&
		!event.locals.user.isVerified &&
		event.url.pathname !== '/auth/verify-email'
	) {
		return redirect(307, '/auth/verify-email');
	}
};
