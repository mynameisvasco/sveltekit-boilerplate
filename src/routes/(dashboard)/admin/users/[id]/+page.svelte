<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { capitalize, formHandler } from '$lib/utils';
	import CaretDownIcon from '~icons/solar/alt-arrow-down-outline';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { formatDate, formatDistanceToNow } from 'date-fns';
	import CrudTable from '$lib/components/partials/crud-table.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import UserAgent from '$lib/components/partials/user-agent.svelte';
	import CountryList from 'country-list-with-dial-code-and-flag';
	import TrashIcon from '~icons/solar/trash-bin-minimalistic-2-outline';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Select from '$lib/components/ui/select';

	let { data, form } = $props();
	let selectedRole = $state(data.user.role);
	let deleteSessionId = $state('');
</script>

<form
	id="destroy-session-form"
	action="/admin/users/{data.user.id}/session?/destroy"
	method="post"
	class="hidden"
	use:enhance={formHandler}
>
	<input type="hidden" name="sessionId" id="sessionId" bind:value={deleteSessionId} />
</form>

<div class="flex items-center justify-between">
	<div class="flex flex-col gap-1">
		<h3>Edit User</h3>
		<span class="text-sm text-muted-foreground">Modify user's informations</span>
	</div>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline">
				<CaretDownIcon class="mr-2 size-4" /> Actions
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			{#if !data.user.isVerified}
				<DropdownMenu.Item>
					<form
						action="/admin/users/{data.user.id}?/verifyEmail"
						method="post"
						use:enhance={formHandler}
					>
						<button type="submit">Verify Email</button>
					</form>
				</DropdownMenu.Item>
			{/if}
			<DropdownMenu.Item class="text-destructive">
				<form action="/admin/users/{data.user.id}?/destroy" method="post" use:enhance={formHandler}>
					<button type="submit">Delete</button>
				</form>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>

<Card.Root class="flex-1">
	<Card.Content class="flex flex-col gap-6 pt-6">
		<div class="flex items-center gap-3">
			<Avatar.Root class="size-10">
				<Avatar.Image src="https://github.com/as" alt="@shadcn" />
				<Avatar.Fallback>VS</Avatar.Fallback>
			</Avatar.Root>
			<div class="flex flex-col">
				<span class="text-sm">{data.user.fullName}</span>
				<span class="text-sm text-muted-foreground">
					Member since {formatDate(data.user.createdAt!, 'dd MMM yyyy')}
				</span>
			</div>
		</div>
	</Card.Content>
</Card.Root>

<Card.Root class="flex-1">
	<Card.Header>
		<Card.Title>Credentials</Card.Title>
		<Card.Description>Change user's email or password</Card.Description>
	</Card.Header>
	<Card.Content class="flex items-center gap-6">
		<form
			id="update-user-form"
			action="/admin/users/{data.user.id}?/update"
			method="post"
			class="grid w-full max-w-xl items-start gap-4"
			use:enhance={formHandler}
		>
			<div class="relative grid gap-2">
				<Label for="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="jonh@example.com"
					value={data.user.email}
					error={form?.errors?.email?.at(0)}
				/>

				<div class="absolute right-4 top-7">
					<Badge class="text-xs" variant={data.user.isVerified ? 'default' : 'warning'}>
						{data.user.isVerified ? 'Verified' : 'Not Verified'}
					</Badge>
				</div>
			</div>
			<div class="grid gap-2">
				<Label for="fullName">Full Name</Label>
				<Input
					id="fullName"
					name="fullName"
					placeholder="Jonh Smith"
					value={data.user.fullName}
					error={form?.errors?.fullName?.at(0)}
				/>
			</div>
			<div class="grid gap-2">
				<Label for="role">Role</Label>
				<Select.Root
					onSelectedChange={(e) => (selectedRole = e!.value)}
					selected={{ value: data.user.role, label: capitalize(data.user.role) }}
				>
					<Select.Trigger>
						<Select.Value placeholder="Role" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="user">User</Select.Item>
						<Select.Item value="admin">Admin</Select.Item>
					</Select.Content>
				</Select.Root>
				<input type="hidden" name="role" id="role" bind:value={selectedRole} />
			</div>
			<div class="grid gap-2">
				<Label for="password">Password</Label>
				<Input
					id="password"
					name="password"
					type="password"
					autocomplete="new-password"
					placeholder="A hyper-secure password"
					error={form?.errors?.password?.at(0)}
				/>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="border-t px-6 py-4">
		<Button type="submit" form="update-user-form">Save</Button>
	</Card.Footer>
</Card.Root>

<Card.Root class="flex-1">
	<Card.Header>
		<Card.Title>Sessions</Card.Title>
		<Card.Description>Location and device used in each user session</Card.Description>
	</Card.Header>
	<Card.Content>
		<CrudTable
			headers={['Country', 'Ip', 'Device', 'Expiration', 'Revoke']}
			body={data.sessions}
			bordered={false}
			pagination={false}
			placeholder="This user has no sessions available"
		>
			{#snippet row(session: any)}
				<Table.Cell class="hidden items-center border-b sm:table-cell">
					{#if session.country === 'Unknown'}
						<span>Unknown</span>
					{:else}
						<span>
							{CountryList.findOneByCountryCode(session.country)?.flag}
						</span>
						<span>
							{new Intl.DisplayNames(['en'], { type: 'region' }).of(session.country)}
						</span>
					{/if}
				</Table.Cell>
				<Table.Cell class="border-b">
					<div class="font-medium">{session.ip}</div>
				</Table.Cell>
				<Table.Cell class="hidden  border-b sm:table-cell">
					<div class="flex items-center gap-4">
						<UserAgent userAgent={session.userAgent} />
						{#if data.currentSession === session.id}
							<Badge variant="secondary" class="inline-block">This Device</Badge>
						{/if}
					</div>
				</Table.Cell>
				<Table.Cell class="hidden border-b sm:table-cell">
					Expires in {formatDistanceToNow(session.expiresAt)}
				</Table.Cell>
				<Table.Cell class="border-b ">
					<Button
						variant="destructive"
						size="sm"
						type="submit"
						onclick={(e) => {
							e.preventDefault();
							deleteSessionId = session.id;
							setTimeout(() =>
								(document.getElementById('destroy-session-form') as HTMLFormElement)?.dispatchEvent(
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
