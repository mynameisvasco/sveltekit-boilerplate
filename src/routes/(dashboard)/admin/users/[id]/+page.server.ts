import { updateCredenitlasDto } from '$lib/server/auth/dtos.js';
import { authRepository } from '$lib/server/auth/repository.js';
import { Role } from '$lib/server/auth/roles.js';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';

const destroy = async (event: RequestEvent) => {
	await authRepository.deleteUser(Number(event.params.id));

	return {
		message: 'User has been deleted'
	};
};

const update = async (event: RequestEvent) => {
	if (event.locals.user?.role !== Role.Admin) {
		return redirect(307, '/home');
	}

	const { data, error } = await updateCredenitlasDto.safeParseAsync(event.locals.body);

	if (error) {
		return fail(400, { errors: error.flatten().fieldErrors });
	}

	const user = await authRepository.updateUser(
		Number(event.params.id),
		data.email,
		data.fullName,
		data.role,
		data.password
	);

	if (!user) {
		return redirect(307, '/users');
	}

	return {
		message: "User's credentials have been updated"
	};
};

const verifyEmail = async (event: RequestEvent) => {
	await authRepository.verifyEmailWithoutCode(Number(event.params.id));

	return {
		message: 'User email has been verified'
	};
};

export const load = async (event) => {
	const user = await authRepository.findUserById(Number(event.params.id));

	if (!user) {
		return redirect(307, '/users');
	}

	return {
		user,
		sessions: authRepository.findSessionsByUserId(Number(event.params.id)),
		currentSession: event.cookies.get('auth_session'),
		crumb: user.fullName
	};
};

export const actions = { update, verifyEmail, destroy };
