import {
  pgTable,
  uuid,
  varchar,
  text,
  bigint,
  integer,
  timestamp,
  jsonb,
  unique,
  check,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { mediaResourceTypeEnum } from "./enums";
import { users } from "./auth";

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storageProvider: varchar("storage_provider", { length: 32 })
      .notNull()
      .default("cloudinary"),
    providerAssetId: varchar("provider_asset_id", { length: 255 }).notNull(),
    providerPublicId: varchar("provider_public_id", { length: 255 }),
    assetUrl: text("asset_url").notNull(),
    secureUrl: text("secure_url").notNull(),
    resourceType: mediaResourceTypeEnum("resource_type").notNull(),
    mimeType: varchar("mime_type", { length: 128 }).notNull(),
    fileSizeBytes: bigint("file_size_bytes", { mode: "number" }).notNull(),
    width: integer("width"),
    height: integer("height"),
    altText: varchar("alt_text", { length: 300 }).notNull().default(""),
    caption: text("caption"),
    providerMetadata: jsonb("provider_metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    uploadedByUserId: uuid("uploaded_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    archivedAt: timestamp("archived_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_media_provider_asset").on(
      table.storageProvider,
      table.providerAssetId
    ),
    check("chk_media_file_size_positive", sql`${table.fileSizeBytes} > 0`),
    check(
      "chk_media_dimensions_valid",
      sql`(${table.width} IS NULL OR ${table.width} > 0) AND (${table.height} IS NULL OR ${table.height} > 0)`
    ),
    index("idx_media_assets_resource_type")
      .on(table.resourceType)
      .where(sql`${table.archivedAt} IS NULL`),
  ]
);

