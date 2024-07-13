<script lang="ts">
	import { UAParser } from 'ua-parser-js';

	let { userAgent } = $props<{ userAgent: string }>();

	let ua = $derived(new UAParser(userAgent));
	let browser = $derived(ua.getBrowser());
	let os = $derived(ua.getOS());
</script>

<div class="flex items-center gap-2">
	{#if browser.name === 'Safari'}
		<img src="/img/logos-safari.png" class="size-4" alt="Safari" />
	{:else if browser.name === 'Chrome'}
		<img src="/img/logos-chrome.png" class="size-4" alt="Chrome" />
	{:else if browser.name === 'Firefox'}
		<img src="/img/logos-firefox.png" class="size-4" alt="Firefox" />
	{:else if browser.name === 'Edge'}
		<img src="/img/logos-edge.png" class="size-4" alt="Edge" />
	{:else}
		<img src="/img/logos-unknown.png" class="size-4" alt="Unknown" />
	{/if}

	<span>
		{browser.name}
		({browser.version})
	</span>
</div>
