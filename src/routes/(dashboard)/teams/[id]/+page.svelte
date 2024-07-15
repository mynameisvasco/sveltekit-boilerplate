<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { capitalize, formHandler } from '$lib/utils.js';
	import { enhance } from '$app/forms';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import TrashIcon from '~icons/solar/trash-bin-minimalistic-2-outline';
	import CrudTable from '$lib/components/partials/crud-table.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { formatDate } from 'date-fns';
	import ResponsiveDrawer from '$lib/components/partials/responsive-drawer.svelte';
	import * as Select from '$lib/components/ui/select/index.js';

	let { data, form } = $props();
	let removeUserId = $state('');
	let isAddMemberDrawerOpen = $state(false);
	let selectedRole = $state<string>('');
</script>

<form
	id="remove-user-form"
	action="/teams/{data.team.id}?/removeMember"
	method="post"
	class="hidden"
	use:enhance={formHandler}
>
	<input type="hidden" name="userId" id="userId" bind:value={removeUserId} />
</form>

<div class="flex items-center justify-between">
	<div class="flex flex-col gap-1">
		<h3>Edit Team</h3>
		<span class="text-sm text-muted-foreground">Manage team information and it's members</span>
	</div>
	<Button onclick={() => (isAddMemberDrawerOpen = true)}>Add Member</Button>
</div>

<Card.Root class="flex-1">
	<Card.Header>
		<Card.Title>Informations</Card.Title>
		<Card.Description>Change team name and picture</Card.Description>
	</Card.Header>
	<Card.Content class="flex items-center gap-6">
		<form
			id="update-team-form"
			action="/teams/{data.team.id}?/update"
			method="post"
			class="grid w-full max-w-xl items-start gap-4"
			use:enhance={formHandler}
		>
			<div class="grid gap-2">
				<Label for="name">Name</Label>
				<Input
					id="name"
					name="name"
					type="text"
					placeholder="jonh@example.com"
					value={data.team.name}
					error={form?.errors?.name?.at(0)}
				/>
			</div>
			<div class="flex items-center gap-8">
				<Avatar.Root>
					<Avatar.Image src="https://github.com/as" alt="@shadcn" />
					<Avatar.Fallback>VS</Avatar.Fallback>
				</Avatar.Root>
				<div class="grid flex-1 gap-2">
					<Label for="picture">Picture</Label>
					<Input id="picture" type="file" />
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="border-t px-6 py-4">
		<Button type="submit" variant="secondary" form="update-team-form">Save</Button>
	</Card.Footer>
</Card.Root>

<Card.Root class="flex-1">
	<Card.Header>
		<Card.Title>Members</Card.Title>
		<Card.Description>Manage team members</Card.Description>
	</Card.Header>
	<Card.Content>
		<CrudTable
			headers={['Name', 'Team Role', 'Joined', 'Remove']}
			body={data.members}
			bordered={false}
			pagination={false}
			placeholder="This team has no users yet"
		>
			{#snippet row(member: any)}
				<Table.Cell>
					<div class="font-medium">{member.fullName}</div>
					<div class="hidden text-sm text-muted-foreground md:inline">{member.email}</div>
				</Table.Cell>
				<Table.Cell class="hidden sm:table-cell">
					<Badge variant="secondary">{capitalize(member.teamRole)}</Badge>
				</Table.Cell>
				<Table.Cell class="hidden sm:table-cell">
					{formatDate(member.joinedAt, 'dd/MM/yyyy')}
				</Table.Cell>
				<Table.Cell>
					<Button
						variant="destructive"
						size="sm"
						type="submit"
						onclick={(e) => {
							e.preventDefault();
							removeUserId = member.id;
							setTimeout(() =>
								(document.getElementById('remove-user-form') as HTMLFormElement)?.dispatchEvent(
									new SubmitEvent('submit')
								)
							);
						}}
					>
						<TrashIcon class="size-4" />
					</Button>
				</Table.Cell>
			{/snippet}
		</CrudTable>
	</Card.Content>
</Card.Root>

<ResponsiveDrawer
	title="Add Team Member"
	description="Add a new member to the team"
	bind:open={isAddMemberDrawerOpen}
>
	<form
		action="/teams/{data.team.id}/?/addMember"
		method="post"
		class="grid items-start gap-4"
		use:enhance={formHandler}
	>
		<div class="grid gap-2">
			<Label for="email">User</Label>
			<Input id="email" name="email" type="email" placeholder="jonh@example.com" />
		</div>
		<div class="grid gap-2">
			<Label for="role">Role</Label>
			<Select.Root onSelectedChange={(e) => (selectedRole = e!.value as string)}>
				<Select.Trigger>
					<Select.Value placeholder="Role" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="member">Member</Select.Item>
					<Select.Item value="admin">Admin</Select.Item>
				</Select.Content>
			</Select.Root>
			<input type="hidden" name="role" bind:value={selectedRole} />
		</div>
		<Button type="submit">Add Member</Button>
	</form>
</ResponsiveDrawer>
