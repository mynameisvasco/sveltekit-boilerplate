<script lang="ts">
	import type { HTMLLiAttributes } from 'svelte/elements';
	import ChevronRightIcon from '~icons/solar/alt-arrow-right-outline';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLLiAttributes & {
		el?: HTMLLIElement;
	};

	export let el: $$Props['el'] = undefined;
	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<li
	role="presentation"
	aria-hidden="true"
	class={cn('[&>svg]:size-3.5', className)}
	bind:this={el}
	{...$$restProps}
>
	<slot>
		<ChevronRightIcon />
	</slot>
</li>
