CREATE TABLE "pms_activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid,
	"task_id" uuid,
	"actor_user_id" uuid,
	"action" varchar(80) NOT NULL,
	"summary" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pms_discussions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"parent_id" uuid,
	"author_user_id" uuid,
	"body" text NOT NULL,
	"mentions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"attachment_asset_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pms_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" varchar(180) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"due_date" timestamp with time zone,
	"status" varchar(24) DEFAULT 'pending' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_pms_milestone_status" CHECK ("pms_milestones"."status" IN ('pending', 'in_progress', 'completed', 'delayed'))
);
--> statement-breakpoint
CREATE TABLE "pms_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_user_id" uuid NOT NULL,
	"actor_user_id" uuid,
	"project_id" uuid,
	"task_id" uuid,
	"category" varchar(24) DEFAULT 'task' NOT NULL,
	"title" varchar(200) NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_pms_notification_category" CHECK ("pms_notifications"."category" IN ('task', 'mention', 'review', 'file', 'project'))
);
--> statement-breakpoint
CREATE TABLE "pms_project_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"task_id" uuid,
	"media_asset_id" uuid NOT NULL,
	"title" varchar(240) NOT NULL,
	"category" varchar(32) DEFAULT 'deliverable' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"uploaded_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_pms_file_category" CHECK ("pms_project_files"."category" IN ('deliverable', 'reference', 'export', 'document')),
	CONSTRAINT "chk_pms_file_version" CHECK ("pms_project_files"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "pms_project_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"project_role" varchar(32) DEFAULT 'team_member' NOT NULL,
	"capacity_hours_per_week" integer DEFAULT 40 NOT NULL,
	"membership_status" varchar(24) DEFAULT 'active' NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_pms_project_member" UNIQUE("project_id","user_id"),
	CONSTRAINT "chk_pms_member_role" CHECK ("pms_project_members"."project_role" IN ('super_admin', 'studio_admin', 'project_manager', 'team_lead', 'team_member', 'viewer')),
	CONSTRAINT "chk_pms_member_status" CHECK ("pms_project_members"."membership_status" IN ('active', 'inactive'))
);
--> statement-breakpoint
CREATE TABLE "pms_starred_projects" (
	"user_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pms_starred_projects_user_id_project_id_pk" PRIMARY KEY("user_id","project_id")
);
--> statement-breakpoint
CREATE TABLE "pms_task_assignees" (
	"task_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pms_task_assignees_task_id_user_id_pk" PRIMARY KEY("task_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "pms_task_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"author_user_id" uuid,
	"body" text NOT NULL,
	"mentions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"attachment_asset_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_review_note" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pms_task_subtasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"title" varchar(240) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pms_task_work_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"user_id" uuid,
	"minutes" integer NOT NULL,
	"note" varchar(300) DEFAULT '' NOT NULL,
	"logged_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_pms_work_log_minutes" CHECK ("pms_task_work_logs"."minutes" > 0)
);
--> statement-breakpoint
ALTER TABLE "pms_projects" DROP CONSTRAINT "chk_pms_projects_status";--> statement-breakpoint
ALTER TABLE "pms_projects" ADD COLUMN "reference_code" varchar(24);--> statement-breakpoint
ALTER TABLE "pms_projects" ADD COLUMN "description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "pms_projects" ADD COLUMN "internal_notes" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "pms_projects" ADD COLUMN "cover_asset_id" uuid;--> statement-breakpoint
ALTER TABLE "pms_projects" ADD COLUMN "progress_percent" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "pms_projects" ADD COLUMN "start_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pms_projects" ADD COLUMN "due_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pms_projects" ADD COLUMN "template_key" varchar(64);--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "task_code" varchar(24);--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "workflow_status" varchar(32) DEFAULT 'todo' NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "priority" varchar(20) DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "labels" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "start_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "due_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "estimated_minutes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "logged_minutes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "position" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "review_status" varchar(24) DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "submitted_by_user_id" uuid;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "reviewed_by_user_id" uuid;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "review_feedback" text;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "dependency_task_ids" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "pms_activity_logs" ADD CONSTRAINT "pms_activity_logs_project_id_pms_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."pms_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_activity_logs" ADD CONSTRAINT "pms_activity_logs_task_id_studio_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."studio_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_activity_logs" ADD CONSTRAINT "pms_activity_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_discussions" ADD CONSTRAINT "pms_discussions_project_id_pms_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."pms_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_discussions" ADD CONSTRAINT "pms_discussions_parent_id_pms_discussions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pms_discussions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_discussions" ADD CONSTRAINT "pms_discussions_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_milestones" ADD CONSTRAINT "pms_milestones_project_id_pms_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."pms_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_notifications" ADD CONSTRAINT "pms_notifications_recipient_user_id_users_id_fk" FOREIGN KEY ("recipient_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_notifications" ADD CONSTRAINT "pms_notifications_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_notifications" ADD CONSTRAINT "pms_notifications_project_id_pms_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."pms_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_notifications" ADD CONSTRAINT "pms_notifications_task_id_studio_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."studio_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_project_files" ADD CONSTRAINT "pms_project_files_project_id_pms_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."pms_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_project_files" ADD CONSTRAINT "pms_project_files_task_id_studio_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."studio_tasks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_project_files" ADD CONSTRAINT "pms_project_files_media_asset_id_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_project_files" ADD CONSTRAINT "pms_project_files_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_project_members" ADD CONSTRAINT "pms_project_members_project_id_pms_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."pms_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_project_members" ADD CONSTRAINT "pms_project_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_starred_projects" ADD CONSTRAINT "pms_starred_projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_starred_projects" ADD CONSTRAINT "pms_starred_projects_project_id_pms_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."pms_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_assignees" ADD CONSTRAINT "pms_task_assignees_task_id_studio_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."studio_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_assignees" ADD CONSTRAINT "pms_task_assignees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_comments" ADD CONSTRAINT "pms_task_comments_task_id_studio_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."studio_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_comments" ADD CONSTRAINT "pms_task_comments_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_subtasks" ADD CONSTRAINT "pms_task_subtasks_task_id_studio_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."studio_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_work_logs" ADD CONSTRAINT "pms_task_work_logs_task_id_studio_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."studio_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_work_logs" ADD CONSTRAINT "pms_task_work_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_pms_activity_project" ON "pms_activity_logs" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_pms_activity_task" ON "pms_activity_logs" USING btree ("task_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_pms_discussions_project" ON "pms_discussions" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_pms_milestones_project" ON "pms_milestones" USING btree ("project_id","position");--> statement-breakpoint
CREATE INDEX "idx_pms_notifications_recipient" ON "pms_notifications" USING btree ("recipient_user_id","is_read","created_at");--> statement-breakpoint
CREATE INDEX "idx_pms_files_project" ON "pms_project_files" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_pms_members_user" ON "pms_project_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_pms_task_comments_task" ON "pms_task_comments" USING btree ("task_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_pms_subtasks_task" ON "pms_task_subtasks" USING btree ("task_id","position");--> statement-breakpoint
CREATE INDEX "idx_pms_work_logs_task" ON "pms_task_work_logs" USING btree ("task_id","logged_at");--> statement-breakpoint
ALTER TABLE "pms_projects" ADD CONSTRAINT "pms_projects_cover_asset_id_media_assets_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD CONSTRAINT "studio_tasks_submitted_by_user_id_users_id_fk" FOREIGN KEY ("submitted_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD CONSTRAINT "studio_tasks_reviewed_by_user_id_users_id_fk" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_studio_tasks_project_status" ON "studio_tasks" USING btree ("pms_project_id","workflow_status","position");--> statement-breakpoint
ALTER TABLE "pms_projects" ADD CONSTRAINT "chk_pms_projects_progress" CHECK ("pms_projects"."progress_percent" >= 0 AND "pms_projects"."progress_percent" <= 100);--> statement-breakpoint
ALTER TABLE "pms_projects" ADD CONSTRAINT "chk_pms_projects_status" CHECK ("pms_projects"."status" IN ('planning', 'in_progress', 'review', 'completed', 'on_hold', 'archived'));--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD CONSTRAINT "chk_studio_task_workflow" CHECK ("studio_tasks"."workflow_status" IN ('backlog', 'todo', 'in_progress', 'in_review', 'done'));--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD CONSTRAINT "chk_studio_task_priority" CHECK ("studio_tasks"."priority" IN ('low', 'medium', 'high', 'urgent'));--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD CONSTRAINT "chk_studio_task_review" CHECK ("studio_tasks"."review_status" IN ('none', 'pending_review', 'changes_requested', 'approved'));