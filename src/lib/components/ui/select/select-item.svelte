<script lang="ts">
	import CheckIcon from '~icons/solar/check-circle-outline';
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type $$Props = SelectPrimitive.ItemProps;
	type $$Events = SelectPrimitive.ItemEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'];
	export let label: $$Props['label'] = undefined;
	export let disabled: $$Props['disabled'] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Item
	{value}
	{disabled}
	{label}
	class={cn(
		'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5  text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',

		className
	)}
	{...$$restProps}
	on:click
	on:keydown
	on:focusin
	on:focusout
	on:pointerleave
	on:pointermove
>
	<slot>
		{label || value}
	</slot>
	<span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
		<SelectPrimitive.ItemIndicator>
			<CheckIcon class="size-4" />
		</SelectPrimitive.ItemIndicator>
	</span>
</SelectPrimitive.Item>
