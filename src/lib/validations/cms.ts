import { z } from "zod";
import { sanitizePlainText } from "@/lib/server/sanitize";

const safeText = (max: number, min = 0) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .transform(sanitizePlainText);

const optionalSafeText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform(sanitizePlainText)
    .optional()
    .nullable();

const safeHttpOrRelativeUrlSchema = z
  .string()
  .trim()
  .max(1000)
  .refine((val) => {
    if (!val) return true;
    if (val.startsWith("/")) return !val.startsWith("//");
    try {
      const parsed = new URL(val);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  }, "URL must start with https://, http://, or /")
  .optional()
  .nullable();

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const caseStudyInputSchema = z.object({
  challenge: safeText(4000, 1),
  approach: safeText(4000, 1),
  solution: safeText(4000, 1),
  verifiedOutcomes: z.array(safeText(300, 1)).max(12).default([]),
  processSteps: z
    .array(
      z.object({
        title: safeText(120, 1),
        description: safeText(500, 1),
      })
    )
    .max(12)
    .default([]),
});

export const projectUpsertSchema = z.object({
  title: safeText(180, 2),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(180)
    .toLowerCase()
    .regex(slugPattern, "Slug must contain lowercase letters, numbers, and hyphens only."),
  summary: safeText(400, 10),
  description: safeText(20000, 10),
  projectType: z.enum(["client", "concept", "internal"]).default("concept"),
  industry: optionalSafeText(100),
  clientName: optionalSafeText(140),
  clientIsPublic: z.boolean().default(false),
  projectDate: optionalSafeText(40),
  techStack: z.array(safeText(64, 1)).max(24).default([]),
  coverAssetId: z.string().uuid().optional().nullable(),
  galleryAssetIds: z.array(z.string().uuid()).max(20).default([]),
  serviceIds: z.array(z.string().uuid()).max(20).default([]),
  liveUrl: safeHttpOrRelativeUrlSchema,
  repositoryUrl: safeHttpOrRelativeUrlSchema,
  isFeatured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  seoTitle: optionalSafeText(160),
  seoDescription: optionalSafeText(320),
  ogTitle: optionalSafeText(160),
  ogDescription: optionalSafeText(320),
  ogImageAssetId: z.string().uuid().optional().nullable(),
  noIndex: z.boolean().default(false),
  caseStudy: caseStudyInputSchema.optional().nullable(),
});

export const serviceUpsertSchema = z.object({
  divisionId: z.string().uuid("Valid service division is required."),
  title: safeText(140, 2),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .toLowerCase()
    .regex(slugPattern, "Slug must contain lowercase letters, numbers, and hyphens only."),
  summary: safeText(320, 10),
  description: safeText(20000, 10),
  categoryLabel: optionalSafeText(80),
  deliverables: z.array(safeText(200, 1)).max(20).default([]),
  features: z.array(safeText(200, 1)).max(20).default([]),
  showPricing: z.boolean().default(false),
  startingPrice: optionalSafeText(80),
  iconName: optionalSafeText(64),
  coverAssetId: z.string().uuid().optional().nullable(),
  isFeatured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  seoTitle: optionalSafeText(160),
  seoDescription: optionalSafeText(320),
  ogTitle: optionalSafeText(160),
  ogDescription: optionalSafeText(320),
  ogImageAssetId: z.string().uuid().optional().nullable(),
  noIndex: z.boolean().default(false),
});

export const divisionCreateSchema = z.object({
  name: safeText(80, 2),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .toLowerCase()
    .regex(slugPattern, "Slug must contain lowercase letters, numbers, and hyphens only."),
  description: safeText(1000, 5),
  iconName: optionalSafeText(64),
  displayOrder: z.coerce.number().int().min(0).max(999).default(0),
  isActive: z.boolean().default(true),
});

export const ALLOWED_MEDIA_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
] as const;

