import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
  unique,
  check,
  index,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { accessGroups, users } from "./auth";
import { crmClients, enquiries } from "./enquiries";
import { mediaAssets } from "./media";

export const pmsProjects = pgTable(
  "pms_projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    referenceCode: varchar("reference_code", { length: 24 }),
    title: varchar("title", { length: 200 }).notNull(),
    clientId: uuid("client_id").references(() => crmClients.id, {
      onDelete: "set null",
    }),
    sourceEnquiryId: uuid("source_enquiry_id").references(() => enquiries.id, {
      onDelete: "set null",
    }),
    serviceInterest: varchar("service_interest", { length: 140 })
      .notNull()
      .default("Studio Delivery"),
    status: varchar("status", { length: 32 }).notNull().default("planning"),
    dueDateLabel: varchar("due_date_label", { length: 64 })
      .notNull()
      .default("TBD"),
    summary: text("summary").notNull().default(""),
    description: text("description").notNull().default(""),
    internalNotes: text("internal_notes").notNull().default(""),
    coverAssetId: uuid("cover_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    progressPercent: integer("progress_percent").notNull().default(0),
    startDate: timestamp("start_date", { withTimezone: true, mode: "date" }),
    dueDate: timestamp("due_date", { withTimezone: true, mode: "date" }),
    templateKey: varchar("template_key", { length: 64 }),
    workflowConfig: jsonb("workflow_config")
      .$type<{
        labels?: string[];
        stageNames?: Record<string, string>;
      }>()
      .notNull()
      .default({}),
    leadUserId: uuid("lead_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "chk_pms_projects_status",
      sql`${table.status} IN ('planning', 'in_progress', 'review', 'completed', 'on_hold', 'archived')`
    ),
    check(
      "chk_pms_projects_progress",
      sql`${table.progressPercent} >= 0 AND ${table.progressPercent} <= 100`
    ),
    index("idx_pms_projects_status").on(table.status, table.createdAt),
  ]
);

export const pmsStarredProjects = pgTable(
  "pms_starred_projects",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => pmsProjects.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.projectId] })]
);

export const pmsProjectMembers = pgTable(
  "pms_project_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => pmsProjects.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectRole: varchar("project_role", { length: 32 })
      .notNull()
      .default("team_member"),
    capacityHoursPerWeek: integer("capacity_hours_per_week")
      .notNull()
      .default(40),
    membershipStatus: varchar("membership_status", { length: 24 })
      .notNull()
      .default("active"),
    addedAt: timestamp("added_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_pms_project_member").on(table.projectId, table.userId),
    check(
      "chk_pms_member_role",
      sql`${table.projectRole} IN ('super_admin', 'studio_admin', 'project_manager', 'team_lead', 'team_member', 'viewer')`
    ),
    check(
      "chk_pms_member_status",
      sql`${table.membershipStatus} IN ('active', 'inactive')`
    ),
    index("idx_pms_members_user").on(table.userId),
  ]
);

