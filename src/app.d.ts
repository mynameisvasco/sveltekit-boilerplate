// See https://kit.svelte.dev/docs/types#app
import type { Session, User } from 'lucia';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
			team: { id: number; name: string } | null;
			body?: any | null | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
