import { verifyEmailDto } from '$lib/server/auth/dtos.js';
import { authRepository } from '$lib/server/auth/repository.js';
import { sendEmailQueue } from '$lib/server/email/queues.js';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { addMinutes } from 'date-fns';

const verify = async (event: RequestEvent) => {
	const { data, error } = await verifyEmailDto.safeParseAsync(event.locals.body);

	if (error) {
		return fail(400, { errors: error.flatten().fieldErrors });
	}

	const didVerify = await authRepository.verifyEmail(event.locals.user!.id, data.code);

	if (!didVerify) {
		return fail(400, { errors: { code: ['Verification code is expired'] } });
	}

	return redirect(307, '/home');
};

const resend = async (event: RequestEvent) => {
	const token = await authRepository.createVerificationCode(
		event.locals.user!.id,
		addMinutes(new Date(), 30)
	);

	sendEmailQueue.add('send-email', {
		to: event.locals.user?.email,
		text: `Your verification code is ${token.id}.`
	});
};

export const actions = { verify, resend };
