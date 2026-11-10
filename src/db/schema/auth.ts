import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
  check,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { accountStatusEnum } from "./enums";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  emailNormalized: varchar("email_normalized", { length: 255 })
    .notNull()
    .unique(),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  passwordHash: text("password_hash"),
  status: accountStatusEnum("status").notNull().default("invited"),
  studioRole: varchar("studio_role", { length: 48 })
    .notNull()
    .default("team_member"),
  department: varchar("department", { length: 64 })
    .notNull()
    .default("Creative"),
  jobTitle: varchar("job_title", { length: 120 }).notNull().default(""),
  phone: varchar("phone", { length: 40 }),
  avatarUrl: text("avatar_url"),
  emailVerifiedAt: timestamp("email_verified_at", {
    withTimezone: true,
    mode: "date",
  }),
  lastLoginAt: timestamp("last_login_at", {
    withTimezone: true,
    mode: "date",
  }),
  removedAt: timestamp("removed_at", { withTimezone: true, mode: "date" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  description: varchar("description", { length: 255 }).notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] })]
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_sessions_user_active")
      .on(table.userId, table.expiresAt)
      .where(sql`${table.revokedAt} IS NULL`),
  ]
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: uuid("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    actorEmailSnapshot: varchar("actor_email_snapshot", { length: 255 }),
    action: varchar("action", { length: 80 }).notNull(),
    entityType: varchar("entity_type", { length: 64 }).notNull(),
    entityId: uuid("entity_id"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_audit_logs_entity").on(
      table.entityType,
      table.entityId,
      table.createdAt
    ),
    index("idx_audit_logs_actor").on(table.actorUserId, table.createdAt),
  ]
);

export const teamRoleDefinitions = pgTable("team_role_definitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 48 }).notNull().unique(),
  name: varchar("name", { length: 80 }).notNull(),
  baseRole: varchar("base_role", { length: 24 }).notNull().default("editor"),
  description: varchar("description", { length: 280 }).notNull().default(""),
  isSystem: boolean("is_system").notNull().default(false),
  permissions: jsonb("permissions")
    .$type<{
      modules: Record<
        string,
        { view: boolean; create: boolean; edit: boolean; delete: boolean }
      >;
      capabilities: {
        publish: boolean;
        approve: boolean;
        inviteUsers: boolean;
        manageBilling: boolean;
        viewConfidential: boolean;
      };
    }>()
    .notNull()
    .default({ modules: {}, capabilities: { publish: false, approve: false, inviteUsers: false, manageBilling: false, viewConfidential: false } }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const teamInvitations = pgTable(
  "team_invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    emailNormalized: varchar("email_normalized", { length: 255 }).notNull(),
    fullName: varchar("full_name", { length: 120 }).notNull().default(""),
    studioRole: varchar("studio_role", { length: 48 })
      .notNull()
      .default("team_member"),
    department: varchar("department", { length: 64 })
      .notNull()
      .default("Creative"),
    projectId: uuid("project_id"),
    projectRole: varchar("project_role", { length: 32 })
      .notNull()
      .default("team_member"),
    tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(),
    status: varchar("status", { length: 24 }).notNull().default("pending"),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    invitedByUserId: uuid("invited_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    acceptedAt: timestamp("accepted_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "chk_team_invitation_status",
      sql`${table.status} IN ('pending', 'accepted', 'expired', 'revoked')`
    ),
    index("idx_team_invitations_email").on(table.emailNormalized, table.status),
  ]
);

export const accessGroups = pgTable("access_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  division: varchar("division", { length: 64 }).notNull().default("Creative"),
  description: varchar("description", { length: 280 }).notNull().default(""),
  defaultStudioRole: varchar("default_studio_role", { length: 48 })
    .notNull()
    .default("team_member"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const accessGroupMembers = pgTable(
  "access_group_members",
  {
    groupId: uuid("group_id")
      .notNull()
      .references(() => accessGroups.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.groupId, table.userId] })]
);


