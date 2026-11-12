import { describe, expect, it } from "vitest";
import {
  projectUpsertSchema,
  serviceUpsertSchema,
  siteSettingsUpdateSchema,
  mediaRegisterSchema,
} from "../cms";

describe("CMS Zod validations", () => {
  it("sanitizes HTML in project fields and enforces slug format", () => {
    const parsed = projectUpsertSchema.parse({
      title: "<b>Nexus AI</b>",
      slug: "nexus-ai-platform",
      summary: "Autonomous workflow platform <script>bad()</script> built for ops.",
      description: "Full architecture breakdown with multi-agent orchestration.",
      projectType: "concept",
      status: "draft",
    });

    expect(parsed.title).toBe("Nexus AI");
    expect(parsed.summary).toBe("Autonomous workflow platform bad() built for ops.");

    expect(
      projectUpsertSchema.safeParse({
        title: "Bad Slug",
        slug: "Invalid Slug!",
        summary: "Valid summary length here.",
        description: "Valid description length here.",
      }).success
    ).toBe(false);
  });

  it("rejects javascript: URLs in project liveUrl and media assetUrl", () => {
    const badProject = projectUpsertSchema.safeParse({
      title: "Test Project",
      slug: "test-project",
      summary: "Summary with at least ten characters.",
      description: "Description with at least ten characters.",
      liveUrl: "javascript:alert(1)",
    });
    expect(badProject.success).toBe(false);

    const badMedia = mediaRegisterSchema.safeParse({
      storageProvider: "external",
      providerAssetId: "id-1",
      assetUrl: "javascript:alert(1)",
      secureUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      resourceType: "image",
      mimeType: "image/jpeg",
      fileSizeBytes: 2048,
    });
    expect(badMedia.success).toBe(false);
  });

  it("validates service and site settings payloads cleanly", () => {
    const svc = serviceUpsertSchema.safeParse({
      divisionId: "550e8400-e29b-41d4-a716-446655440000",
      title: "Brand Films",
      slug: "brand-films",
      summary: "Commercial storytelling and cinema-grade brand documentaries.",
      description: "Full production pipeline from scripting to finishing.",
      deliverables: ["Concept & Script", "4K Color Grading"],
    });
    expect(svc.success).toBe(true);

    const settings = siteSettingsUpdateSchema.safeParse({
      siteName: "Ediyrex Studio",
      tagline: "Creative Technology, Media, Digital & AI",
      businessEmail: "ediyrex@gmail.com",
      studioLocation: "India & Global",
      officeHours: "Mon-Fri 10am-7pm",
      availabilityEnabled: true,
      availabilityLabel: "Open for Q4",
      copyrightText: "Ediyrex Studio",
      socialLinks: {
        linkedin: "https://linkedin.com/company/ediyrex",
      },
      defaultSeoTitle: "Ediyrex Studio",
      defaultSeoDescription: "Creative technology studio building media, digital, and AI.",
    });
    expect(settings.success).toBe(true);
  });
});

