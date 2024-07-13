import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/database/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.SECRET_DATABASE_URL!
	}
});
