CREATE TABLE IF NOT EXISTS "oauth_connections" (
	"user_id" integer NOT NULL,
	"username" text NOT NULL,
	"provider_user_id" text NOT NULL,
	"provider" text NOT NULL,
	CONSTRAINT "oauth_connections_provider_user_id_user_id_pk" PRIMARY KEY("provider_user_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_user_id_pk" PRIMARY KEY("team_id","user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_connections" ADD CONSTRAINT "oauth_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
