CREATE TABLE "seo_redirects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" varchar(300) NOT NULL,
	"destination" varchar(500) NOT NULL,
	"status_code" integer DEFAULT 301 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"note" varchar(240),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seo_redirects_source_unique" UNIQUE("source"),
	CONSTRAINT "chk_seo_redirect_status" CHECK ("seo_redirects"."status_code" IN (301, 302))
);
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "canonical_url" varchar(300);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "robots_directive" varchar(60) DEFAULT 'index, follow' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "schema_type" varchar(60) DEFAULT 'CreativeWork' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "schema_json" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "canonical_url" varchar(300);--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "robots_directive" varchar(60) DEFAULT 'index, follow' NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "schema_type" varchar(60) DEFAULT 'Service' NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "schema_json" text;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "og_title" varchar(160);--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "og_description" varchar(320);--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "og_image_asset_id" uuid;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "robots_directive" varchar(60) DEFAULT 'index, follow' NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "schema_type" varchar(60) DEFAULT 'Article' NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "schema_json" text;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "no_index" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "cms_pages" ADD COLUMN "og_title" varchar(160);--> statement-breakpoint
ALTER TABLE "cms_pages" ADD COLUMN "og_description" varchar(320);--> statement-breakpoint
ALTER TABLE "cms_pages" ADD COLUMN "og_image_asset_id" uuid;--> statement-breakpoint
ALTER TABLE "cms_pages" ADD COLUMN "robots_directive" varchar(60) DEFAULT 'index, follow' NOT NULL;--> statement-breakpoint
ALTER TABLE "cms_pages" ADD COLUMN "schema_type" varchar(60) DEFAULT 'WebPage' NOT NULL;--> statement-breakpoint
ALTER TABLE "cms_pages" ADD COLUMN "schema_json" text;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_og_image_asset_id_media_assets_id_fk" FOREIGN KEY ("og_image_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms_pages" ADD CONSTRAINT "cms_pages_og_image_asset_id_media_assets_id_fk" FOREIGN KEY ("og_image_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;