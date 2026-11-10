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
import { publicationStatusEnum, navigationLocationEnum } from "./enums";
import { users } from "./auth";
import { mediaAssets } from "./media";
import { serviceDivisions } from "./catalog";
import { enquiries } from "./enquiries";

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorDisplayName: varchar("author_display_name", {
      length: 120,
    }).notNull(),
    authorRole: varchar("author_role", { length: 120 }),
    companyName: varchar("company_name", { length: 140 }),
    content: text("content").notNull(),
    mediaAssetId: uuid("media_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    sourceUrl: text("source_url"),
    consentVerifiedAt: timestamp("consent_verified_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    status: publicationStatusEnum("status").notNull().default("draft"),
    displayOrder: integer("display_order").notNull().default(0),
    publishedAt: timestamp("published_at", {
      withTimezone: true,
      mode: "date",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("chk_testimonials_display_order", sql`${table.displayOrder} >= 0`),
    index("idx_testimonials_published")
      .on(table.displayOrder)
      .where(sql`${table.status} = 'published'`),
  ]
);

export const blogCategories = pgTable("blog_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorUserId: uuid("author_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    excerpt: varchar("excerpt", { length: 400 }).notNull(),
    bodyMarkdown: text("body_markdown").notNull(),
    coverAssetId: uuid("cover_asset_id").references(() => mediaAssets.id, {
      onDelete: "restrict",
    }),
    status: publicationStatusEnum("status").notNull().default("draft"),
    seoTitle: varchar("seo_title", { length: 160 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    canonicalUrl: text("canonical_url"),
    publishedAt: timestamp("published_at", {
      withTimezone: true,
      mode: "date",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_blog_posts_published")
      .on(table.publishedAt)
      .where(sql`${table.status} = 'published'`),
  ]
);

export const blogPostCategories = pgTable(
  "blog_post_categories",
  {
    blogPostId: uuid("blog_post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => blogCategories.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.blogPostId, table.categoryId] })]
);

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  settingValue: jsonb("setting_value")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  description: varchar("description", { length: 255 }),
  isPublic: boolean("is_public").notNull().default(false),
  updatedByUserId: uuid("updated_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const navigationItems = pgTable(
  "navigation_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    label: varchar("label", { length: 64 }).notNull(),
    destination: varchar("destination", { length: 500 }).notNull(),
    isExternal: boolean("is_external").notNull().default(false),
    location: navigationLocationEnum("location").notNull(),
    parentId: uuid("parent_id").references(
      (): AnyPgColumn => navigationItems.id,
      { onDelete: "cascade" }
    ),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("chk_nav_display_order", sql`${table.displayOrder} >= 0`),
    check(
      "chk_nav_no_self_parent",
      sql`${table.parentId} IS NULL OR ${table.parentId} <> ${table.id}`
    ),
    index("idx_navigation_location_active")
      .on(table.location, table.displayOrder)
      .where(sql`${table.isActive} = true`),
  ]
);

export const bookingRecords = pgTable(
  "booking_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    provider: varchar("provider", { length: 40 }).notNull(),
    providerBookingId: varchar("provider_booking_id", {
      length: 160,
    }).notNull(),
    enquiryId: uuid("enquiry_id").references(() => enquiries.id, {
      onDelete: "set null",
    }),
    bookingStatus: varchar("booking_status", { length: 40 }).notNull(),
    startsAt: timestamp("starts_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    endsAt: timestamp("ends_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    providerMetadata: jsonb("provider_metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_booking_provider_id").on(
      table.provider,
      table.providerBookingId
    ),
    check("chk_booking_time_valid", sql`${table.endsAt} > ${table.startsAt}`),
    index("idx_booking_records_enquiry")
      .on(table.enquiryId)
      .where(sql`${table.enquiryId} IS NOT NULL`),
  ]
);

export const studioProducts = pgTable(
  "studio_products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    divisionId: uuid("division_id").references(() => serviceDivisions.id, {
      onDelete: "set null",
    }),
    name: varchar("name", { length: 140 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull().unique(),
    tagline: varchar("tagline", { length: 240 }).notNull(),
    description: text("description").notNull(),
    productStage: varchar("product_stage", { length: 32 }).notNull(),
    techStack: jsonb("tech_stack").$type<string[]>().notNull().default([]),
    demoUrl: text("demo_url"),
    status: publicationStatusEnum("status").notNull().default("draft"),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "chk_product_stage",
      sql`${table.productStage} IN ('research', 'alpha', 'beta', 'live')`
    ),
    check("chk_studio_products_order", sql`${table.displayOrder} >= 0`),
  ]
);

