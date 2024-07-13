<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { formHandler } from '$lib/utils';

	let { form } = $props();
</script>

<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Verify your account</h1>
		<p class="text-sm text-muted-foreground">
			Check your email and input the verification code bellow
		</p>
	</div>
	<div class="grid gap-6">
		<form action="/auth/verify-email?/verify" method="post" use:enhance={formHandler}>
			<div class="grid gap-2">
				<div class="grid gap-1">
					<Label class="sr-only" for="code">Code</Label>
					<Input
						id="code"
						name="code"
						placeholder="1234"
						type="text"
						autocapitalize="none"
						autocomplete="code"
						autocorrect="off"
						error={form?.errors?.code?.at(0)}
					/>
				</div>
				<Button type="submit">Verify</Button>
				<span class="flex items-center justify-center gap-1 py-2 text-center text-sm">
					Didn't receive any email?
					<button formaction="/auth/verify-email?/resend" class="text-primary">Resend</button>
				</span>
			</div>
		</form>
	</div>
</div>
