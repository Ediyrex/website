CREATE TABLE "crm_clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(140) NOT NULL,
	"email_normalized" varchar(255) NOT NULL,
	"company_name" varchar(140),
	"phone" varchar(40),
	"service_interest" varchar(160) DEFAULT 'General Consultation' NOT NULL,
	"source" varchar(64) DEFAULT 'inquiry_conversion' NOT NULL,
	"source_enquiry_id" uuid,
	"status" varchar(24) DEFAULT 'active' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_crm_clients_status" CHECK ("crm_clients"."status" IN ('active', 'archived'))
);
--> statement-breakpoint
CREATE TABLE "crm_followups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid,
	"client_id" uuid,
	"title" varchar(200) NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"channel" varchar(32) DEFAULT 'email' NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"assigned_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_crm_followups_channel" CHECK ("crm_followups"."channel" IN ('email', 'call', 'meeting', 'whatsapp', 'other'))
);
--> statement-breakpoint
CREATE TABLE "pms_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"client_id" uuid,
	"source_enquiry_id" uuid,
	"service_interest" varchar(140) DEFAULT 'Studio Delivery' NOT NULL,
	"status" varchar(32) DEFAULT 'planning' NOT NULL,
	"due_date_label" varchar(64) DEFAULT 'TBD' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"lead_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_pms_projects_status" CHECK ("pms_projects"."status" IN ('planning', 'in_progress', 'review', 'completed', 'on_hold'))
);
--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "converted_client_id" uuid;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD COLUMN "pms_project_id" uuid;--> statement-breakpoint
ALTER TABLE "crm_clients" ADD CONSTRAINT "crm_clients_source_enquiry_id_enquiries_id_fk" FOREIGN KEY ("source_enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_followups" ADD CONSTRAINT "crm_followups_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_followups" ADD CONSTRAINT "crm_followups_client_id_crm_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."crm_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_followups" ADD CONSTRAINT "crm_followups_assigned_user_id_users_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_projects" ADD CONSTRAINT "pms_projects_client_id_crm_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."crm_clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_projects" ADD CONSTRAINT "pms_projects_source_enquiry_id_enquiries_id_fk" FOREIGN KEY ("source_enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_projects" ADD CONSTRAINT "pms_projects_lead_user_id_users_id_fk" FOREIGN KEY ("lead_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_crm_clients_status" ON "crm_clients" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "idx_crm_clients_email" ON "crm_clients" USING btree ("email_normalized");--> statement-breakpoint
CREATE INDEX "idx_crm_followups_due" ON "crm_followups" USING btree ("completed","due_at");--> statement-breakpoint
CREATE INDEX "idx_pms_projects_status" ON "pms_projects" USING btree ("status","created_at");--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_converted_client_id_crm_clients_id_fk" FOREIGN KEY ("converted_client_id") REFERENCES "public"."crm_clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_tasks" ADD CONSTRAINT "studio_tasks_pms_project_id_pms_projects_id_fk" FOREIGN KEY ("pms_project_id") REFERENCES "public"."pms_projects"("id") ON DELETE set null ON UPDATE no action;