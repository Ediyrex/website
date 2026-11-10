ALTER TABLE "services" ADD COLUMN "category_label" varchar(80);--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "features" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "show_pricing" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "starting_price" varchar(80);