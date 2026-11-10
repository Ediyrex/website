import { unstable_rethrow } from "next/navigation";
import { getPublishedProjects } from "@/lib/server/catalog";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { logger } from "@/lib/server/logger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";

    const projects = await getPublishedProjects({ category, featuredOnly });

    return apiOk(projects, {
      total: projects.length,
      category: category || "all",
    });
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to load published projects");
    return apiServerError("Unable to load projects.");
  }
}
