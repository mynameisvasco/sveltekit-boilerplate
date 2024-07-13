<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" size="icon" class="overflow-hidden rounded-full">
			<Avatar.Root>
				<Avatar.Image src="https://github.com/as" alt="@shadcn" />
				<Avatar.Fallback>VS</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Label>My Account</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>Settings</DropdownMenu.Item>
		<DropdownMenu.Item>Support</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>Logout</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
