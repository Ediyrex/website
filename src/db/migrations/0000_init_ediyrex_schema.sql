CREATE TYPE "public"."account_status" AS ENUM('invited', 'active', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."enquiry_status" AS ENUM('new', 'reviewing', 'qualified', 'proposal_sent', 'won', 'lost', 'archived');--> statement-breakpoint
CREATE TYPE "public"."media_resource_type" AS ENUM('image', 'video', 'document');--> statement-breakpoint
CREATE TYPE "public"."navigation_location" AS ENUM('header', 'footer_primary', 'footer_legal');--> statement-breakpoint
CREATE TYPE "public"."outbox_status" AS ENUM('pending', 'processing', 'sent', 'failed', 'dead_letter');--> statement-breakpoint
CREATE TYPE "public"."project_media_role" AS ENUM('cover', 'gallery', 'video_preview', 'diagram');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('client', 'concept', 'internal');--> statement-breakpoint
CREATE TYPE "public"."publication_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"actor_email_snapshot" varchar(255),
	"action" varchar(80) NOT NULL,
	"entity_type" varchar(64) NOT NULL,
	"entity_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" varchar(255) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" varchar(128) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email_normalized" varchar(255) NOT NULL,
	"display_name" varchar(120) NOT NULL,
	"password_hash" text,
	"status" "account_status" DEFAULT 'invited' NOT NULL,
	"email_verified_at" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_normalized_unique" UNIQUE("email_normalized")
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"storage_provider" varchar(32) DEFAULT 'cloudinary' NOT NULL,
	"provider_asset_id" varchar(255) NOT NULL,
	"provider_public_id" varchar(255),
	"asset_url" text NOT NULL,
	"secure_url" text NOT NULL,
	"resource_type" "media_resource_type" NOT NULL,
	"mime_type" varchar(128) NOT NULL,
	"file_size_bytes" bigint NOT NULL,
	"width" integer,
	"height" integer,
	"alt_text" varchar(300) DEFAULT '' NOT NULL,
	"caption" text,
	"provider_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"uploaded_by_user_id" uuid,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_media_provider_asset" UNIQUE("storage_provider","provider_asset_id"),
	CONSTRAINT "chk_media_file_size_positive" CHECK ("media_assets"."file_size_bytes" > 0),
	CONSTRAINT "chk_media_dimensions_valid" CHECK (("media_assets"."width" IS NULL OR "media_assets"."width" > 0) AND ("media_assets"."height" IS NULL OR "media_assets"."height" > 0))
);
--> statement-breakpoint
CREATE TABLE "case_studies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"challenge" text NOT NULL,
	"approach" text NOT NULL,
	"solution" text NOT NULL,
	"verified_outcomes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"process_steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "publication_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "case_studies_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "project_media" (
	"project_id" uuid NOT NULL,
	"media_asset_id" uuid NOT NULL,
	"media_role" "project_media_role" DEFAULT 'gallery' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "project_media_project_id_media_asset_id_pk" PRIMARY KEY("project_id","media_asset_id"),
	CONSTRAINT "chk_project_media_order" CHECK ("project_media"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "project_services" (
	"project_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	CONSTRAINT "project_services_project_id_service_id_pk" PRIMARY KEY("project_id","service_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(180) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"summary" varchar(400) NOT NULL,
	"description" text NOT NULL,
	"project_type" "project_type" DEFAULT 'concept' NOT NULL,
	"industry" varchar(100),
	"client_name" varchar(140),
	"client_is_public" boolean DEFAULT false NOT NULL,
	"cover_asset_id" uuid,
	"live_url" text,
	"repository_url" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"status" "publication_status" DEFAULT 'draft' NOT NULL,
	"seo_title" varchar(160),
	"seo_description" varchar(320),
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug"),
	CONSTRAINT "chk_projects_display_order" CHECK ("projects"."display_order" >= 0),
	CONSTRAINT "chk_project_client_honesty" CHECK (("projects"."project_type" = 'client') OR ("projects"."client_name" IS NULL AND "projects"."client_is_public" = false))
);
--> statement-breakpoint
CREATE TABLE "service_divisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(80) NOT NULL,
	"slug" varchar(80) NOT NULL,
	"description" text NOT NULL,
	"icon_name" varchar(64),
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "service_divisions_slug_unique" UNIQUE("slug"),
	CONSTRAINT "chk_divisions_display_order" CHECK ("service_divisions"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"division_id" uuid NOT NULL,
	"title" varchar(140) NOT NULL,
	"slug" varchar(140) NOT NULL,
	"summary" varchar(320) NOT NULL,
	"description" text NOT NULL,
	"deliverables" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"icon_name" varchar(64),
	"is_featured" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"status" "publication_status" DEFAULT 'draft' NOT NULL,
	"seo_title" varchar(160),
	"seo_description" varchar(320),
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug"),
	CONSTRAINT "chk_services_display_order" CHECK ("services"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference_code" varchar(24) NOT NULL,
	"contact_name" varchar(120) NOT NULL,
	"email_normalized" varchar(255) NOT NULL,
	"company_name" varchar(140),
	"phone" varchar(40),
	"service_division_id" uuid,
	"service_id" uuid,
	"project_type" varchar(140) NOT NULL,
	"goals_and_requirements" text NOT NULL,
	"budget_min" integer,
	"budget_max" integer,
	"budget_currency" char(3),
	"expected_timeline" varchar(64) NOT NULL,
	"status" "enquiry_status" DEFAULT 'new' NOT NULL,
	"source" varchar(64) DEFAULT 'website_contact_form' NOT NULL,
	"wants_discovery_call" boolean DEFAULT false NOT NULL,
	"consent_at" timestamp with time zone NOT NULL,
	"privacy_notice_version" varchar(32) DEFAULT 'v1.0' NOT NULL,
	"assigned_admin_user_id" uuid,
	"dedupe_hash" varchar(64),
	"ip_hash" varchar(64),
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone,
	CONSTRAINT "enquiries_reference_code_unique" UNIQUE("reference_code"),
	CONSTRAINT "chk_enquiries_budget_non_negative" CHECK (("enquiries"."budget_min" IS NULL OR "enquiries"."budget_min" >= 0) AND ("enquiries"."budget_max" IS NULL OR "enquiries"."budget_max" >= 0)),
	CONSTRAINT "chk_budget_range_valid" CHECK ("enquiries"."budget_min" IS NULL OR "enquiries"."budget_max" IS NULL OR "enquiries"."budget_min" <= "enquiries"."budget_max"),
	CONSTRAINT "chk_budget_currency_required" CHECK (("enquiries"."budget_min" IS NULL AND "enquiries"."budget_max" IS NULL) OR ("enquiries"."budget_currency" ~ '^[A-Z]{3}$'))
);
--> statement-breakpoint
CREATE TABLE "enquiry_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"author_user_id" uuid,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiry_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"changed_by_id" uuid,
	"previous_status" "enquiry_status",
	"new_status" "enquiry_status" NOT NULL,
	"reason" varchar(320),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" varchar(80) NOT NULL,
	"entity_type" varchar(64) NOT NULL,
	"entity_id" uuid NOT NULL,
	"dedupe_key" varchar(160),
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "outbox_status" DEFAULT 'pending' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 5 NOT NULL,
	"next_retry_at" timestamp with time zone DEFAULT now() NOT NULL,
	"locked_at" timestamp with time zone,
	"last_error" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"delivered_at" timestamp with time zone,
	CONSTRAINT "notification_outbox_dedupe_key_unique" UNIQUE("dedupe_key"),
	CONSTRAINT "chk_outbox_attempt_count" CHECK ("notification_outbox"."attempt_count" >= 0),
	CONSTRAINT "chk_outbox_max_attempts" CHECK ("notification_outbox"."max_attempts" > 0)
);
--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(80) NOT NULL,
	"slug" varchar(80) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_post_categories" (
	"blog_post_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "blog_post_categories_blog_post_id_category_id_pk" PRIMARY KEY("blog_post_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_user_id" uuid,
	"title" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"excerpt" varchar(400) NOT NULL,
	"body_markdown" text NOT NULL,
	"cover_asset_id" uuid,
	"status" "publication_status" DEFAULT 'draft' NOT NULL,
	"seo_title" varchar(160),
	"seo_description" varchar(320),
	"canonical_url" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "booking_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" varchar(40) NOT NULL,
	"provider_booking_id" varchar(160) NOT NULL,
	"enquiry_id" uuid,
	"booking_status" varchar(40) NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"provider_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_booking_provider_id" UNIQUE("provider","provider_booking_id"),
	CONSTRAINT "chk_booking_time_valid" CHECK ("booking_records"."ends_at" > "booking_records"."starts_at")
);
--> statement-breakpoint
CREATE TABLE "navigation_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(64) NOT NULL,
	"destination" varchar(500) NOT NULL,
	"is_external" boolean DEFAULT false NOT NULL,
	"location" "navigation_location" NOT NULL,
	"parent_id" uuid,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_nav_display_order" CHECK ("navigation_items"."display_order" >= 0),
	CONSTRAINT "chk_nav_no_self_parent" CHECK ("navigation_items"."parent_id" IS NULL OR "navigation_items"."parent_id" <> "navigation_items"."id")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"setting_key" varchar(100) NOT NULL,
	"setting_value" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"description" varchar(255),
	"is_public" boolean DEFAULT false NOT NULL,
	"updated_by_user_id" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_setting_key_unique" UNIQUE("setting_key")
);
--> statement-breakpoint
CREATE TABLE "studio_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"division_id" uuid,
	"name" varchar(140) NOT NULL,
	"slug" varchar(140) NOT NULL,
	"tagline" varchar(240) NOT NULL,
	"description" text NOT NULL,
	"product_stage" varchar(32) NOT NULL,
	"tech_stack" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"demo_url" text,
	"status" "publication_status" DEFAULT 'draft' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "studio_products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "chk_product_stage" CHECK ("studio_products"."product_stage" IN ('research', 'alpha', 'beta', 'live')),
	CONSTRAINT "chk_studio_products_order" CHECK ("studio_products"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_display_name" varchar(120) NOT NULL,
	"author_role" varchar(120),
	"company_name" varchar(140),
	"content" text NOT NULL,
	"media_asset_id" uuid,
	"source_url" text,
	"consent_verified_at" timestamp with time zone NOT NULL,
	"status" "publication_status" DEFAULT 'draft' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_testimonials_display_order" CHECK ("testimonials"."display_order" >= 0)
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media" ADD CONSTRAINT "project_media_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media" ADD CONSTRAINT "project_media_media_asset_id_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_services" ADD CONSTRAINT "project_services_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_services" ADD CONSTRAINT "project_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_asset_id_media_assets_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_division_id_service_divisions_id_fk" FOREIGN KEY ("division_id") REFERENCES "public"."service_divisions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_service_division_id_service_divisions_id_fk" FOREIGN KEY ("service_division_id") REFERENCES "public"."service_divisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_admin_user_id_users_id_fk" FOREIGN KEY ("assigned_admin_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiry_notes" ADD CONSTRAINT "enquiry_notes_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiry_notes" ADD CONSTRAINT "enquiry_notes_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiry_status_history" ADD CONSTRAINT "enquiry_status_history_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiry_status_history" ADD CONSTRAINT "enquiry_status_history_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_categories" ADD CONSTRAINT "blog_post_categories_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_categories" ADD CONSTRAINT "blog_post_categories_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_cover_asset_id_media_assets_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_records" ADD CONSTRAINT "booking_records_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_navigation_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_updated_by_user_id_users_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_products" ADD CONSTRAINT "studio_products_division_id_service_divisions_id_fk" FOREIGN KEY ("division_id") REFERENCES "public"."service_divisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_media_asset_id_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_audit_logs_entity" ON "audit_logs" USING btree ("entity_type","entity_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_actor" ON "audit_logs" USING btree ("actor_user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_sessions_user_active" ON "sessions" USING btree ("user_id","expires_at") WHERE "sessions"."revoked_at" IS NULL;--> statement-breakpoint
CREATE INDEX "idx_media_assets_resource_type" ON "media_assets" USING btree ("resource_type") WHERE "media_assets"."archived_at" IS NULL;--> statement-breakpoint
CREATE INDEX "idx_project_media_order" ON "project_media" USING btree ("project_id","display_order");--> statement-breakpoint
CREATE INDEX "idx_project_services_service_id" ON "project_services" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "idx_projects_published_order" ON "projects" USING btree ("display_order","published_at") WHERE "projects"."status" = 'published';--> statement-breakpoint
CREATE INDEX "idx_projects_type_published" ON "projects" USING btree ("project_type") WHERE "projects"."status" = 'published';--> statement-breakpoint
CREATE INDEX "idx_services_division_published" ON "services" USING btree ("division_id","display_order") WHERE "services"."status" = 'published';--> statement-breakpoint
CREATE INDEX "idx_services_featured" ON "services" USING btree ("display_order") WHERE "services"."status" = 'published' AND "services"."is_featured" = true;--> statement-breakpoint
CREATE INDEX "idx_enquiries_status_submitted" ON "enquiries" USING btree ("status","submitted_at");--> statement-breakpoint
CREATE INDEX "idx_enquiries_assigned_admin" ON "enquiries" USING btree ("assigned_admin_user_id") WHERE "enquiries"."assigned_admin_user_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_enquiries_email" ON "enquiries" USING btree ("email_normalized");--> statement-breakpoint
CREATE INDEX "idx_enquiries_dedupe_hash" ON "enquiries" USING btree ("dedupe_hash","submitted_at") WHERE "enquiries"."dedupe_hash" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_enquiry_notes_enquiry" ON "enquiry_notes" USING btree ("enquiry_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_enquiry_status_history_enquiry" ON "enquiry_status_history" USING btree ("enquiry_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_outbox_pending_poll" ON "notification_outbox" USING btree ("next_retry_at") WHERE "notification_outbox"."status" IN ('pending', 'failed');--> statement-breakpoint
CREATE INDEX "idx_blog_posts_published" ON "blog_posts" USING btree ("published_at") WHERE "blog_posts"."status" = 'published';--> statement-breakpoint
CREATE INDEX "idx_booking_records_enquiry" ON "booking_records" USING btree ("enquiry_id") WHERE "booking_records"."enquiry_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_navigation_location_active" ON "navigation_items" USING btree ("location","display_order") WHERE "navigation_items"."is_active" = true;--> statement-breakpoint
CREATE INDEX "idx_testimonials_published" ON "testimonials" USING btree ("display_order") WHERE "testimonials"."status" = 'published';