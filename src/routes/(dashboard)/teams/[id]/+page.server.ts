import { addTeamMemberDto, removeTeamMemberDto, updateTeamDto } from '$lib/server/auth/dtos.js';
import { authRepository } from '$lib/server/auth/repository.js';
import { TeamRole } from '$lib/server/auth/roles.js';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';

const update = async (event: RequestEvent) => {
	const teamId = Number(event.params.id);

	if (isNaN(teamId)) {
		return redirect(307, '/teams');
	}

	const { data, error } = await updateTeamDto.safeParseAsync(event.locals.body);

	if (error) {
		return fail(400, { errors: error.flatten().fieldErrors });
	}

	const isMember = await authRepository.isTeamMember(teamId, event.locals.user!.id);

	if (!isMember) {
		return redirect(307, '/teams');
	}

	await authRepository.updateTeam(teamId, data.name);
	return { message: 'Team has been updated' };
};

const change = async (event: RequestEvent) => {
	const teamId = Number(event.params.id);

	if (!event.params.id || isNaN(teamId)) {
		return redirect(307, '/teams');
	}

	const isMember = await authRepository.isTeamMember(teamId, event.locals.user!.id);

	if (!isMember) {
		return redirect(307, '/teams');
	}

	await authRepository.changeActiveTeam(teamId, event.locals.user!.id);
	return { message: 'Active team has been changed' };
};

const removeMember = async (event: RequestEvent) => {
	const teamId = Number(event.params.id);
	const loggedUserMembership = await authRepository.findTeamMemberByUserId(
		teamId,
		event.locals.user!.id
	);

	if (isNaN(teamId) || loggedUserMembership?.role !== TeamRole.Admin) {
		return redirect(307, '/teams');
	}

	const { data, error } = await removeTeamMemberDto.safeParseAsync(event.locals.body);

	if (error) {
		return fail(400, { errors: error.flatten().fieldErrors });
	}

	const isMember = await authRepository.isTeamMember(teamId, data.userId);

	if (!isMember) {
		return fail(400, { errorMessage: 'You are not allowed to remove this member' });
	}

	const membersCount = await authRepository.countTeamMembers(teamId);

	if (membersCount <= 1) {
		return fail(400, { errorMessage: 'Team must have at least one member' });
	}

	await authRepository.removeTeamMember(teamId, data.userId);
	const adminCount = await authRepository.countTeamMembers(teamId, TeamRole.Admin);

	if (adminCount === 0) {
		const newAdmin = await authRepository.findTeamMembers(teamId, 1, 1);
		await authRepository.updateTeamMember(teamId, newAdmin.data[0].id, TeamRole.Admin);
	}

	return { message: 'Member has been removed' };
};

const addMember = async (event: RequestEvent) => {
	const teamId = Number(event.params.id);
	const loggedUserMembership = await authRepository.findTeamMemberByUserId(
		teamId,
		event.locals.user!.id
	);

	if (isNaN(teamId) || loggedUserMembership?.role !== TeamRole.Admin) {
		return redirect(307, '/teams');
	}

	const { data, error } = await addTeamMemberDto.safeParseAsync(event.locals.body);

	if (error) {
		return fail(400, { errors: error.flatten().fieldErrors });
	}

	const user = await authRepository.findUserByEmail(data.email);

	if (!user) {
		return fail(400, { errorMessage: 'User not found' });
	}

	await authRepository.addTeamMember(teamId, user?.id, data.role);
	return { message: 'Member has been added' };
};

export const load = async (event) => {
	const teamId = Number(event.params.id);
	const page = Number(event.url.searchParams.get('page') ?? 1);

	if (isNaN(teamId) || page <= 0) {
		return redirect(307, '/teams');
	}

	const team = await authRepository.findTeamById(teamId);
	const isMember = await authRepository.isTeamMember(teamId, event.locals.user!.id);

	if (!isMember || !team) {
		return redirect(307, '/teams');
	}

	return {
		team,
		members: authRepository.findTeamMembers(teamId, page),
		crumb: team!.name
	};
};

export const actions = { change, update, removeMember, addMember };
