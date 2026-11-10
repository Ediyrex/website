import type { NextRequest } from "next/server";
import { z } from "zod";
import { getPublishedProjectBySlug } from "@/lib/server/catalog";
import {
  apiBadRequest,
  apiNotFound,
  apiOk,
} from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9-]+$/i, "Invalid project slug.");

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const parsedSlug = slugSchema.safeParse(slug);
    if (!parsedSlug.success) {
      return apiBadRequest("Invalid project slug.");
    }

    const project = await getPublishedProjectBySlug(parsedSlug.data);

    if (!project) {
      return apiNotFound("Requested project case study was not found.");
    }

    return apiOk(project);
  } catch (err) {
    return handleApiError(err, "GET /api/v1/projects/[slug]");
  }
}
