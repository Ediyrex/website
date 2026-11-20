import type { NextRequest } from "next/server";
import { z } from "zod";
import { apiBadRequest, apiOk } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";

const aiSuggestSchema = z.object({
  kind: z.enum(["page", "portfolio", "service", "blog", "industry"]),
  title: z.string().trim().min(1),
  currentDescription: z.string().optional().default(""),
  url: z.string().optional().default(""),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await request.json().catch(() => ({}));
    const parsed = aiSuggestSchema.safeParse(body);

    if (!parsed.success) {
      return apiBadRequest("Invalid request parameters", {
        issues: parsed.error.issues,
      });
    }

    const { kind, title, currentDescription } = parsed.data;

    let suggestedTitle = "";
    let suggestedDescription = "";
    let suggestedKeywords: string[] = [];
    let suggestedSchemaType = "WebPage";
    let reasoning = "";

    switch (kind) {
      case "portfolio":
        suggestedTitle = `${title} — Digital Engineering & Architecture | EDYREX`;
        suggestedDescription = currentDescription
          ? `Explore how EDYREX designed and deployed ${title}: ${currentDescription.substring(0, 90).trim()}... Discover verified business outcomes and technical stack.`
          : `Comprehensive case study on ${title} by EDYREX Studio. Architecture, UI/UX design, custom frontend development, and operational impact.`;
        suggestedKeywords = [
          title.toLowerCase(),
          "case study",
          "digital product",
          "nextjs enterprise",
          "fullstack development",
        ];
        suggestedSchemaType = "CreativeWork";
        reasoning =
          "Optimized for branded case study queries with clear division emphasis and social snippet readability.";
        break;

      case "service":
        suggestedTitle = `${title} Services & Solutions | EDYREX Studio`;
        suggestedDescription = currentDescription
          ? `${title} by EDYREX: ${currentDescription.substring(0, 95).trim()}... Deliverables, transparent retainers, and enterprise delivery SLA.`
          : `Expert ${title} capabilities by EDYREX Studio. Fast delivery SLAs, senior lead engineers, and end-to-end production.`;
        suggestedKeywords = [
          title.toLowerCase(),
          "studio services",
          "b2b agency",
          "digital solutions",
          "retainer",
        ];
        suggestedSchemaType = "Service";
        reasoning =
          "Focuses on commercial intent, service clarity, and key deliverables for prospective enterprise buyers.";
        break;

      case "industry":
        suggestedTitle = `${title} Digital Solutions & Architecture | EDYREX`;
        suggestedDescription = `Transform ${title} operations with bespoke software, branding, and automation by EDYREX Studio. Sector intelligence, case studies, and modern tech.`;
        suggestedKeywords = [
          title.toLowerCase(),
          "industry solutions",
          "digital transformation",
          "sector architecture",
        ];
        suggestedSchemaType = "WebPage";
        reasoning =
          "Targets vertical B2B searches seeking specialized sector engineering and proven domain solutions.";
        break;

      case "blog":
        suggestedTitle = `${title} | EDYREX Journal`;
        suggestedDescription = currentDescription
          ? `${currentDescription.substring(0, 140).trim()}... Read the full technical breakdown on the EDYREX Journal.`
          : `In-depth analysis and technical perspective on ${title}. Written by the engineering and creative leads at EDYREX Studio.`;
        suggestedKeywords = [
          title.toLowerCase(),
          "technical journal",
          "editorial analysis",
          "insights",
        ];
        suggestedSchemaType = "Article";
        reasoning =
          "Structured as an authoritative editorial piece with author attribution and informational search intent.";
        break;

      default:
        suggestedTitle = `${title} | EDYREX Studio`;
        suggestedDescription = currentDescription
          ? `${currentDescription.substring(0, 145).trim()}...`
          : `EDYREX Studio unites branding, media production, digital products, and practical AI systems for ambitious businesses worldwide.`;
        suggestedKeywords = [
          "edyrex studio",
          title.toLowerCase(),
          "creative technology",
        ];
        suggestedSchemaType = "WebPage";
        reasoning =
          "Concise, brand-first metadata ensuring clean desktop and mobile SERP presentation within 60 title and 160 description characters.";
        break;
    }

    // Ensure lengths
    if (suggestedTitle.length > 60) {
      suggestedTitle = suggestedTitle.substring(0, 57).trim() + "...";
    }
    if (suggestedDescription.length > 160) {
      suggestedDescription = suggestedDescription.substring(0, 157).trim() + "...";
    }

    return apiOk({
      suggestedTitle,
      suggestedDescription,
      suggestedKeywords,
      suggestedSchemaType,
      reasoning,
      characterCounts: {
        title: suggestedTitle.length,
        description: suggestedDescription.length,
      },
    });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/seo/ai-suggest");
  }
}
