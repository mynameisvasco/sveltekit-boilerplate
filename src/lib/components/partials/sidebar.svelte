<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import HomeIcon from '~icons/solar/home-smile-angle-outline';
	import UsersIcon from '~icons/solar/users-group-rounded-outline';
	import SettingsIcon from '~icons/solar/settings-minimalistic-outline';
	import BoltIcon from '~icons/solar/bolt-bold-duotone';
	import { page } from '$app/stores';
</script>

{#snippet navItem(name: string, href: string, icon: any)}
	<Tooltip.Root>
		<Tooltip.Trigger asChild let:builder>
			<a
				{href}
				class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
				class:text-primary={$page.url.pathname === href}
				use:builder.action
				{...builder}
			>
				<svelte:component this={icon} class="size-5"></svelte:component>
				<span class="sr-only">{name}</span>
			</a>
		</Tooltip.Trigger>
		<Tooltip.Content side="right">{name}</Tooltip.Content>
	</Tooltip.Root>
{/snippet}

<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-card sm:flex">
	<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
		<a
			href="/dashboard/home"
			class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
		>
			<BoltIcon class="size-5" />
			<span class="sr-only">Acme Inc</span>
		</a>
		{@render navItem('Home', '/dashboard/home', HomeIcon)}
		{@render navItem('Users', '/dashboard/users', UsersIcon)}
		{@render navItem('Settings', '/dashboard/settings', SettingsIcon)}
	</nav>
</aside>