export const MAX_MEDIA_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const mediaRegisterSchema = z.object({
  storageProvider: z.enum(["cloudinary", "local", "external"]).default("external"),
  providerAssetId: safeText(255, 1),
  providerPublicId: optionalSafeText(255),
  assetUrl: z
    .string()
    .trim()
    .min(1)
    .max(1000)
    .refine((val) => {
      if (val.startsWith("/")) return !val.startsWith("//");
      try {
        const parsed = new URL(val);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
      } catch {
        return false;
      }
    }, "Asset URL must start with https://, http://, or /"),
  secureUrl: z
    .string()
    .trim()
    .min(1)
    .max(1000)
    .refine((val) => {
      if (val.startsWith("/")) return !val.startsWith("//");
      try {
        const parsed = new URL(val);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
      } catch {
        return false;
      }
    }, "Secure URL must start with https://, http://, or /"),
  resourceType: z.enum(["image", "video", "document"]).default("image"),
  mimeType: z.string().trim().min(3).max(128),
  fileSizeBytes: z.coerce.number().int().positive().max(MAX_MEDIA_UPLOAD_BYTES),
  width: z.coerce.number().int().positive().optional().nullable(),
  height: z.coerce.number().int().positive().optional().nullable(),
  altText: safeText(300, 0).default(""),
  caption: optionalSafeText(500),
  folder: safeText(100, 1).default("Website"),
  tags: z.array(safeText(40, 1)).max(20).default([]),
});

export const mediaUpdateSchema = z.object({
  altText: safeText(300, 0),
  caption: optionalSafeText(500),
  folder: safeText(100, 1).optional(),
  tags: z.array(safeText(40, 1)).max(20).optional(),
});

export const mediaBulkActionSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
  action: z.enum(["move_folder", "add_tag", "delete"]),
  folder: safeText(100, 1).optional(),
  tag: safeText(40, 1).optional(),
});

export const siteSettingsBannerItemSchema = z.object({
  enabled: z.boolean().default(false),
  title: safeText(220, 0).default(""),
  ctaText: safeText(60, 0).default(""),
  ctaUrl: safeHttpOrRelativeUrlSchema,
  startAt: optionalSafeText(40),
  endAt: optionalSafeText(40),
});

export const siteSettingsSocialProfileSchema = z.object({
  platform: z.enum([
    "instagram",
    "linkedin",
    "youtube",
    "facebook",
    "x",
    "behance",
    "dribbble",
    "github",
  ]),
  label: safeText(40, 1),
  url: safeHttpOrRelativeUrlSchema,
  visible: z.boolean().default(true),
  order: z.coerce.number().int().min(0).max(50).default(0),
});

