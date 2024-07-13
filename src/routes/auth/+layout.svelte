<script lang="ts">
	let { children } = $props();
	import Button from '$lib/components/ui/button/button.svelte';

	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let isLoading = false;

	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}
</script>

<div
	class="container relative grid h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
		<div
			class="absolute inset-0 bg-cover"
			style="
				background-image:
					url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80);"
		></div>
		<div class="relative z-20 flex items-center text-lg font-medium">Acme Inc</div>
	</div>
	{@render children()}
</div>
