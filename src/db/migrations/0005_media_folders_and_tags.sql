ALTER TABLE "media_assets" ADD COLUMN "folder" varchar(100) DEFAULT 'Website' NOT NULL;--> statement-breakpoint
ALTER TABLE "media_assets" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb NOT NULL;