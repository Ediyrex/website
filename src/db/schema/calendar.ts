import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

/**
 * Connected Google Accounts for Calendar Integration (OAuth 2.0)
 */
export const googleCalendarAccounts = pgTable(
  "google_calendar_accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    googleUserId: varchar("google_user_id", { length: 120 }),
    email: varchar("email", { length: 255 }).notNull(),
    accountName: varchar("account_name", { length: 160 }),
    avatarUrl: text("avatar_url"),
    accessToken: text("access_token"),
    refreshTokenEncrypted: text("refresh_token_encrypted"),
    tokenExpiresAt: timestamp("token_expires_at", {
      withTimezone: true,
      mode: "date",
    }),
    scope: text("scope"),
    isActive: boolean("is_active").notNull().default(true),
    connectedAt: timestamp("connected_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_google_accounts_user").on(table.userId),
    index("idx_google_accounts_email").on(table.email),
  ]
);

/**
 * Authorized Google Calendars belonging to a connected account
 */
export const googleCalendars = pgTable(
  "google_calendars",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => googleCalendarAccounts.id, { onDelete: "cascade" }),
    googleCalendarId: varchar("google_calendar_id", { length: 255 }).notNull(),
    summary: varchar("summary", { length: 255 }).notNull(),
    description: text("description"),
    timeZone: varchar("time_zone", { length: 100 }).default("Asia/Kolkata"),
    colorId: varchar("color_id", { length: 40 }),
    backgroundColor: varchar("background_color", { length: 40 }),
    foregroundColor: varchar("foreground_color", { length: 40 }),
    isPrimary: boolean("is_primary").notNull().default(false),
    isSelected: boolean("is_selected").notNull().default(true),
    accessRole: varchar("access_role", { length: 60 }).default("owner"),
    syncToken: text("sync_token"),
    lastSyncedAt: timestamp("last_synced_at", {
      withTimezone: true,
      mode: "date",
    }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_google_calendars_account").on(table.accountId),
    index("idx_google_calendars_gid").on(table.googleCalendarId),
  ]
);

/**
 * Synchronized and Local Calendar Events
 */
export const calendarEvents = pgTable(
  "calendar_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    calendarId: uuid("calendar_id").references(() => googleCalendars.id, {
      onDelete: "set null",
    }),
    googleEventId: varchar("google_event_id", { length: 255 }),
    title: varchar("title", { length: 300 }).notNull(),
    description: text("description"),
    location: text("location"),
    startsAt: timestamp("starts_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    endsAt: timestamp("ends_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    isAllDay: boolean("is_all_day").notNull().default(false),
    timeZone: varchar("time_zone", { length: 100 }).default("Asia/Kolkata"),
    status: varchar("status", { length: 50 }).notNull().default("confirmed"),
    category: varchar("category", { length: 60 })
      .notNull()
      .default("Client Meeting"),
    htmlLink: text("html_link"),
    meetLink: text("meet_link"),
    creatorEmail: varchar("creator_email", { length: 255 }),
    attendees: jsonb("attendees").$type<
      { email: string; displayName?: string; responseStatus?: string }[]
    >(),
    recurrence: jsonb("recurrence").$type<string[]>(),
    reminders: jsonb("reminders").$type<
      { method: string; minutes: number }[]
    >(),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_calendar_events_calendar").on(table.calendarId),
    index("idx_calendar_events_google_id").on(table.googleEventId),
    index("idx_calendar_events_range").on(table.startsAt, table.endsAt),
    index("idx_calendar_events_category").on(table.category),
  ]
);