export const siteSettingsUpdateSchema = z.object({
  section: z
    .enum([
      "all",
      "general",
      "seo",
      "social",
      "banners",
      "integrations",
      "advanced",
    ])
    .optional(),
  siteName: safeText(120, 2),
  tagline: safeText(240, 2),
  businessEmail: z
    .string()
    .trim()
    .email("Enter a valid business email.")
    .max(180),
  phoneNumber: optionalSafeText(60),
  studioLocation: safeText(160, 2),
  officeHours: safeText(160, 2),
  primaryContactNote: optionalSafeText(240),
  availabilityEnabled: z.boolean().default(true),
  availabilityLabel: safeText(160, 2),
  footerNote: optionalSafeText(500),
  copyrightText: safeText(200, 2),
  defaultLanguage: safeText(24, 2).default("en-US"),
  defaultTimezone: safeText(64, 2).default("Asia/Kolkata"),
  logoUrl: safeHttpOrRelativeUrlSchema,
  faviconUrl: safeHttpOrRelativeUrlSchema,
  socialLinks: z
    .object({
      github: safeHttpOrRelativeUrlSchema,
      linkedin: safeHttpOrRelativeUrlSchema,
      instagram: safeHttpOrRelativeUrlSchema,
      facebook: safeHttpOrRelativeUrlSchema,
      behance: safeHttpOrRelativeUrlSchema,
      dribbble: safeHttpOrRelativeUrlSchema,
      x: safeHttpOrRelativeUrlSchema,
      youtube: safeHttpOrRelativeUrlSchema,
    })
    .optional(),
  socialProfiles: z.array(siteSettingsSocialProfileSchema).max(16).optional(),
  defaultSeoTitle: safeText(160, 2),
  defaultSeoDescription: safeText(320, 10),
  defaultOgImageUrl: safeHttpOrRelativeUrlSchema,
  defaultCanonicalBaseUrl: safeHttpOrRelativeUrlSchema,
  robotsAllowIndex: z.boolean().default(true),
  autoGenerateSitemap: z.boolean().default(true),
  useDefaultRobots: z.boolean().default(true),
  socialTwitterCard: z
    .enum(["summary", "summary_large_image"])
    .default("summary_large_image"),
  socialLocale: safeText(20, 2).default("en_US"),
  banners: z
    .object({
      announcement: siteSettingsBannerItemSchema,
      promotional: siteSettingsBannerItemSchema,
      defaultOgImageUrl: safeHttpOrRelativeUrlSchema,
      defaultPlaceholderUrl: safeHttpOrRelativeUrlSchema,
      fallbackLogoUrl: safeHttpOrRelativeUrlSchema,
      faviconUrl: safeHttpOrRelativeUrlSchema,
      defaultThumbnailUrl: safeHttpOrRelativeUrlSchema,
    })
    .optional(),
  integrations: z
    .object({
      gaMeasurementId: optionalSafeText(40),
      gtmContainerId: optionalSafeText(40),
      gscVerificationCode: optionalSafeText(160),
      captchaProvider: z
        .enum(["none", "turnstile", "recaptcha"])
        .default("none"),
      captchaSiteKey: optionalSafeText(180),
      emailFromName: optionalSafeText(120),
    })
    .optional(),
  advanced: z
    .object({
      cookieConsentEnabled: z.boolean().default(true),
      cookieBannerTitle: safeText(120, 2).default("Privacy & Cookies"),
      cookieBannerDescription: safeText(400, 5).default(
        "Ediyrex uses essential storage for site functionality and optional privacy-friendly analytics only if you agree."
      ),
      defaultConsentMode: z.enum(["essential", "analytics"]).default("essential"),
      maintenanceMode: z.boolean().default(false),
      maintenanceMessage: safeText(300, 0).default(
        "We are performing scheduled studio maintenance and will return shortly."
      ),
    })
    .optional(),
});

export const enquiryNoteSchema = z.object({
  note: safeText(2000, 2),
});

export const blogCategoryCreateSchema = z.object({
  name: safeText(80, 2),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .toLowerCase()
    .regex(
      slugPattern,
      "Slug must contain lowercase letters, numbers, and hyphens only."
    ),
  description: optionalSafeText(300),
});

export const blogPostUpsertSchema = z.object({
  title: safeText(200, 3),
  subtitle: optionalSafeText(280),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .toLowerCase()
    .regex(
      slugPattern,
      "Slug must contain lowercase letters, numbers, and hyphens only."
    ),
  contentType: z.enum(["post", "insight", "announcement"]).default("post"),
  excerpt: safeText(400, 10),
  bodyMarkdown: safeText(40000, 10),
  tags: z.array(safeText(40, 1)).max(20).default([]),
  authorUserId: z.string().uuid().optional().nullable(),
  authorBio: optionalSafeText(240),
  isFeatured: z.boolean().default(false),
  coverAssetId: z.string().uuid().optional().nullable(),
  categoryIds: z.array(z.string().uuid()).max(10).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  scheduledFor: z.string().datetime({ offset: true }).optional().nullable(),
  seoTitle: optionalSafeText(160),
  seoDescription: optionalSafeText(320),
  canonicalUrl: safeHttpOrRelativeUrlSchema,
});

export const studioTaskCreateSchema = z.object({
  title: safeText(200, 2),
  category: safeText(100, 2).default("CMS · General"),
  dueDateLabel: safeText(40, 1).default("This week"),
  pmsProjectId: z.string().uuid().optional().nullable(),
});

