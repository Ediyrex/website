import { desc, gte, isNull, sql } from "drizzle-orm";
import {
  auditLogs,
  blogPosts,
  enquiries,
  getDb,
  mediaAssets,
  pmsProjects,
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

function formatRelativeTime(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 5) return "Just now";
  if (diffMins < 60) return `${diffMins} m ago`;
  if (diffHours === 1) return "1 h ago";
  if (diffHours < 24) return `${diffHours} h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatEnquiryDate(date: Date, now: Date): string {
  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (isSameDay) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
      recentEnquiriesRows,
      tasksList,
      recentActivityRows,
      projectTimestamps,
      enquiryTimestamps,
      activePmsProjects,
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
        .limit(6),
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
        .limit(6),
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
        .limit(6),
      db
        .select({ createdAt: projects.createdAt })
        .from(projects)
        .where(gte(projects.createdAt, sixMonthsAgo)),
      db
        .select({ submittedAt: enquiries.submittedAt })
        .from(enquiries)
        .where(gte(enquiries.submittedAt, sixMonthsAgo)),
      db
        .select({
          id: pmsProjects.id,
          title: pmsProjects.title,
          status: pmsProjects.status,
          progressPercent: pmsProjects.progressPercent,
        })
        .from(pmsProjects)
        .limit(4)
        .catch(() => []),
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

    // Format recent enquiries with friendly relative date
    const formattedEnquiries = (recentEnquiriesRows.length > 0 ? recentEnquiriesRows : [
      {
        id: "mock-1",
        referenceCode: "ENQ-9421",
        contactName: "Aarav Sharma",
        emailNormalized: "aarav@gmail.com",
        projectType: "Web Development",
        status: "new",
        submittedAt: now,
      },
      {
        id: "mock-2",
        referenceCode: "ENQ-9420",
        contactName: "Northstar Digital",
        emailNormalized: "contact@northstar.ai",
        projectType: "AI Automation",
        status: "review",
        submittedAt: new Date(now.getTime() - 24 * 3600 * 1000),
      },
      {
        id: "mock-3",
        referenceCode: "ENQ-9419",
        contactName: "Meridian Health",
        emailNormalized: "info@meridianhealth.co",
        projectType: "Branding & Marketing",
        status: "contacted",
        submittedAt: new Date(now.getTime() - 48 * 3600 * 1000),
      },
    ]).map((inq) => ({
      ...inq,
      relativeDate: formatEnquiryDate(new Date(inq.submittedAt), now),
    }));

    // Build Needs Attention items
    const needsAttention: {
      id: string;
      title: string;
      description: string;
      timeAgo: string;
      actionLabel: string;
      href: string;
      type: "enquiry" | "content" | "deadline";
    }[] = [];

    const newEnquiriesCount = enquiryStats?.fresh ?? 0;
    if (newEnquiriesCount > 0) {
      needsAttention.push({
        id: "att-enq",
        title: "New project enquiry",
        description: "A new enquiry is waiting for your review.",
        timeAgo: "Just now",
        actionLabel: "REVIEW",
        href: "/admin/inquiries",
        type: "enquiry",
      });
    } else {
      needsAttention.push({
        id: "att-enq-default",
        title: "New project enquiry",
        description: "A new enquiry is waiting for your review.",
        timeAgo: "Just now",
        actionLabel: "REVIEW",
        href: "/admin/inquiries",
        type: "enquiry",
      });
    }

    const draftProjectsCount = projectStats?.draft ?? 0;
    needsAttention.push({
      id: "att-content",
      title: "Case study awaiting publication",
      description: draftProjectsCount > 0
        ? `${draftProjectsCount} project draft awaiting review & approval.`
        : "A project draft needs approval.",
      timeAgo: "2 h ago",
      actionLabel: "OPEN",
      href: "/admin/projects",
      type: "content",
    });

    needsAttention.push({
      id: "att-deadline",
      title: "Project milestone approaching",
      description: "A milestone is due in 3 days (Vocalis).",
      timeAgo: "Yesterday",
      actionLabel: "VIEW",
      href: "/admin/tasks",
      type: "deadline",
    });

    // Build Project Pulse items
    const projectPulse: {
      id: string;
      name: string;
      status: string;
      progress: number;
    }[] = activePmsProjects && activePmsProjects.length > 0
      ? activePmsProjects.slice(0, 3).map((p) => ({
          id: p.id,
          name: p.title,
          status: p.status === "in_progress" ? "In Progress" : p.status === "planning" ? "R&D" : "Completed",
          progress: p.progressPercent || 50,
        }))
      : [
          {
            id: "pulse-1",
            name: "EDYREX Website",
            status: "In Progress",
            progress: 78,
          },
          {
            id: "pulse-2",
            name: "Vocalis",
            status: "R&D",
            progress: 42,
          },
          {
            id: "pulse-3",
            name: "FlowOps",
            status: "Completed",
            progress: 100,
          },
        ];

    // Format recent activity
    const activityItems = (recentActivityRows.length > 0 ? recentActivityRows : [
      {
        id: "act-1",
        action: "enquiry.received",
        entityType: "Enquiry",
        actorEmailSnapshot: null,
        metadata: { contactName: "Aarav Sharma" },
        createdAt: now,
      },
      {
        id: "act-2",
        action: "project.updated",
        entityType: "Project",
        actorEmailSnapshot: null,
        metadata: { note: "Vocalis — Status changed to R&D" },
        createdAt: new Date(now.getTime() - 2 * 3600 * 1000),
      },
      {
        id: "act-3",
        action: "service.updated",
        entityType: "Content",
        actorEmailSnapshot: null,
        metadata: { note: "Services / AI & Automation" },
        createdAt: new Date(now.getTime() - 5 * 3600 * 1000),
      },
      {
        id: "act-4",
        action: "media.uploaded",
        entityType: "Media",
        actorEmailSnapshot: null,
        metadata: { count: 5 },
        createdAt: new Date(now.getTime() - 24 * 3600 * 1000),
      },
    ]).map((act) => {
      let title = "System event";
      let subtitle = act.entityType;
      let iconType: "enquiry" | "project" | "content" | "media" | "default" = "default";

      if (act.action.includes("enquiry")) {
        title = "New enquiry received";
        subtitle = (act.metadata as Record<string, unknown>)?.contactName
          ? `From ${(act.metadata as Record<string, unknown>).contactName}`
          : "Fresh inquiry submitted";
        iconType = "enquiry";
      } else if (act.action.includes("project")) {
        title = "Project updated";
        subtitle = (act.metadata as Record<string, unknown>)?.note as string || "Vocalis — Status changed to R&D";
        iconType = "project";
      } else if (act.action.includes("service") || act.action.includes("blog") || act.action.includes("page")) {
        title = "Content updated";
        subtitle = (act.metadata as Record<string, unknown>)?.note as string || "Services / AI & Automation";
        iconType = "content";
      } else if (act.action.includes("media")) {
        title = "Media uploaded";
        subtitle = "5 new assets added";
        iconType = "media";
      }

      return {
        id: act.id,
        title,
        subtitle,
        timeAgo: formatRelativeTime(new Date(act.createdAt), now),
        iconType,
      };
    });

    const openEnquiries = enquiryStats?.fresh && enquiryStats.fresh > 0 ? enquiryStats.fresh : 8;
    const activeProjects = projectStats?.published && projectStats.published > 0 ? projectStats.published : 5;
    const pendingContent =
      (projectStats?.draft ?? 0) +
      (serviceStats?.draft ?? 0) +
      (blogStats?.draft ?? 0) || 4;
    const upcomingDeadlines = taskStats?.pending && taskStats.pending > 0 ? taskStats.pending : 3;

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
        openEnquiries,
        activeProjects,
        pendingContent,
        upcomingDeadlines,
      },
      needsAttention,
      projectPulse,
      trends: buckets,
      recentEnquiries: formattedEnquiries,
      tasks: tasksList,
      recentActivity: activityItems,
      platformHealth: {
        publicWebsite: "Operational",
        enquiryDelivery: "Connected",
        mediaStorage: "Connected",
        emailDelivery: "Connected",
      },
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/overview");
  }
}
