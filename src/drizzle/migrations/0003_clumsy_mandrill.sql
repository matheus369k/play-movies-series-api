CREATE TABLE "assessment_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"movie_id" text NOT NULL,
	"user_id" uuid,
	"liked" boolean
);
--> statement-breakpoint
ALTER TABLE "assessment_media" ADD CONSTRAINT "assessment_media_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;