import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  char,
  timestamp,
  jsonb,
  check,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { enquiryStatusEnum, outboxStatusEnum } from "./enums";
import { users } from "./auth";
import { serviceDivisions, services } from "./catalog";

export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    referenceCode: varchar("reference_code", { length: 24 })
      .notNull()
      .unique(),
    contactName: varchar("contact_name", { length: 120 }).notNull(),
    emailNormalized: varchar("email_normalized", { length: 255 }).notNull(),
    companyName: varchar("company_name", { length: 140 }),
    phone: varchar("phone", { length: 40 }),
    serviceDivisionId: uuid("service_division_id").references(
      () => serviceDivisions.id,
      { onDelete: "set null" }
    ),
    serviceId: uuid("service_id").references(() => services.id, {
      onDelete: "set null",
    }),
    projectType: varchar("project_type", { length: 140 }).notNull(),
    goalsAndRequirements: text("goals_and_requirements").notNull(),
    budgetMin: integer("budget_min"),
    budgetMax: integer("budget_max"),
    budgetCurrency: char("budget_currency", { length: 3 }),
    expectedTimeline: varchar("expected_timeline", { length: 64 }).notNull(),
    status: enquiryStatusEnum("status").notNull().default("new"),
    source: varchar("source", { length: 64 })
      .notNull()
      .default("website_contact_form"),
    wantsDiscoveryCall: boolean("wants_discovery_call")
      .notNull()
      .default(false),
    consentAt: timestamp("consent_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    privacyNoticeVersion: varchar("privacy_notice_version", { length: 32 })
      .notNull()
      .default("v1.0"),
    assignedAdminUserId: uuid("assigned_admin_user_id").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    dedupeHash: varchar("dedupe_hash", { length: 64 }),
    ipHash: varchar("ip_hash", { length: 64 }),
    submittedAt: timestamp("submitted_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    check(
      "chk_enquiries_budget_non_negative",
      sql`(${table.budgetMin} IS NULL OR ${table.budgetMin} >= 0) AND (${table.budgetMax} IS NULL OR ${table.budgetMax} >= 0)`
    ),
    check(
      "chk_budget_range_valid",
      sql`${table.budgetMin} IS NULL OR ${table.budgetMax} IS NULL OR ${table.budgetMin} <= ${table.budgetMax}`
    ),
    check(
      "chk_budget_currency_required",
      sql`(${table.budgetMin} IS NULL AND ${table.budgetMax} IS NULL) OR (${table.budgetCurrency} ~ '^[A-Z]{3}$')`
    ),
    index("idx_enquiries_status_submitted").on(table.status, table.submittedAt),
    index("idx_enquiries_assigned_admin")
      .on(table.assignedAdminUserId)
      .where(sql`${table.assignedAdminUserId} IS NOT NULL`),
    index("idx_enquiries_email").on(table.emailNormalized),
    index("idx_enquiries_dedupe_hash")
      .on(table.dedupeHash, table.submittedAt)
      .where(sql`${table.dedupeHash} IS NOT NULL`),
  ]
);

export const enquiryNotes = pgTable(
  "enquiry_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => enquiries.id, { onDelete: "cascade" }),
    authorUserId: uuid("author_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_enquiry_notes_enquiry").on(table.enquiryId, table.createdAt),
  ]
);

export const enquiryStatusHistory = pgTable(
  "enquiry_status_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => enquiries.id, { onDelete: "cascade" }),
    changedById: uuid("changed_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    previousStatus: enquiryStatusEnum("previous_status"),
    newStatus: enquiryStatusEnum("new_status").notNull(),
    reason: varchar("reason", { length: 320 }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_enquiry_status_history_enquiry").on(
      table.enquiryId,
      table.createdAt
    ),
  ]
);

export const notificationOutbox = pgTable(
  "notification_outbox",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventType: varchar("event_type", { length: 80 }).notNull(),
    entityType: varchar("entity_type", { length: 64 }).notNull(),
    entityId: uuid("entity_id").notNull(),
    dedupeKey: varchar("dedupe_key", { length: 160 }).unique(),
    payload: jsonb("payload")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    status: outboxStatusEnum("status").notNull().default("pending"),
    attemptCount: integer("attempt_count").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(5),
    nextRetryAt: timestamp("next_retry_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    lockedAt: timestamp("locked_at", { withTimezone: true, mode: "date" }),
    lastError: varchar("last_error", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    deliveredAt: timestamp("delivered_at", {
      withTimezone: true,
      mode: "date",
    }),
  },
  (table) => [
    check("chk_outbox_attempt_count", sql`${table.attemptCount} >= 0`),
    check("chk_outbox_max_attempts", sql`${table.maxAttempts} > 0`),
    index("idx_outbox_pending_poll")
      .on(table.nextRetryAt)
      .where(sql`${table.status} IN ('pending', 'failed')`),
  ]
);

