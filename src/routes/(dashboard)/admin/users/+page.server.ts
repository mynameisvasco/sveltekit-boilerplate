import { registerDto } from '$lib/server/auth/dtos.js';
import { authRepository } from '$lib/server/auth/repository';
import { error, fail, type RequestEvent } from '@sveltejs/kit';

const create = async (event: RequestEvent) => {
	const { data, error } = await registerDto.safeParseAsync(event.locals.body);

	if (error) {
		return fail(400, { errors: error.flatten().fieldErrors });
	}

	const user = await authRepository.createUser(data.email, data.password, data.fullName);

	if (!user) {
		return fail(400, {
			errors: { email: ['Email already exists'], fullName: undefined, password: undefined }
		});
	}
};

export const load = async (event) => {
	const page = Number(event.url.searchParams.get('page'));
	const limit = Number(event.url.searchParams.get('limit'));

	if (isNaN(page) || isNaN(limit)) {
		return error(400, 'Invalid page or limit');
	}

	return {
		users: authRepository.findUsers(page, limit)
	};
};

export const actions = { create };
