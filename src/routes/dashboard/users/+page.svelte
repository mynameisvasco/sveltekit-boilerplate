<script lang="ts">
	import { page } from '$app/stores';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { formatDate } from 'date-fns';
	import CrudTable from '$lib/components/partials/crud-table.svelte';
	import CaretDownIcon from '~icons/solar/alt-arrow-down-outline';
	import SquareArrowRightIcon from '~icons/solar/square-arrow-right-up-outline';
	import ResponsiveDrawer from '$lib/components/partials/responsive-drawer.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { enhance } from '$app/forms';
	import { capitalize, formHandler } from '$lib/utils';

	let { form } = $props();
	let selected = $state<any[]>([]);
	let isCreateDrawerOpen = $state(false);
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-col gap-1">
		<h3>Users</h3>
		<span class="text-sm text-muted-foreground">List of all users registered in the system</span>
	</div>

	{#if selected.length === 0}
		<Button class="min-w-[110px]" onclick={() => (isCreateDrawerOpen = true)}>Create</Button>
	{:else}
		<Button variant="outline" class="min-w-[110px]">
			<CaretDownIcon class="mr-2 size-4" /> Actions
		</Button>
	{/if}
</div>

<CrudTable headers={['User', 'Role', 'Status', 'Date', '']} body={$page.data.users} bind:selected>
	{#snippet row(user: any)}
		<Table.Cell>
			<div class="font-medium">{user.fullName}</div>
			<div class="hidden text-sm text-muted-foreground md:inline">{user.email}</div>
		</Table.Cell>
		<Table.Cell class="hidden sm:table-cell">
			{capitalize(user.role)}
		</Table.Cell>
		<Table.Cell class="hidden sm:table-cell">
			<Badge class="text-xs" variant={user.isVerified ? 'secondary' : 'warning'}>
				{user.isVerified ? 'Verified' : 'Not Verified'}
			</Badge>
		</Table.Cell>
		<Table.Cell class="hidden sm:table-cell">
			{formatDate(user.createdAt, 'dd/MM/yyyy')}
		</Table.Cell>
		<Table.Cell>
			<a href="/dashboard/users/{user.id}">
				<SquareArrowRightIcon
					class="size-5 text-muted-foreground transition-all hover:text-foreground"
				/>
			</a>
		</Table.Cell>
	{/snippet}
</CrudTable>

<ResponsiveDrawer
	title="Create User"
	description="Add a new user to the system"
	bind:open={isCreateDrawerOpen}
>
	<form
		action="/dashboard/users?/create"
		method="post"
		class="grid items-start gap-4"
		use:enhance={formHandler}
	>
		<div class="grid gap-2">
			<Label for="email">Email</Label>
			<Input
				id="email"
				name="email"
				type="email"
				placeholder="jonh@example.com"
				error={form?.errors?.email?.at(0)}
			/>
		</div>
		<div class="grid gap-2">
			<Label for="fullName">Full Name</Label>
			<Input
				id="fullName"
				name="fullName"
				placeholder="Jonh Smith"
				error={form?.errors?.fullName?.at(0)}
			/>
		</div>
		<div class="grid gap-2">
			<Label for="username">Password</Label>
			<Input
				id="password"
				name="password"
				type="password"
				autocomplete="new-password"
				placeholder="A hyper-secure password"
				error={form?.errors?.password?.at(0)}
			/>
		</div>
		<Button type="submit">Save</Button>
	</form>
</ResponsiveDrawer>
