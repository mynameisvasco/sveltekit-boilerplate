<script lang="ts">
	import { page } from '$app/stores';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { getBreadcrumb } from '$lib/utils';
	import Skeleton from '../ui/skeleton/skeleton.svelte';

	let crumbs = $derived(getBreadcrumb($page.url.pathname, $page.data.crumb));
</script>

<Breadcrumb.Root class="hidden md:flex">
	<Breadcrumb.List>
		{#each crumbs as crumb, index}
			<Breadcrumb.Item>
				<Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
			</Breadcrumb.Item>
			{#if index !== crumbs.length - 1}
				<Breadcrumb.Separator>/</Breadcrumb.Separator>
			{/if}
		{:else}
			<Breadcrumb.Item>
				<Skeleton class="w-[50px] h-2" />
			</Breadcrumb.Item>
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
