<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { setMode, userPrefersMode } from 'mode-watcher';
</script>

<div class="flex flex-col gap-1">
	<h3>Settings</h3>
	<span class="text-sm text-muted-foreground"> Modify your account settings here. </span>
</div>

<Card.Root>
	<Card.Header>
		<Card.Title>Apperence</Card.Title>
		<Card.Description>Toggle between dark and light theme</Card.Description>
	</Card.Header>
	<Card.Content class="flex items-center gap-6">
		<div class="flex flex-col gap-2">
			<button
				class:!border-primary={$userPrefersMode === 'dark'}
				class="rounded-lg border-2"
				onclick={() => setMode('dark')}
			>
				<img src="/img/dark-mode.png" alt="dark-mode" class="w-full max-w-52 rounded-lg border" />
			</button>
			<span class="text-sm text-muted-foreground">Dark Mode</span>
		</div>
		<div class="flex flex-col gap-2">
			<button
				class:!border-primary={$userPrefersMode === 'light'}
				class="rounded-lg border-2"
				onclick={() => setMode('light')}
			>
				<img src="/img/light-mode.png" alt="light-mode" class="w-full max-w-52 rounded-lg border" />
			</button>
			<span class="text-sm text-muted-foreground">Light Mode</span>
		</div>
		<div class="flex flex-col gap-2">
			<button
				class:!border-primary={$userPrefersMode === 'system'}
				class="rounded-lg border-2"
				onclick={() => setMode('system')}
			>
				<img
					src="/img/system-mode.png"
					alt="light-mode"
					class="w-full max-w-52 rounded-lg border"
				/>
			</button>
			<span class="text-sm text-muted-foreground">System</span>
		</div>
	</Card.Content>
</Card.Root>
