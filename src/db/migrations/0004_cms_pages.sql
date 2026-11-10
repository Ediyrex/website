CREATE TABLE "cms_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(160) NOT NULL,
	"subtitle" varchar(280) DEFAULT '' NOT NULL,
	"slug" varchar(180) NOT NULL,
	"page_type" varchar(32) DEFAULT 'static' NOT NULL,
	"thumbnail_asset_id" uuid,
	"body_markdown" text DEFAULT '' NOT NULL,
	"status" "publication_status" DEFAULT 'published' NOT NULL,
	"seo_title" varchar(160),
	"seo_description" varchar(320),
	"canonical_url" varchar(300),
	"no_index" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"updated_by_user_id" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cms_pages_slug_unique" UNIQUE("slug"),
	CONSTRAINT "chk_cms_pages_type" CHECK ("cms_pages"."page_type" IN ('home', 'static', 'listing', 'legal')),
	CONSTRAINT "chk_cms_pages_order" CHECK ("cms_pages"."display_order" >= 0)
);
--> statement-breakpoint
ALTER TABLE "cms_pages" ADD CONSTRAINT "cms_pages_thumbnail_asset_id_media_assets_id_fk" FOREIGN KEY ("thumbnail_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms_pages" ADD CONSTRAINT "cms_pages_updated_by_user_id_users_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_cms_pages_status_order" ON "cms_pages" USING btree ("status","display_order");