export const studioTasks = pgTable(
  "studio_tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    pmsProjectId: uuid("pms_project_id").references(() => pmsProjects.id, {
      onDelete: "set null",
    }),
    taskCode: varchar("task_code", { length: 24 }),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull().default(""),
    category: varchar("category", { length: 100 })
      .notNull()
      .default("CMS · General"),
    workflowStatus: varchar("workflow_status", { length: 32 })
      .notNull()
      .default("todo"),
    priority: varchar("priority", { length: 20 }).notNull().default("medium"),
    labels: jsonb("labels").$type<string[]>().notNull().default([]),
    dueDateLabel: varchar("due_date_label", { length: 40 })
      .notNull()
      .default("This week"),
    startDate: timestamp("start_date", { withTimezone: true, mode: "date" }),
    dueDate: timestamp("due_date", { withTimezone: true, mode: "date" }),
    estimatedMinutes: integer("estimated_minutes").notNull().default(0),
    loggedMinutes: integer("logged_minutes").notNull().default(0),
    position: integer("position").notNull().default(0),
    completed: boolean("completed").notNull().default(false),
    reviewStatus: varchar("review_status", { length: 24 })
      .notNull()
      .default("none"),
    submittedByUserId: uuid("submitted_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedByUserId: uuid("reviewed_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true, mode: "date" }),
    reviewFeedback: text("review_feedback"),
    dependencyTaskIds: jsonb("dependency_task_ids")
      .$type<string[]>()
      .notNull()
      .default([]),
    recurrenceRule: varchar("recurrence_rule", { length: 24 })
      .notNull()
      .default("none"),
    recurrenceParentId: uuid("recurrence_parent_id"),
    assigneeUserId: uuid("assignee_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "chk_studio_task_workflow",
      sql`${table.workflowStatus} IN ('backlog', 'todo', 'in_progress', 'in_review', 'done')`
    ),
    check(
      "chk_studio_task_priority",
      sql`${table.priority} IN ('low', 'medium', 'high', 'urgent')`
    ),
    check(
      "chk_studio_task_review",
      sql`${table.reviewStatus} IN ('none', 'pending_review', 'changes_requested', 'approved')`
    ),
    check(
      "chk_studio_task_recurrence",
      sql`${table.recurrenceRule} IN ('none', 'daily', 'weekly', 'biweekly', 'monthly')`
    ),
    index("idx_studio_tasks_completed").on(table.completed, table.createdAt),
    index("idx_studio_tasks_project_status").on(
      table.pmsProjectId,
      table.workflowStatus,
      table.position
    ),
  ]
);

export const pmsTaskAssignees = pgTable(
  "pms_task_assignees",
  {
    taskId: uuid("task_id")
      .notNull()
      .references(() => studioTasks.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.taskId, table.userId] })]
);

export const pmsTaskSubtasks = pgTable(
  "pms_task_subtasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    taskId: uuid("task_id")
      .notNull()
      .references(() => studioTasks.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 240 }).notNull(),
    completed: boolean("completed").notNull().default(false),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_pms_subtasks_task").on(table.taskId, table.position),
  ]
);

export const pmsTaskComments = pgTable(
  "pms_task_comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    taskId: uuid("task_id")
      .notNull()
      .references(() => studioTasks.id, { onDelete: "cascade" }),
    authorUserId: uuid("author_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    body: text("body").notNull(),
    mentions: jsonb("mentions").$type<string[]>().notNull().default([]),
    attachmentAssetIds: jsonb("attachment_asset_ids")
      .$type<string[]>()
      .notNull()
      .default([]),
    isReviewNote: boolean("is_review_note").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_pms_task_comments_task").on(table.taskId, table.createdAt),
  ]
);

export const pmsTaskWorkLogs = pgTable(
  "pms_task_work_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    taskId: uuid("task_id")
      .notNull()
      .references(() => studioTasks.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    minutes: integer("minutes").notNull(),
    note: varchar("note", { length: 300 }).notNull().default(""),
    loggedAt: timestamp("logged_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("chk_pms_work_log_minutes", sql`${table.minutes} > 0`),
    index("idx_pms_work_logs_task").on(table.taskId, table.loggedAt),
  ]
);

export const pmsMilestones = pgTable(
  "pms_milestones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => pmsProjects.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 180 }).notNull(),
    description: text("description").notNull().default(""),
    dueDate: timestamp("due_date", { withTimezone: true, mode: "date" }),
    status: varchar("status", { length: 24 }).notNull().default("pending"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "chk_pms_milestone_status",
      sql`${table.status} IN ('pending', 'in_progress', 'completed', 'delayed')`
    ),
    index("idx_pms_milestones_project").on(table.projectId, table.position),
  ]
);

export const pmsProjectFiles = pgTable(
  "pms_project_files",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => pmsProjects.id, { onDelete: "cascade" }),
    taskId: uuid("task_id").references(() => studioTasks.id, {
      onDelete: "set null",
    }),
    mediaAssetId: uuid("media_asset_id")
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 240 }).notNull(),
    category: varchar("category", { length: 32 })
      .notNull()
      .default("deliverable"),
    versionGroupId: uuid("version_group_id"),
    version: integer("version").notNull().default(1),
    versionNote: varchar("version_note", { length: 240 }),
    uploadedByUserId: uuid("uploaded_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "chk_pms_file_category",
      sql`${table.category} IN ('deliverable', 'reference', 'export', 'document')`
    ),
    check("chk_pms_file_version", sql`${table.version} > 0`),
    index("idx_pms_files_project").on(table.projectId, table.createdAt),
  ]
);

