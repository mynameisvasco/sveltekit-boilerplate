<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import * as Select from '$lib/components/ui/select/index.js';
	import { formHandler } from '$lib/utils';
</script>

<div class="ml-auto flex-1 lg:max-w-72">
	<Select.Root selected={{ value: $page.data.team.id, label: $page.data.team.name }}>
		<Select.Trigger class="w-full">
			<Select.Value placeholder="Theme" />
		</Select.Trigger>
		<Select.Content>
			{#await $page.data.teams}
				<Select.Item value="loading" disabled>Loading...</Select.Item>
			{:then { data: teams }}
				{#each teams as team}
					<form
						id="change-team-form-{team.id}"
						action="/teams/{team.id}?/change"
						method="post"
						class="hidden"
						use:enhance={formHandler}
					></form>
					<Select.Item
						value={team.id}
						class="gap-2"
						onclick={() =>
							document
								.getElementById(`change-team-form-${team.id}`)
								?.dispatchEvent(new SubmitEvent('submit'))}
					>
						<img
							src="https://api.dicebear.com/9.x/shapes/svg?seed={team.name}"
							alt={team.name}
							class="size-6 rounded-md"
						/>
						{team.name}
					</Select.Item>
				{/each}
			{:catch e}
				<Select.Item value="error" disabled>{e.message}</Select.Item>
			{/await}
		</Select.Content>
	</Select.Root>
</div>
