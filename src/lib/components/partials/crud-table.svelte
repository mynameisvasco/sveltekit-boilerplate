<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let {
		headers = [],
		body,
		row,
		placeholder = 'No data found.',
		bordered = true,
		pagination = true,
		itemsPerPage = 20,
		selected = $bindable<any[]>([])
	} = $props<{
		headers?: string[];
		body: Promise<any>;
		row: any;
		placeholder?: string;
		bordered?: boolean;
		pagination?: boolean;
		itemsPerPage?: number;
		selected?: any[];
	}>();

	const handleSelected = (item: any) => {
		const index = selected.findIndex((i: any) => i.id === item.id);

		if (index === -1) {
			selected.push(item);
		} else {
			selected = selected.filter((_: any, i: any) => i !== index);
		}
	};

	const gotoToPage = (pageNumber: number) => {
		const url = new URL($page.url);
		url.searchParams.set('page', pageNumber.toString());
		goto(url.toString());
	};
</script>

<div class="flex flex-col gap-4">
	{#await body}
		<Table.Root {bordered}>
			{#if headers.length !== 0}
				<Table.Header>
					<Table.Row>
						{#each headers as header, index}
							{#if index === 0 || index === headers.length - 1}
								<Table.Head>{header}</Table.Head>
							{:else}
								<Table.Head class="hidden sm:table-cell">{header}</Table.Head>
							{/if}
						{/each}
					</Table.Row>
				</Table.Header>
			{/if}
			<Table.Body>
				<Table.Row>
					{#each headers as _}
						<Table.Cell>
							<Skeleton class="h-2 w-[100px]" />
						</Table.Cell>
					{/each}
				</Table.Row>
			</Table.Body>
		</Table.Root>
	{:then { data: items, count }}
		<Table.Root {bordered}>
			{#if headers.length !== 0}
				<Table.Header>
					<Table.Row>
						{#each headers as header, index}
							{#if index === 0 || index === headers.length - 1}
								<Table.Head>{header}</Table.Head>
							{:else}
								<Table.Head class="hidden sm:table-cell">{header}</Table.Head>
							{/if}
						{/each}
					</Table.Row>
				</Table.Header>
			{/if}
			<Table.Body>
				{#each items as item}
					{#if selected.find((i: any) => i.id === item.id)}
						<Table.Row class="bg-muted dark:bg-muted/40" onclick={() => handleSelected(item)}>
							{@render row(item)}
						</Table.Row>
					{:else}
						<Table.Row onclick={() => handleSelected(item)}>
							{@render row(item)}
						</Table.Row>
					{/if}
				{:else}
					<Table.Row>
						<Table.Cell>{placeholder}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>

		{#if pagination}
			<Pagination.Root
				{count}
				perPage={itemsPerPage}
				let:pages
				let:currentPage
				page={Number($page.url.searchParams.get('page') ?? '0')}
			>
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton onclick={() => gotoToPage((currentPage ?? 1) - 1)} />
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link
									{page}
									isActive={currentPage == page.value}
									onclick={() => gotoToPage(page.value)}
								>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.NextButton onclick={() => gotoToPage((currentPage ?? 1) + 1)} />
					</Pagination.Item>
				</Pagination.Content>
			</Pagination.Root>
		{/if}
	{:catch e}
		<Table.Row>
			<Table.Cell>
				<span class="text-red-600 dark:text-red-300">{e.message}</span>
			</Table.Cell>
		</Table.Row>
	{/await}
</div>
