<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let { form } = $props();
</script>

<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Create your account</h1>
		<p class="text-sm text-muted-foreground">Enter your details below to create your account</p>
	</div>
	<div class="grid gap-6">
		<form
			action="/auth/register"
			method="post"
			use:enhance={() =>
				async ({ update }) =>
					update({ reset: false })}
		>
			<div class="grid gap-2">
				<div class="grid gap-1">
					<Label class="sr-only" for="email">Email</Label>
					<Input
						id="email"
						name="email"
						placeholder="name@example.com"
						type="email"
						autocapitalize="none"
						autocomplete="email"
						autocorrect="off"
						error={form?.errors?.email?.at(0)}
					/>
				</div>
				<div class="grid gap-1">
					<Label class="sr-only" for="fullName">Full Name</Label>
					<Input
						id="fullName"
						name="fullName"
						placeholder="John Smith"
						type="text"
						autocapitalize="none"
						autocomplete="name"
						autocorrect="off"
						error={form?.errors?.fullName?.at(0)}
					/>
				</div>
				<div class="grid gap-1">
					<Label class="sr-only" for="password">Password</Label>
					<Input
						id="password"
						name="password"
						placeholder="************"
						type="password"
						autocapitalize="none"
						autocomplete="password"
						autocorrect="off"
						error={form?.errors?.password?.at(0)}
					/>
				</div>
				<Button type="submit">Sign Up</Button>
				<span class="py-2 text-center text-sm">
					Already have an account? <a href="/auth/login" class="text-primary">Sign In</a>
				</span>
			</div>
		</form>
	</div>
</div>
