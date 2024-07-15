<script lang="ts">
	import { Pagination as PaginationPrimitive } from 'bits-ui';
	import ChevronRightIcon from '~icons/solar/alt-arrow-right-outline';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	type $$Props = PaginationPrimitive.NextButtonProps;
	type $$Events = PaginationPrimitive.NextButtonEvents;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<PaginationPrimitive.NextButton asChild let:builder>
	<Button
		variant="ghost"
		class={cn('gap-1 pr-2.5', className)}
		builders={[builder]}
		on:click
		{...$$restProps}
	>
		<slot>
			<span>Next</span>
			<ChevronRightIcon class="size-4" />
		</slot>
	</Button>
</PaginationPrimitive.NextButton>
