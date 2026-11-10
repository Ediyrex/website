CREATE TABLE "pms_custom_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(80) NOT NULL,
	"name" varchar(140) NOT NULL,
	"service_interest" varchar(140) DEFAULT 'Studio Delivery' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"labels_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"milestones_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tasks_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pms_custom_templates_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "pms_saved_filters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"scope" varchar(24) DEFAULT 'tasks' NOT NULL,
	"name" varchar(80) NOT NULL,
	"filter_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_pms_saved_filter_scope" CHECK ("pms_saved_filters"."scope" IN ('projects', 'tasks', 'my_tasks'))
);
--> statement-breakpoint
ALTER TABLE "pms_project_files" ADD COLUMN "version_group_id" uuid;--> statement-breakpoint
ALTER TABLE "pms_project_files" ADD COLUMN "version_note" varchar(240);--> statement-breakpoint
ALTER TABLE "pms_projects" ADD COLUMN "workflow_config" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "recurrence_rule" varchar(24) DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "recurrence_parent_id" uuid;--> statement-breakpoint
ALTER TABLE "pms_custom_templates" ADD CONSTRAINT "pms_custom_templates_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_saved_filters" ADD CONSTRAINT "pms_saved_filters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_pms_saved_filters_user" ON "pms_saved_filters" USING btree ("user_id","scope");--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD CONSTRAINT "chk_studio_task_recurrence" CHECK ("studio_tasks"."recurrence_rule" IN ('none', 'daily', 'weekly', 'biweekly', 'monthly'));