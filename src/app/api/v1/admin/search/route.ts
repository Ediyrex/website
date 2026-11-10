import { ilike, or } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  blogPosts,
  enquiries,
  getDb,
  projects,
  services,
  studioTasks,
} from "@/db";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    if (!q || q.length < 2) {
      return apiOk({
        projects: [],
        services: [],
        enquiries: [],
        blogPosts: [],
        tasks: [],
      });
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const pattern = `%${q}%`;

    const [projRows, svcRows, enqRows, blogRows, taskRows] = await Promise.all([
      db
        .select({
          id: projects.id,
          title: projects.title,
          slug: projects.slug,
          status: projects.status,
        })
        .from(projects)
        .where(or(ilike(projects.title, pattern), ilike(projects.slug, pattern)))
        .limit(5),
      db
        .select({
          id: services.id,
          title: services.title,
          slug: services.slug,
          status: services.status,
        })
        .from(services)
        .where(or(ilike(services.title, pattern), ilike(services.slug, pattern)))
        .limit(5),
      db
        .select({
          id: enquiries.id,
          referenceCode: enquiries.referenceCode,
          contactName: enquiries.contactName,
          emailNormalized: enquiries.emailNormalized,
          status: enquiries.status,
        })
        .from(enquiries)
        .where(
          or(
            ilike(enquiries.contactName, pattern),
            ilike(enquiries.emailNormalized, pattern),
            ilike(enquiries.referenceCode, pattern)
          )
        )
        .limit(5),
      db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          status: blogPosts.status,
        })
        .from(blogPosts)
        .where(
          or(ilike(blogPosts.title, pattern), ilike(blogPosts.slug, pattern))
        )
        .limit(5),
      db
        .select({
          id: studioTasks.id,
          title: studioTasks.title,
          category: studioTasks.category,
          completed: studioTasks.completed,
        })
        .from(studioTasks)
        .where(
          or(
            ilike(studioTasks.title, pattern),
            ilike(studioTasks.category, pattern)
          )
        )
        .limit(5),
    ]);

    return apiOk({
      projects: projRows,
      services: svcRows,
      enquiries: enqRows,
      blogPosts: blogRows,
      tasks: taskRows,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/search");
  }
}

