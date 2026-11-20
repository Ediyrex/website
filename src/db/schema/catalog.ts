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
  check,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import {
  publicationStatusEnum,
  projectTypeEnum,
  projectMediaRoleEnum,
} from "./enums";
import { mediaAssets } from "./media";

export const serviceDivisions = pgTable(
  "service_divisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    displayNumber: varchar("display_number", { length: 12 })
      .notNull()
      .default("01"),
    name: varchar("name", { length: 80 }).notNull(),
    slug: varchar("slug", { length: 80 }).notNull().unique(),
    heading: varchar("heading", { length: 120 }).notNull().default(""),
    italicHeading: varchar("italic_heading", { length: 80 })
      .notNull()
      .default(""),
    description: text("description").notNull(),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    ctaLabel: varchar("cta_label", { length: 80 }).notNull().default("Explore"),
    destinationUrl: varchar("destination_url", { length: 160 })
      .notNull()
      .default("/services"),
    coverImageUrl: text("cover_image_url").notNull().default(""),
    coverAlt: varchar("cover_alt", { length: 240 }).notNull().default(""),
    iconName: varchar("icon_name", { length: 64 }),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    isFeatured: boolean("is_featured").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("chk_divisions_display_order", sql`${table.displayOrder} >= 0`),
  ]
);

export const services = pgTable(
  "services",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    divisionId: uuid("division_id")
      .notNull()
      .references(() => serviceDivisions.id, { onDelete: "restrict" }),
    title: varchar("title", { length: 140 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull().unique(),
    summary: varchar("summary", { length: 320 }).notNull(),
    description: text("description").notNull(),
    categoryLabel: varchar("category_label", { length: 80 }),
    deliverables: jsonb("deliverables").$type<string[]>().notNull().default([]),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    processStages: jsonb("process_stages")
      .$type<
        {
          title: string;
          description: string;
          iconName?: string | null;
          displayOrder?: number;
        }[]
      >()
      .notNull()
      .default([]),
    showPricing: boolean("show_pricing").notNull().default(false),
    startingPrice: varchar("starting_price", { length: 80 }),
    iconName: varchar("icon_name", { length: 64 }),
    coverAssetId: uuid("cover_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    isFeatured: boolean("is_featured").notNull().default(false),
    displayOrder: integer("display_order").notNull().default(0),
    status: publicationStatusEnum("status").notNull().default("draft"),
    seoTitle: varchar("seo_title", { length: 160 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    ogTitle: varchar("og_title", { length: 160 }),
    ogDescription: varchar("og_description", { length: 320 }),
    ogImageAssetId: uuid("og_image_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    canonicalUrl: varchar("canonical_url", { length: 300 }),
    robotsDirective: varchar("robots_directive", { length: 60 })
      .notNull()
      .default("index, follow"),
    schemaType: varchar("schema_type", { length: 60 })
      .notNull()
      .default("Service"),
    schemaJson: text("schema_json"),
    noIndex: boolean("no_index").notNull().default(false),
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
    check("chk_services_display_order", sql`${table.displayOrder} >= 0`),
    index("idx_services_division_published")
      .on(table.divisionId, table.displayOrder)
      .where(sql`${table.status} = 'published'`),
    index("idx_services_featured")
      .on(table.displayOrder)
      .where(sql`${table.status} = 'published' AND ${table.isFeatured} = true`),
  ]
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 180 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    summary: varchar("summary", { length: 400 }).notNull(),
    description: text("description").notNull(),
    projectType: projectTypeEnum("project_type").notNull().default("concept"),
    industry: varchar("industry", { length: 100 }),
    clientName: varchar("client_name", { length: 140 }),
    clientIsPublic: boolean("client_is_public").notNull().default(false),
    coverAssetId: uuid("cover_asset_id").references(() => mediaAssets.id, {
      onDelete: "restrict",
    }),
    projectDate: varchar("project_date", { length: 40 }),
    techStack: jsonb("tech_stack").$type<string[]>().notNull().default([]),
    liveUrl: text("live_url"),
    repositoryUrl: text("repository_url"),
    isFeatured: boolean("is_featured").notNull().default(false),
    displayOrder: integer("display_order").notNull().default(0),
    status: publicationStatusEnum("status").notNull().default("draft"),
    seoTitle: varchar("seo_title", { length: 160 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    ogTitle: varchar("og_title", { length: 160 }),
    ogDescription: varchar("og_description", { length: 320 }),
    ogImageAssetId: uuid("og_image_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    canonicalUrl: varchar("canonical_url", { length: 300 }),
    robotsDirective: varchar("robots_directive", { length: 60 })
      .notNull()
      .default("index, follow"),
    schemaType: varchar("schema_type", { length: 60 })
      .notNull()
      .default("CreativeWork"),
    schemaJson: text("schema_json"),
    noIndex: boolean("no_index").notNull().default(false),
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
    check("chk_projects_display_order", sql`${table.displayOrder} >= 0`),
    check(
      "chk_project_client_honesty",
      sql`(${table.projectType} = 'client') OR (${table.clientName} IS NULL AND ${table.clientIsPublic} = false)`
    ),
    index("idx_projects_published_order")
      .on(table.displayOrder, table.publishedAt)
      .where(sql`${table.status} = 'published'`),
    index("idx_projects_type_published")
      .on(table.projectType)
      .where(sql`${table.status} = 'published'`),
  ]
);

export const projectServices = pgTable(
  "project_services",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "restrict" }),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.serviceId] }),
    index("idx_project_services_service_id").on(table.serviceId),
  ]
);

export const caseStudies = pgTable("case_studies", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .unique()
    .references(() => projects.id, { onDelete: "cascade" }),
  challenge: text("challenge").notNull(),
  approach: text("approach").notNull(),
  solution: text("solution").notNull(),
  verifiedOutcomes: jsonb("verified_outcomes")
    .$type<string[]>()
    .notNull()
    .default([]),
  processSteps: jsonb("process_steps")
    .$type<{ title: string; description: string }[]>()
    .notNull()
    .default([]),
  status: publicationStatusEnum("status").notNull().default("draft"),
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
});

