<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		open = $bindable(false),
		children
	} = $props<{ title: string; description: string; open: boolean; children: Snippet }>();
	let innerWidth = $state(768);
	let isDesktop = $derived(innerWidth >= 768);
</script>

<svelte:window bind:innerWidth />

{#if isDesktop}
	<Dialog.Root bind:open>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>
					{title}
				</Dialog.Title>
				<Dialog.Description>
					{description}
				</Dialog.Description>
			</Dialog.Header>
			<div class="px-4 lg:px-0">
				{@render children()}
			</div>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>
					{title}
				</Drawer.Title>
				<Drawer.Description>
					{description}
				</Drawer.Description>
			</Drawer.Header>
			<div class="px-4 lg:px-0">
				{@render children()}
			</div>
			<Drawer.Footer class="pt-2">
				<Drawer.Close asChild let:builder>
					<Button variant="outline" builders={[builder]}>Cancel</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
