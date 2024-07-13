CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"ip" text NOT NULL,
	"country" text NOT NULL,
	"user_agent" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"country" text,
	"role" text DEFAULT 'user' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_codes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"valid_until" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verification_codes" ADD CONSTRAINT "verification_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
