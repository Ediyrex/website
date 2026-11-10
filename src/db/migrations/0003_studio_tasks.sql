CREATE TABLE "studio_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"category" varchar(100) DEFAULT 'CMS · General' NOT NULL,
	"due_date_label" varchar(40) DEFAULT 'This week' NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"assignee_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD CONSTRAINT "studio_tasks_assignee_user_id_users_id_fk" FOREIGN KEY ("assignee_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_studio_tasks_completed" ON "studio_tasks" USING btree ("completed","created_at");