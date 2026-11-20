-- 0015_services_and_industries_management.sql
-- Adds process_stages to services and creates industries, sector_architectures and relationship join tables

ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "process_stages" jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS "industries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" varchar(120) NOT NULL UNIQUE,
  "name" varchar(140) NOT NULL,
  "tagline" varchar(240) NOT NULL DEFAULT '',
  "short_description" varchar(500) NOT NULL DEFAULT '',
  "description" text NOT NULL DEFAULT '',
  "hero_headline" varchar(240),
  "hero_description" text,
  "hero_supporting_label" varchar(140),
  "cta_label" varchar(80) NOT NULL DEFAULT 'Discuss Your Sector',
  "cta_destination" varchar(160) NOT NULL DEFAULT '/contact',
  "sub_industries" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "deliverables" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "challenges" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "opportunities" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "solutions" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "faqs" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "cover_image_url" text NOT NULL DEFAULT '',
  "cover_asset_id" uuid REFERENCES "media_assets"("id") ON DELETE SET NULL,
  "display_order" integer NOT NULL DEFAULT 0,
  "status" "publication_status" NOT NULL DEFAULT 'draft',
  "is_featured" boolean NOT NULL DEFAULT false,
  "is_hero_featured" boolean NOT NULL DEFAULT false,
  "seo_title" varchar(160),
  "seo_description" varchar(320),
  "og_title" varchar(160),
  "og_description" varchar(320),
  "og_image_asset_id" uuid REFERENCES "media_assets"("id") ON DELETE SET NULL,
  "canonical_url" varchar(300),
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "chk_industries_display_order" CHECK ("display_order" >= 0)
);

CREATE INDEX IF NOT EXISTS "idx_industries_published" ON "industries" ("display_order") WHERE "status" = 'published';
CREATE INDEX IF NOT EXISTS "idx_industries_featured" ON "industries" ("display_order") WHERE "status" = 'published' AND "is_featured" = true;
CREATE INDEX IF NOT EXISTS "idx_industries_hero" ON "industries" ("display_order") WHERE "is_hero_featured" = true;

CREATE TABLE IF NOT EXISTS "sector_architectures" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" varchar(120) NOT NULL UNIQUE,
  "number" varchar(20),
  "category" varchar(160) NOT NULL,
  "title" varchar(180) NOT NULL,
  "description" text NOT NULL,
  "capabilities" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "display_order" integer NOT NULL DEFAULT 0,
  "status" "publication_status" NOT NULL DEFAULT 'draft',
  "is_featured" boolean NOT NULL DEFAULT true,
  "is_highlighted" boolean NOT NULL DEFAULT false,
  "detail_route" varchar(200) DEFAULT '/contact',
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "chk_sector_architectures_display_order" CHECK ("display_order" >= 0)
);

CREATE INDEX IF NOT EXISTS "idx_sector_architectures_order" ON "sector_architectures" ("display_order");

CREATE TABLE IF NOT EXISTS "industry_services" (
  "industry_id" uuid NOT NULL REFERENCES "industries"("id") ON DELETE CASCADE,
  "service_id" uuid NOT NULL REFERENCES "services"("id") ON DELETE CASCADE,
  PRIMARY KEY ("industry_id", "service_id")
);

CREATE INDEX IF NOT EXISTS "idx_industry_services_service" ON "industry_services" ("service_id");

CREATE TABLE IF NOT EXISTS "industry_sector_architectures" (
  "industry_id" uuid NOT NULL REFERENCES "industries"("id") ON DELETE CASCADE,
  "sector_architecture_id" uuid NOT NULL REFERENCES "sector_architectures"("id") ON DELETE CASCADE,
  PRIMARY KEY ("industry_id", "sector_architecture_id")
);

CREATE INDEX IF NOT EXISTS "idx_ind_sec_arch_sec" ON "industry_sector_architectures" ("sector_architecture_id");

CREATE TABLE IF NOT EXISTS "industry_projects" (
  "industry_id" uuid NOT NULL REFERENCES "industries"("id") ON DELETE CASCADE,
  "project_id" uuid NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  PRIMARY KEY ("industry_id", "project_id")
);

CREATE INDEX IF NOT EXISTS "idx_industry_projects_proj" ON "industry_projects" ("project_id");
