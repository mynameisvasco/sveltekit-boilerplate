<script lang="ts">
	import type { HTMLTableAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLTableAttributes & { bordered?: boolean };

	let className: $$Props['class'] = undefined;
	let bordered: $$Props['bordered'] = $$props.bordered ?? true;
	export { className as class };
</script>

<div class="relative w-full overflow-hidden rounded-lg bg-card" class:border={bordered}>
	<table class={cn('w-full caption-bottom text-sm', className)} {...$$restProps}>
		<slot />
	</table>
</div>
