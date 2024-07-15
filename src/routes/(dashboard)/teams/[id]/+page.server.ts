import { authRepository } from '$lib/server/auth/repository.js';
import { addTeamMemberDto, removeTeamMemberDto, updateTeamDto } from '$lib/server/teams/dtos.js';
import { teamRepository } from '$lib/server/teams/repository.js';
import { TeamRole } from '$lib/server/teams/roles.js';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';

const update = async (event: RequestEvent) => {
	const teamId = Number(event.params.id);
	const isMember = await teamRepository.isTeamMember(teamId, event.locals.user!.id);

	if (isNaN(teamId) || !isMember) {
		return redirect(307, '/teams');
	}

	const { data, error } = await updateTeamDto.safeParseAsync(event.locals.body);

	if (error) {
		return fail(400, { errors: error.flatten().fieldErrors });
	}

	await teamRepository.updateTeam(teamId, data.name);
	return { message: 'Team has been updated' };
};

const change = async (event: RequestEvent) => {
	const teamId = Number(event.params.id);
	const isMember = await teamRepository.isTeamMember(teamId, event.locals.user!.id);

	if (isNaN(teamId) || !isMember) {
		return redirect(307, '/teams');
	}

	await teamRepository.changeActiveTeam(teamId, event.locals.user!.id);
	return { message: 'Active team has been changed' };
};

const removeMember = async (event: RequestEvent) => {
	const teamId = Number(event.params.id);
	const membership = await teamRepository.findTeamMemberByUserId(teamId, event.locals.user!.id);

	if (isNaN(teamId) || membership?.role !== TeamRole.Admin) {
		return redirect(307, '/teams');
	}

	const { data, error } = await removeTeamMemberDto.safeParseAsync(event.locals.body);

	if (error) {
		return fail(400, { errors: error.flatten().fieldErrors });
	}

	const isRemoved = await teamRepository.removeTeamMember(teamId, data.userId);

	if (!isRemoved) {
		return fail(400, { errorMessage: 'Team must have at least one member' });
	}

	return { message: 'Member has been removed' };
};

const addMember = async (event: RequestEvent) => {
	const teamId = Number(event.params.id);
	const membership = await teamRepository.findTeamMemberByUserId(teamId, event.locals.user!.id);

	if (isNaN(teamId) || membership?.role !== TeamRole.Admin) {
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

	const isAdded = await teamRepository.addTeamMember(teamId, user?.id, data.role);

	if (!isAdded) {
		return fail(400, { errorMessage: 'User is already a member of the team' });
	}

	return { message: 'Member has been added' };
};

export const load = async (event) => {
	const teamId = Number(event.params.id);
	const page = Number(event.url.searchParams.get('page') ?? 1);
	const isMember = await teamRepository.isTeamMember(teamId, event.locals.user!.id);

	if (isNaN(teamId) || page <= 0 || !isMember) {
		return redirect(307, '/teams');
	}

	const team = await teamRepository.findTeamById(teamId);

	if (!team) {
		return redirect(307, '/teams');
	}

	return {
		team,
		members: teamRepository.findTeamMembers(teamId, page),
		crumb: team!.name
	};
};

export const actions = { change, update, removeMember, addMember };
