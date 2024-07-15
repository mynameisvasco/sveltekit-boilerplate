<script lang="ts">
	import { enhance } from '$app/forms';
	import CrudTable from '$lib/components/partials/crud-table.svelte';
	import ResponsiveDrawer from '$lib/components/partials/responsive-drawer.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import SquareArrowRightIcon from '~icons/solar/square-arrow-right-up-outline';
	import { formHandler } from '$lib/utils';

	let { data, form } = $props();
	let isCreateDrawerOpen = $state(false);
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-col gap-1">
		<h3>Teams</h3>
		<span class="text-sm text-muted-foreground">List of all of your teams</span>
	</div>
	<Button onclick={() => (isCreateDrawerOpen = true)}>Create</Button>
</div>

<CrudTable body={data.teams}>
	{#snippet row(team: any)}
		<Table.Cell>
			<div class="flex items-center gap-4">
				<img
					src="https://api.dicebear.com/9.x/shapes/svg?seed={team.name.split(' ')[0]}"
					alt={team.name}
					class="size-6 rounded-md"
				/>
				{team.name}
				{#if data.team?.id === team.id}
					<Badge variant="secondary">Current</Badge>
				{/if}
			</div>
		</Table.Cell>
		<Table.Cell>
			<a href="/teams/{team.id}">
				<SquareArrowRightIcon
					class="size-5 text-muted-foreground transition-all hover:text-foreground"
				/>
			</a>
		</Table.Cell>
	{/snippet}
</CrudTable>

<ResponsiveDrawer
	title="Create Team"
	description="Add a new team to the system"
	bind:open={isCreateDrawerOpen}
>
	<form
		action="/teams?/create"
		method="post"
		class="grid items-start gap-4"
		use:enhance={formHandler}
	>
		<div class="grid gap-2">
			<Label for="email">Name</Label>
			<Input
				id="name"
				name="name"
				type="text"
				placeholder="My Amzing Team"
				error={form?.errors?.name?.at(0)}
			/>
		</div>
		<Button type="submit">Save</Button>
	</form>
</ResponsiveDrawer>
