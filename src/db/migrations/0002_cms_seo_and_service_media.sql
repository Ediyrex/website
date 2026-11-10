ALTER TABLE "projects" ADD COLUMN "project_date" varchar(40);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "tech_stack" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "og_title" varchar(160);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "og_description" varchar(320);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "og_image_asset_id" uuid;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "no_index" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "cover_asset_id" uuid;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "og_title" varchar(160);--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "og_description" varchar(320);--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "og_image_asset_id" uuid;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "no_index" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_og_image_asset_id_media_assets_id_fk" FOREIGN KEY ("og_image_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_cover_asset_id_media_assets_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_og_image_asset_id_media_assets_id_fk" FOREIGN KEY ("og_image_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;