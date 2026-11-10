import { pgEnum } from "drizzle-orm/pg-core";

export const publicationStatusEnum = pgEnum("publication_status", [
  "draft",
  "published",
  "archived",
]);

export const accountStatusEnum = pgEnum("account_status", [
  "invited",
  "active",
  "disabled",
]);

export const projectTypeEnum = pgEnum("project_type", [
  "client",
  "concept",
  "internal",
]);

export const projectMediaRoleEnum = pgEnum("project_media_role", [
  "cover",
  "gallery",
  "video_preview",
  "diagram",
]);

export const mediaResourceTypeEnum = pgEnum("media_resource_type", [
  "image",
  "video",
  "document",
]);

export const enquiryStatusEnum = pgEnum("enquiry_status", [
  "new",
  "reviewing",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
  "archived",
]);

export const outboxStatusEnum = pgEnum("outbox_status", [
  "pending",
  "processing",
  "sent",
  "failed",
  "dead_letter",
]);

export const navigationLocationEnum = pgEnum("navigation_location", [
  "header",
  "footer_primary",
  "footer_legal",
]);

