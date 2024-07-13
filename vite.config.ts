import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	optimizeDeps: {
		exclude: ['@node-rs/argon2/']
	},
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	]
});
