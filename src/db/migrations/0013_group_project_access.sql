CREATE TABLE "access_group_project_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"project_role" varchar(32) DEFAULT 'team_member' NOT NULL,
	"allowed_boards" jsonb DEFAULT '["backlog","todo","in_progress","in_review","done"]'::jsonb NOT NULL,
	"board_roles" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_access_group_project" UNIQUE("group_id","project_id"),
	CONSTRAINT "chk_group_project_role" CHECK ("access_group_project_access"."project_role" IN ('super_admin', 'studio_admin', 'project_manager', 'team_lead', 'team_member', 'viewer', 'no_access'))
);
--> statement-breakpoint
ALTER TABLE "access_group_project_access" ADD CONSTRAINT "access_group_project_access_group_id_access_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."access_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_group_project_access" ADD CONSTRAINT "access_group_project_access_project_id_pms_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."pms_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_group_project_access_group" ON "access_group_project_access" USING btree ("group_id");