export const projectMedia = pgTable(
  "project_media",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    mediaAssetId: uuid("media_asset_id")
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "restrict" }),
    mediaRole: projectMediaRoleEnum("media_role")
      .notNull()
      .default("gallery"),
    displayOrder: integer("display_order").notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.mediaAssetId] }),
    check("chk_project_media_order", sql`${table.displayOrder} >= 0`),
    index("idx_project_media_order").on(table.projectId, table.displayOrder),
  ]
);

export const featuredPlacements = pgTable(
  "featured_placements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    destination: varchar("destination", { length: 64 }).notNull(), // 'homepage' | 'work_archive' | 'division' | 'industry' | 'campaign'
    targetId: varchar("target_id", { length: 120 }), // division slug (e.g. 'ai', 'branding') or industry slug (e.g. 'healthcare-clinics') or campaign identifier
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    featuredFrom: timestamp("featured_from", { withTimezone: true, mode: "date" }),
    featuredUntil: timestamp("featured_until", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_featured_placements_dest").on(
      table.destination,
      table.targetId,
      table.displayOrder
    ),
    index("idx_featured_placements_project").on(table.projectId),
  ]
);

export const industries = pgTable(
  "industries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 140 }).notNull(),
    tagline: varchar("tagline", { length: 240 }).notNull().default(""),
    shortDescription: varchar("short_description", { length: 500 }).notNull().default(""),
    description: text("description").notNull().default(""),
    heroHeadline: varchar("hero_headline", { length: 240 }),
    heroDescription: text("hero_description"),
    heroSupportingLabel: varchar("hero_supporting_label", { length: 140 }),
    ctaLabel: varchar("cta_label", { length: 80 }).notNull().default("Discuss Your Sector"),
    ctaDestination: varchar("cta_destination", { length: 160 }).notNull().default("/contact"),
    subIndustries: jsonb("sub_industries").$type<string[]>().notNull().default([]),
    deliverables: jsonb("deliverables").$type<string[]>().notNull().default([]),
    challenges: jsonb("challenges")
      .$type<{ title: string; description: string; displayOrder?: number }[]>()
      .notNull()
      .default([]),
    opportunities: jsonb("opportunities")
      .$type<{ title: string; description: string; displayOrder?: number }[]>()
      .notNull()
      .default([]),
    solutions: jsonb("solutions")
      .$type<
        {
          title: string;
          description: string;
          serviceIds?: string[];
          divisionIds?: string[];
          displayOrder?: number;
        }[]
      >()
      .notNull()
      .default([]),
    faqs: jsonb("faqs")
      .$type<{ question: string; answer: string; displayOrder?: number }[]>()
      .notNull()
      .default([]),
    coverImageUrl: text("cover_image_url").notNull().default(""),
    coverAssetId: uuid("cover_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    displayOrder: integer("display_order").notNull().default(0),
    status: publicationStatusEnum("status").notNull().default("draft"),
    isFeatured: boolean("is_featured").notNull().default(false),
    isHeroFeatured: boolean("is_hero_featured").notNull().default(false),
    seoTitle: varchar("seo_title", { length: 160 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    ogTitle: varchar("og_title", { length: 160 }),
    ogDescription: varchar("og_description", { length: 320 }),
    ogImageAssetId: uuid("og_image_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    canonicalUrl: varchar("canonical_url", { length: 300 }),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("chk_industries_display_order", sql`${table.displayOrder} >= 0`),
    index("idx_industries_published")
      .on(table.displayOrder)
      .where(sql`${table.status} = 'published'`),
    index("idx_industries_featured")
      .on(table.displayOrder)
      .where(sql`${table.status} = 'published' AND ${table.isFeatured} = true`),
    index("idx_industries_hero")
      .on(table.displayOrder)
      .where(sql`${table.isHeroFeatured} = true`),
  ]
);

export const sectorArchitectures = pgTable(
  "sector_architectures",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    number: varchar("number", { length: 20 }),
    category: varchar("category", { length: 160 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    description: text("description").notNull(),
    capabilities: jsonb("capabilities").$type<string[]>().notNull().default([]),
    displayOrder: integer("display_order").notNull().default(0),
    status: publicationStatusEnum("status").notNull().default("draft"),
    isFeatured: boolean("is_featured").notNull().default(true),
    isHighlighted: boolean("is_highlighted").notNull().default(false),
    detailRoute: varchar("detail_route", { length: 200 }).default("/contact"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("chk_sector_architectures_display_order", sql`${table.displayOrder} >= 0`),
    index("idx_sector_architectures_order").on(table.displayOrder),
  ]
);

export const industryServices = pgTable(
  "industry_services",
  {
    industryId: uuid("industry_id")
      .notNull()
      .references(() => industries.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.industryId, table.serviceId] }),
    index("idx_industry_services_service").on(table.serviceId),
  ]
);

export const industrySectorArchitectures = pgTable(
  "industry_sector_architectures",
  {
    industryId: uuid("industry_id")
      .notNull()
      .references(() => industries.id, { onDelete: "cascade" }),
    sectorArchitectureId: uuid("sector_architecture_id")
      .notNull()
      .references(() => sectorArchitectures.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.industryId, table.sectorArchitectureId] }),
    index("idx_ind_sec_arch_sec").on(table.sectorArchitectureId),
  ]
);

export const industryProjects = pgTable(
  "industry_projects",
  {
    industryId: uuid("industry_id")
      .notNull()
      .references(() => industries.id, { onDelete: "cascade" }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.industryId, table.projectId] }),
    index("idx_industry_projects_proj").on(table.projectId),
  ]
);