export const pmsDiscussions = pgTable(
  "pms_discussions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => pmsProjects.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id").references(
      (): AnyPgColumn => pmsDiscussions.id,
      { onDelete: "cascade" }
    ),
    authorUserId: uuid("author_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    body: text("body").notNull(),
    mentions: jsonb("mentions").$type<string[]>().notNull().default([]),
    attachmentAssetIds: jsonb("attachment_asset_ids")
      .$type<string[]>()
      .notNull()
      .default([]),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_pms_discussions_project").on(table.projectId, table.createdAt),
  ]
);

export const pmsActivityLogs = pgTable(
  "pms_activity_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id").references(() => pmsProjects.id, {
      onDelete: "cascade",
    }),
    taskId: uuid("task_id").references(() => studioTasks.id, {
      onDelete: "cascade",
    }),
    actorUserId: uuid("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: varchar("action", { length: 80 }).notNull(),
    summary: text("summary").notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_pms_activity_project").on(table.projectId, table.createdAt),
    index("idx_pms_activity_task").on(table.taskId, table.createdAt),
  ]
);

export const pmsNotifications = pgTable(
  "pms_notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    recipientUserId: uuid("recipient_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    actorUserId: uuid("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    projectId: uuid("project_id").references(() => pmsProjects.id, {
      onDelete: "cascade",
    }),
    taskId: uuid("task_id").references(() => studioTasks.id, {
      onDelete: "cascade",
    }),
    category: varchar("category", { length: 24 }).notNull().default("task"),
    title: varchar("title", { length: 200 }).notNull(),
    body: text("body").notNull().default(""),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "chk_pms_notification_category",
      sql`${table.category} IN ('task', 'mention', 'review', 'file', 'project')`
    ),
    index("idx_pms_notifications_recipient").on(
      table.recipientUserId,
      table.isRead,
      table.createdAt
    ),
  ]
);

export const pmsCustomTemplates = pgTable("pms_custom_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 140 }).notNull(),
  serviceInterest: varchar("service_interest", { length: 140 })
    .notNull()
    .default("Studio Delivery"),
  description: text("description").notNull().default(""),
  labelsJson: jsonb("labels_json").$type<string[]>().notNull().default([]),
  milestonesJson: jsonb("milestones_json")
    .$type<Array<{ title: string; offsetDays: number }>>()
    .notNull()
    .default([]),
  tasksJson: jsonb("tasks_json")
    .$type<
      Array<{
        title: string;
        workflowStatus: "backlog" | "todo" | "in_progress" | "in_review" | "done";
        priority: "low" | "medium" | "high" | "urgent";
        labels: string[];
        offsetDays: number;
        estimatedMinutes: number;
        subtasks?: string[];
      }>
    >()
    .notNull()
    .default([]),
  createdByUserId: uuid("created_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const pmsSavedFilters = pgTable(
  "pms_saved_filters",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    scope: varchar("scope", { length: 24 }).notNull().default("tasks"),
    name: varchar("name", { length: 80 }).notNull(),
    filterConfig: jsonb("filter_config")
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "chk_pms_saved_filter_scope",
      sql`${table.scope} IN ('projects', 'tasks', 'my_tasks')`
    ),
    index("idx_pms_saved_filters_user").on(table.userId, table.scope),
  ]
);

export const accessGroupProjectAccess = pgTable(
  "access_group_project_access",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => accessGroups.id, { onDelete: "cascade" }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => pmsProjects.id, { onDelete: "cascade" }),
    projectRole: varchar("project_role", { length: 32 })
      .notNull()
      .default("team_member"),
    allowedBoards: jsonb("allowed_boards")
      .$type<string[]>()
      .notNull()
      .default(["backlog", "todo", "in_progress", "in_review", "done"]),
    boardRoles: jsonb("board_roles")
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_access_group_project").on(table.groupId, table.projectId),
    check(
      "chk_group_project_role",
      sql`${table.projectRole} IN ('super_admin', 'studio_admin', 'project_manager', 'team_lead', 'team_member', 'viewer', 'no_access')`
    ),
    index("idx_group_project_access_group").on(table.groupId),
  ]
);



