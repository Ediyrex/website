import { desc, gte, isNull, sql } from "drizzle-orm";
import {
  auditLogs,
  blogPosts,
  enquiries,
  getDb,
  mediaAssets,
  projects,
  services,
  studioTasks,
} from "@/db";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function buildLastSixMonthBuckets(now: Date) {
  const buckets: { key: string; label: string; projects: number; inquiries: number }[] =
    [];
  for (let offset = 5; offset >= 0; offset--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    buckets.push({
      key,
      label: MONTH_NAMES[d.getUTCMonth()],
      projects: 0,
      inquiries: 0,
    });
  }
  return buckets;
}

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const now = new Date();
    const sixMonthsAgo = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1)
    );

    const [
      [projectStats],
      [serviceStats],
      [enquiryStats],
      [blogStats],
      [taskStats],
      [mediaStats],
      recentEnquiries,
      tasksList,
      recentActivity,
      projectTimestamps,
      enquiryTimestamps,
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
          published: sql<number>`count(*) filter (where ${blogPosts.status} = 'published')::int`,
          draft: sql<number>`count(*) filter (where ${blogPosts.status} = 'draft')::int`,
        })
        .from(blogPosts),
      db
        .select({
          total: sql<number>`count(*)::int`,
          pending: sql<number>`count(*) filter (where ${studioTasks.completed} = false)::int`,
          completed: sql<number>`count(*) filter (where ${studioTasks.completed} = true)::int`,
        })
        .from(studioTasks),
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
        .limit(4),
      db
        .select({
          id: studioTasks.id,
          title: studioTasks.title,
          category: studioTasks.category,
          dueDateLabel: studioTasks.dueDateLabel,
          completed: studioTasks.completed,
        })
        .from(studioTasks)
        .orderBy(studioTasks.completed, desc(studioTasks.createdAt))
        .limit(5),
      db
        .select({
          id: auditLogs.id,
          action: auditLogs.action,
          entityType: auditLogs.entityType,
          actorEmailSnapshot: auditLogs.actorEmailSnapshot,
          metadata: auditLogs.metadata,
          createdAt: auditLogs.createdAt,
        })
        .from(auditLogs)
        .orderBy(desc(auditLogs.createdAt))
        .limit(5),
      db
        .select({ createdAt: projects.createdAt })
        .from(projects)
        .where(gte(projects.createdAt, sixMonthsAgo)),
      db
        .select({ submittedAt: enquiries.submittedAt })
        .from(enquiries)
        .where(gte(enquiries.submittedAt, sixMonthsAgo)),
    ]);

    const buckets = buildLastSixMonthBuckets(now);
    const bucketMap = new Map(buckets.map((b) => [b.key, b]));

    for (const row of projectTimestamps) {
      const key = `${row.createdAt.getUTCFullYear()}-${String(row.createdAt.getUTCMonth() + 1).padStart(2, "0")}`;
      const bucket = bucketMap.get(key);
      if (bucket) bucket.projects += 1;
    }
    for (const row of enquiryTimestamps) {
      const key = `${row.submittedAt.getUTCFullYear()}-${String(row.submittedAt.getUTCMonth() + 1).padStart(2, "0")}`;
      const bucket = bucketMap.get(key);
      if (bucket) bucket.inquiries += 1;
    }

    return apiOk({
      stats: {
        totalProjects: projectStats?.total ?? 0,
        publishedProjects: projectStats?.published ?? 0,
        draftProjects: projectStats?.draft ?? 0,
        totalServices: serviceStats?.total ?? 0,
        publishedServices: serviceStats?.published ?? 0,
        draftServices: serviceStats?.draft ?? 0,
        totalBlogPosts: blogStats?.total ?? 0,
        publishedBlogPosts: blogStats?.published ?? 0,
        draftBlogPosts: blogStats?.draft ?? 0,
        totalTasks: taskStats?.total ?? 0,
        pendingTasks: taskStats?.pending ?? 0,
        completedTasks: taskStats?.completed ?? 0,
        totalEnquiries: enquiryStats?.total ?? 0,
        newEnquiries: enquiryStats?.fresh ?? 0,
        totalMediaAssets: mediaStats?.total ?? 0,
      },
      trends: buckets,
      recentEnquiries,
      tasks: tasksList,
      recentActivity,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/overview");
  }
}
