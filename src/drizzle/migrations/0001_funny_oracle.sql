ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "profile_image";