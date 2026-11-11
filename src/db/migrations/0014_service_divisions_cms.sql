ALTER TABLE "service_divisions" ADD COLUMN "display_number" varchar(12) DEFAULT '01' NOT NULL;--> statement-breakpoint
ALTER TABLE "service_divisions" ADD COLUMN "heading" varchar(120) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "service_divisions" ADD COLUMN "italic_heading" varchar(80) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "service_divisions" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "service_divisions" ADD COLUMN "cta_label" varchar(80) DEFAULT 'Explore' NOT NULL;--> statement-breakpoint
ALTER TABLE "service_divisions" ADD COLUMN "destination_url" varchar(160) DEFAULT '/services' NOT NULL;--> statement-breakpoint
ALTER TABLE "service_divisions" ADD COLUMN "cover_image_url" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "service_divisions" ADD COLUMN "cover_alt" varchar(240) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "service_divisions" ADD COLUMN "is_featured" boolean DEFAULT true NOT NULL;