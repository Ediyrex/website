ALTER TABLE "blog_posts" ADD COLUMN "author_bio" varchar(240);--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "subtitle" varchar(280);--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "content_type" varchar(32) DEFAULT 'post' NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "scheduled_for" timestamp with time zone;