export const studioTaskUpdateSchema = z.object({
  title: safeText(200, 2).optional(),
  category: safeText(100, 2).optional(),
  dueDateLabel: safeText(40, 1).optional(),
  completed: z.boolean().optional(),
});

export const teamMemberUpdateSchema = z.object({
  status: z.enum(["invited", "active", "disabled"]).optional(),
  roleName: z.enum(["admin", "editor", "viewer"]).optional(),
});

export const cmsPageSlugPattern = /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/;

export const cmsPageUpsertSchema = z.object({
  title: safeText(160, 2),
  subtitle: safeText(280, 0).default(""),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(180)
    .toLowerCase()
    .regex(
      cmsPageSlugPattern,
      "Page slug must start with / and use lowercase letters, numbers, and hyphens (e.g. /, /about, /services/ai)."
    ),
  pageType: z.enum(["home", "static", "listing", "legal"]).default("static"),
  thumbnailAssetId: z.string().uuid().optional().nullable(),
  bodyMarkdown: safeText(40000, 0).default(""),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  seoTitle: optionalSafeText(160),
  seoDescription: optionalSafeText(320),
  canonicalUrl: optionalSafeText(300),
  noIndex: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export const seoEntryPatchSchema = z.object({
  kind: z.enum(["page", "portfolio", "service", "blog"]),
  id: z.string().uuid("Invalid entry identifier."),
  slug: z.string().trim().min(1).max(200).optional(),
  seoTitle: optionalSafeText(160),
  seoDescription: optionalSafeText(320),
  ogTitle: optionalSafeText(160),
  ogDescription: optionalSafeText(320),
  ogImageAssetId: z.string().uuid().optional().nullable(),
  canonicalUrl: optionalSafeText(300),
  robotsDirective: z
    .enum([
      "index, follow",
      "noindex, follow",
      "index, nofollow",
      "noindex, nofollow",
    ])
    .optional(),
  schemaType: safeText(60, 2).optional(),
  schemaJson: optionalSafeText(10000),
  noIndex: z.boolean().optional(),
});

export const seoBulkPatchSchema = z.object({
  items: z
    .array(
      z.object({
        kind: z.enum(["page", "portfolio", "service", "blog"]),
        id: z.string().uuid(),
      })
    )
    .min(1)
    .max(100),
  action: z.enum(["set_robots", "set_schema"]),
  robotsDirective: z
    .enum([
      "index, follow",
      "noindex, follow",
      "index, nofollow",
      "noindex, nofollow",
    ])
    .optional(),
  schemaType: safeText(60, 2).optional(),
});

export const seoRedirectUpsertSchema = z.object({
  source: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .refine(
      (val) => val.startsWith("/") && !val.startsWith("//"),
      "Source path must start with a single '/'."
    ),
  destination: z
    .string()
    .trim()
    .min(1, "Destination URL or path is required.")
    .max(500)
    .refine((val) => {
      if (val.startsWith("/")) return !val.startsWith("//");
      try {
        const parsed = new URL(val);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
      } catch {
        return false;
      }
    }, "Destination must start with https://, http://, or /"),
  statusCode: z.coerce
    .number()
    .int()
    .refine((n) => n === 301 || n === 302, "Status code must be 301 or 302."),
  isActive: z.boolean().default(true),
  note: optionalSafeText(240),
});

export const seoTechConfigSchema = z.object({
  robots: z
    .object({
      allowIndex: z.boolean(),
      disallowPaths: z.array(safeText(200, 1)).max(50),
      allowPaths: z.array(safeText(200, 1)).max(50),
      customRules: optionalSafeText(2000),
    })
    .optional(),
  schema: z
    .object({
      orgName: safeText(140, 2),
      orgUrl: safeHttpOrRelativeUrlSchema.refine(
        (val): val is string => typeof val === "string" && val.length > 0,
        "Organization URL is required."
      ),
      orgEmail: z.string().trim().email().max(180),
      orgDescription: safeText(400, 5),
      areaServed: safeText(120, 2),
      knowsAbout: z.array(safeText(120, 1)).max(25),
    })
    .optional(),
});

export const crmInquiryCreateSchema = z.object({
  contactName: safeText(120, 2),
  email: z.string().trim().email("Valid email address is required.").max(255),
  companyName: optionalSafeText(140),
  phone: optionalSafeText(40),
  projectType: safeText(140, 2),
  goalsAndRequirements: safeText(4000, 3).default("Created in CRM by studio team."),
  expectedTimeline: safeText(64, 2).default("Flexible"),
  source: safeText(64, 2).default("manual_entry"),
  status: z
    .enum([
      "new",
      "reviewing",
      "qualified",
      "proposal_sent",
      "won",
      "lost",
      "archived",
    ])
    .default("new"),
  wantsDiscoveryCall: z.boolean().default(false),
});

export const crmClientUpsertSchema = z.object({
  name: safeText(140, 2),
  email: z.string().trim().email("Valid email address is required.").max(255),
  companyName: optionalSafeText(140),
  phone: optionalSafeText(40),
  serviceInterest: safeText(160, 2).default("General Consultation"),
  source: safeText(64, 2).default("direct"),
  status: z.enum(["active", "archived"]).default("active"),
  notes: safeText(4000, 0).default(""),
});

export const crmConvertToClientSchema = z.object({
  name: safeText(140, 2).optional(),
  companyName: optionalSafeText(140),
  phone: optionalSafeText(40),
  serviceInterest: safeText(160, 2).optional(),
  notes: safeText(4000, 0).default(""),
  createPmsProject: z.boolean().default(false),
  pmsProjectTitle: safeText(200, 2).optional(),
});

export const crmFollowupCreateSchema = z
  .object({
    enquiryId: z.string().uuid().optional().nullable(),
    clientId: z.string().uuid().optional().nullable(),
    title: safeText(200, 2),
    notes: safeText(2000, 0).default(""),
    channel: z
      .enum(["email", "call", "meeting", "whatsapp", "other"])
      .default("email"),
    dueAt: z
      .string()
      .trim()
      .refine((v) => !Number.isNaN(Date.parse(v)), "Valid follow-up due date is required."),
  })
  .refine(
    (d) => Boolean(d.enquiryId || d.clientId),
    "Follow-up must be linked to a lead or a client."
  );

export const crmFollowupUpdateSchema = z.object({
  title: safeText(200, 2).optional(),
  notes: safeText(2000, 0).optional(),
  channel: z.enum(["email", "call", "meeting", "whatsapp", "other"]).optional(),
  dueAt: z
    .string()
    .trim()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Valid follow-up due date is required.")
    .optional(),
  completed: z.boolean().optional(),
});

export const pmsProjectCreateSchema = z.object({
  title: safeText(200, 2),
  clientId: z.string().uuid().optional().nullable(),
  sourceEnquiryId: z.string().uuid().optional().nullable(),
  serviceInterest: safeText(140, 2).default("Studio Delivery"),
  status: z
    .enum(["planning", "in_progress", "review", "completed", "on_hold"])
    .default("planning"),
  dueDateLabel: safeText(64, 1).default("This month"),
  summary: safeText(4000, 0).default(""),
});

export const pmsProjectUpdateSchema = z.object({
  title: safeText(200, 2).optional(),
  status: z
    .enum(["planning", "in_progress", "review", "completed", "on_hold"])
    .optional(),
  dueDateLabel: safeText(64, 1).optional(),
  summary: safeText(4000, 0).optional(),
});

export const teamInviteCreateSchema = z.object({
  fullName: safeText(120, 2),
  email: z.string().trim().email("Valid email address is required.").max(255),
  studioRole: safeText(64, 2).default("team_member"),
  department: safeText(80, 2).default("Creative"),
  jobTitle: optionalSafeText(120),
  phone: optionalSafeText(40),
  projectId: z.string().uuid().optional().nullable(),
  projectRole: z
    .enum([
      "super_admin",
      "studio_admin",
      "project_manager",
      "team_lead",
      "team_member",
      "viewer",
    ])
    .default("team_member"),
  expiryDays: z.coerce.number().int().min(1).max(90).default(7),
});

export const teamMemberProfileUpdateSchema = z.object({
  displayName: safeText(120, 2).optional(),
  studioRole: safeText(64, 2).optional(),
  roleName: z.enum(["admin", "editor", "viewer"]).optional(),
  department: safeText(80, 2).optional(),
  jobTitle: optionalSafeText(120),
  phone: optionalSafeText(40),
  status: z.enum(["invited", "active", "disabled"]).optional(),
  revokeAllSessions: z.boolean().optional(),
});

export const teamModulePermissionEntrySchema = z.object({
  view: z.boolean(),
  create: z.boolean(),
  edit: z.boolean(),
  delete: z.boolean(),
});

export const teamRolePermissionsPayloadSchema = z.object({
  modules: z.record(z.string(), teamModulePermissionEntrySchema),
  capabilities: z.object({
    publish: z.boolean(),
    approve: z.boolean(),
    inviteUsers: z.boolean(),
    manageBilling: z.boolean(),
    viewConfidential: z.boolean(),
  }),
});

export const teamRolePermissionsSaveSchema = z.object({
  key: safeText(64, 2),
  name: safeText(80, 2).optional(),
  description: optionalSafeText(300),
  baseRole: z.enum(["admin", "editor", "viewer"]).optional(),
  permissions: teamRolePermissionsPayloadSchema,
});

export const teamCustomRoleCreateSchema = z.object({
  key: z
    .string()
    .trim()
    .min(2)
    .max(48)
    .regex(/^[a-z0-9_]+$/, "Role key must use lowercase letters, numbers, and underscores."),
  name: safeText(80, 2),
  description: safeText(300, 3),
  baseRole: z.enum(["admin", "editor", "viewer"]).default("editor"),
  permissions: teamRolePermissionsPayloadSchema.optional(),
});

export const accessGroupActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("create_group"),
    name: safeText(80, 2),
    division: safeText(48, 2).default("Studio"),
    description: safeText(300, 0).default(""),
    defaultStudioRole: safeText(64, 2).default("team_member"),
  }),
  z.object({
    action: z.literal("update_group"),
    groupId: z.string().uuid(),
    name: safeText(80, 2),
    division: safeText(48, 2).default("Studio"),
    description: safeText(300, 0).default(""),
    defaultStudioRole: safeText(64, 2).default("team_member"),
  }),
  z.object({
    action: z.literal("add_member"),
    groupId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
  z.object({
    action: z.literal("remove_member"),
    groupId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
  z.object({
    action: z.literal("delete_group"),
    groupId: z.string().uuid(),
  }),
  z.object({
    action: z.literal("set_project_access"),
    groupId: z.string().uuid(),
    projectId: z.string().uuid(),
    projectRole: z.enum([
      "super_admin",
      "studio_admin",
      "project_manager",
      "team_lead",
      "team_member",
      "viewer",
      "no_access",
    ]),
    allowedBoards: z
      .array(z.enum(["backlog", "todo", "in_progress", "in_review", "done"]))
      .optional(),
    boardRoles: z
      .record(
        z.enum(["backlog", "todo", "in_progress", "in_review", "done"]),
        z.enum([
          "super_admin",
          "studio_admin",
          "project_manager",
          "team_lead",
          "team_member",
          "viewer",
          "no_access",
        ])
      )
      .optional(),
  }),
]);

export const teamBulkActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("set_status"),
    userIds: z.array(z.string().uuid()).min(1).max(100),
    status: z.enum(["active", "disabled"]),
  }),
  z.object({
    action: z.literal("set_role"),
    userIds: z.array(z.string().uuid()).min(1).max(100),
    studioRole: safeText(64, 2),
  }),
  z.object({
    action: z.literal("add_to_group"),
    userIds: z.array(z.string().uuid()).min(1).max(100),
    groupId: z.string().uuid(),
  }),
]);

export const teamInvitationActionSchema = z.object({
  action: z.enum(["resend", "activate"]),
});



