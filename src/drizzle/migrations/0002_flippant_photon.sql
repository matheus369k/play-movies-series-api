CREATE TABLE "watch_later_medias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"movie_id" text NOT NULL,
	"user_id" uuid,
	"image" text NOT NULL,
	"title" text NOT NULL,
	"release" integer NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "watch_later" CASCADE;--> statement-breakpoint
ALTER TABLE "watch_later_medias" ADD CONSTRAINT "watch_later_medias_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;