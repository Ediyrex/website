import { desc, isNull, sql } from "drizzle-orm";
import {
  enquiries,
  getDb,
  mediaAssets,
  projects,
  services,
} from "@/db";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [
      [projectStats],
      [serviceStats],
      [enquiryStats],
      [mediaStats],
      recentEnquiries,
      recentProjects,
      recentServices,
    ] = await Promise.all([
      db
        .select({
          total: sql<number>`count(*)::int`,
          published: sql<number>`count(*) filter (where ${projects.status} = 'published')::int`,
          draft: sql<number>`count(*) filter (where ${projects.status} = 'draft')::int`,
        })
        .from(projects),
      db
        .select({
          total: sql<number>`count(*)::int`,
          published: sql<number>`count(*) filter (where ${services.status} = 'published')::int`,
          draft: sql<number>`count(*) filter (where ${services.status} = 'draft')::int`,
        })
        .from(services),
      db
        .select({
          total: sql<number>`count(*)::int`,
          fresh: sql<number>`count(*) filter (where ${enquiries.status} = 'new')::int`,
        })
        .from(enquiries),
      db
        .select({
          total: sql<number>`count(*)::int`,
        })
        .from(mediaAssets)
        .where(isNull(mediaAssets.archivedAt)),
      db
        .select({
          id: enquiries.id,
          referenceCode: enquiries.referenceCode,
          contactName: enquiries.contactName,
          emailNormalized: enquiries.emailNormalized,
          projectType: enquiries.projectType,
          status: enquiries.status,
          submittedAt: enquiries.submittedAt,
        })
        .from(enquiries)
        .orderBy(desc(enquiries.submittedAt))
        .limit(5),
      db
        .select({
          id: projects.id,
          title: projects.title,
          slug: projects.slug,
          status: projects.status,
          updatedAt: projects.updatedAt,
        })
        .from(projects)
        .orderBy(desc(projects.updatedAt))
        .limit(4),
      db
        .select({
          id: services.id,
          title: services.title,
          slug: services.slug,
          status: services.status,
          updatedAt: services.updatedAt,
        })
        .from(services)
        .orderBy(desc(services.updatedAt))
        .limit(4),
    ]);

    const recentlyUpdated = [
      ...recentProjects.map((p) => ({ ...p, kind: "project" as const })),
      ...recentServices.map((s) => ({ ...s, kind: "service" as const })),
    ]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 6);

    return apiOk({
      stats: {
        totalProjects: projectStats?.total ?? 0,
        publishedProjects: projectStats?.published ?? 0,
        draftProjects: projectStats?.draft ?? 0,
        totalServices: serviceStats?.total ?? 0,
        publishedServices: serviceStats?.published ?? 0,
        draftServices: serviceStats?.draft ?? 0,
        totalEnquiries: enquiryStats?.total ?? 0,
        newEnquiries: enquiryStats?.fresh ?? 0,
        totalMediaAssets: mediaStats?.total ?? 0,
      },
      recentEnquiries,
      recentlyUpdated,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/overview");
  }
}
