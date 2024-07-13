<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SearchIcon from '~icons/solar/magnifer-outline';
	import Sidebar from '$lib/components/partials/sidebar.svelte';
	import MobileSidebar from '$lib/components/partials/mobile-sidebar.svelte';
	import AvatarDropdown from '$lib/components/partials/avatar-dropdown.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { page } from '$app/stores';
	import { getBreadcrumb } from '$lib/utils.js';
	import { Toaster } from '$lib/components/ui/sonner';

	const { children } = $props();
	let crumbs = $derived(getBreadcrumb($page.url.pathname, $page.data.crumb));
</script>

<Toaster />

<div class="flex min-h-screen w-full flex-col">
	<Sidebar />
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<header
			class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
		>
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
			<MobileSidebar />
			<div class="relative ml-auto flex-1 md:grow-0">
				<SearchIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Search..."
					class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
				/>
			</div>
			<AvatarDropdown />
		</header>
		<main class="grid flex-1 items-start gap-6 p-4 sm:px-6 sm:py-0">
			{@render children()}
		</main>
	</div>
</div>
