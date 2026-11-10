import { unstable_rethrow } from "next/navigation";
import type { NextRequest } from "next/server";
import { getPublishedProjectBySlug } from "@/lib/server/catalog";
import {
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { logger } from "@/lib/server/logger";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const project = await getPublishedProjectBySlug(slug);

    if (!project) {
      return apiNotFound("Requested project case study was not found.");
    }

    return apiOk(project);
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to load project by slug");
    return apiServerError("Unable to load project details.");
  }
}
