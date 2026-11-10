CREATE TABLE "access_group_members" (
	"group_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "access_group_members_group_id_user_id_pk" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "access_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(80) NOT NULL,
	"division" varchar(64) DEFAULT 'Creative' NOT NULL,
	"description" varchar(280) DEFAULT '' NOT NULL,
	"default_studio_role" varchar(48) DEFAULT 'team_member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "access_groups_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "team_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"email_normalized" varchar(255) NOT NULL,
	"full_name" varchar(120) DEFAULT '' NOT NULL,
	"studio_role" varchar(48) DEFAULT 'team_member' NOT NULL,
	"department" varchar(64) DEFAULT 'Creative' NOT NULL,
	"project_id" uuid,
	"project_role" varchar(32) DEFAULT 'team_member' NOT NULL,
	"token_hash" varchar(128) NOT NULL,
	"status" varchar(24) DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"invited_by_user_id" uuid,
	"accepted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_invitations_token_hash_unique" UNIQUE("token_hash"),
	CONSTRAINT "chk_team_invitation_status" CHECK ("team_invitations"."status" IN ('pending', 'accepted', 'expired', 'revoked'))
);
--> statement-breakpoint
CREATE TABLE "team_role_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(48) NOT NULL,
	"name" varchar(80) NOT NULL,
	"base_role" varchar(24) DEFAULT 'editor' NOT NULL,
	"description" varchar(280) DEFAULT '' NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"permissions" jsonb DEFAULT '{"modules":{},"capabilities":{"publish":false,"approve":false,"inviteUsers":false,"manageBilling":false,"viewConfidential":false}}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_role_definitions_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "studio_role" varchar(48) DEFAULT 'team_member' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "department" varchar(64) DEFAULT 'Creative' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "job_title" varchar(120) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(40);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "removed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "access_group_members" ADD CONSTRAINT "access_group_members_group_id_access_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."access_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_group_members" ADD CONSTRAINT "access_group_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_invited_by_user_id_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_team_invitations_email" ON "team_invitations" USING btree ("email_normalized","status");