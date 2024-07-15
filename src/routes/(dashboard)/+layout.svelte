<script lang="ts">
	import Sidebar from '$lib/components/partials/sidebar.svelte';
	import MobileSidebar from '$lib/components/partials/mobile-sidebar.svelte';
	import AvatarDropdown from '$lib/components/partials/avatar-dropdown.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import TeamSelect from '$lib/components/partials/team-select.svelte';
	import Breadcrumb from '$lib/components/partials/breadcrumb.svelte';

	const { children } = $props();
</script>

<Toaster />

<div class="flex min-h-screen w-full flex-col">
	<Sidebar />
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<header
			class="flex items-center gap-4 border-b bg-background px-4 pb-4 pt-2 sm:border-0 sm:px-6 sm:pt-0"
		>
			<Breadcrumb />
			<MobileSidebar />
			<TeamSelect />
			<AvatarDropdown />
		</header>
		<main class="grid flex-1 items-start gap-6 p-4 sm:px-6 sm:py-0">
			{@render children()}
		</main>
	</div>
</div>
