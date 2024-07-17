<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { formHandler } from '$lib/utils';

	let { form } = $props();
</script>

<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Login into your account</h1>
		<p class="text-sm text-muted-foreground">Enter your credentials below to access your account</p>
	</div>
	<div class="grid gap-6">
		<form action="/auth/login" method="post" use:enhance={formHandler}>
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
					<Label class="sr-only" for="password">Password</Label>
					<Input
						id="password"
						name="password"
						placeholder="Your hyper-secure password"
						type="password"
						autocapitalize="none"
						autocomplete="password"
						autocorrect="off"
						error={form?.errors?.password?.at(0)}
					/>
				</div>

				<Button type="submit">Sign In</Button>
			</div>
		</form>
		<div class="relative">
			<div class="absolute inset-0 flex items-center" aria-hidden="true">
				<div class="w-full border-t"></div>
			</div>
			<div class="relative flex justify-center text-sm font-medium leading-6">
				<span class="bg-background px-6 text-muted">Or continue with</span>
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<Button variant="outline" href="/auth/oauth?provider=google">Sign via Google</Button>
			<Button variant="outline" href="/auth/oauth?provider=apple">Sign via Apple</Button>
		</div>
	</div>
	<span class="py-2 text-center text-sm">
		Don't have an account <a href="/auth/register" class="text-primary">Sign Up</a>
	</span>
</div>
