<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import MenuIcon from '~icons/solar/hamburger-menu-line-duotone';
	import HomeIcon from '~icons/solar/home-smile-angle-outline';
	import UsersIcon from '~icons/solar/users-group-rounded-outline';
	import SettingsIcon from '~icons/solar/settings-minimalistic-outline';
	import BoltIcon from '~icons/solar/bolt-bold-duotone';
	import { page } from '$app/stores';
</script>

{#snippet navItem(name: string, href: string, icon: any)}
	<a
		{href}
		class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
		class:text-primary={$page.url.pathname === href}
	>
		<svelte:component this={icon} class="size-5"></svelte:component>
		{name}
	</a>
{/snippet}

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
			<MenuIcon class="h-5 w-5" />
			<span class="sr-only">Toggle Menu</span>
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="left" class="sm:max-w-xs">
		<nav class="grid gap-6 text-lg font-medium">
			<a
				href="/dashboard/home"
				class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
			>
				<BoltIcon class="size-5" />
				<span class="sr-only">Acme Inc</span>
			</a>
			{@render navItem('Home', '/dashboard/home', HomeIcon)}
			{@render navItem('Users', '/dashboard/users', UsersIcon)}
			{@render navItem('Settings', '/dashboard/settings', SettingsIcon)}
		</nav>
	</Sheet.Content>
</Sheet.Root>
