import { getPublishedProjects } from "@/lib/server/catalog";
import { apiBadRequest, apiOk } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { projectsQuerySchema } from "@/lib/validations/query";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = projectsQuerySchema.safeParse(
      Object.fromEntries(searchParams.entries())
    );

    if (!parsed.success) {
      return apiBadRequest(
        "Invalid projects query parameters.",
        parsed.error.flatten().fieldErrors
      );
    }

    const { category, featured, page, limit } = parsed.data;
    const featuredOnly = featured === "true";
    const projects = await getPublishedProjects({ category, featuredOnly });
    const total = projects.length;
    const offset = (page - 1) * limit;
    const items = projects.slice(offset, offset + limit);

    return apiOk(items, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      category: category || "all",
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/projects");
  }
}
