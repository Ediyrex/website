import { desc, gte, lte, isNull, sql, and, eq, inArray, lt } from "drizzle-orm";
import {
  auditLogs,
  blogPosts,
  crmClients,
  crmFollowups,
  enquiries,
  getDb,
  mediaAssets,
  pmsProjects,
  projects,
  services,
  studioTasks,
  siteSettings,
} from "@/db";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";

function formatRelativeTime(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 5) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours === 1) return "1h ago";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
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
    const currentUserId = auth.session.userId;
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const [
      // 1. Open Enquiries metrics
      [enquiryMetrics],
      // 2. Active Projects metrics
      [pmsProjectMetrics],
      // 3. Pending Tasks metrics
      [taskMetrics],
      // 4. Content stats
      [contentDraftStats],
      // 5. Recent Enquiries list
      recentEnquiriesRows,
      // 6. Active PMS Projects for Project Pulse
      pulseProjectsRows,
      // 7. Clients map
      clientRows,
      // 8. Upcoming Tasks & Milestones
      upcomingTasksRows,
      // 9. Upcoming Follow-ups
      upcomingFollowupsRows,
      // 10. Overdue items for Needs Attention
      overdueTasksRows,
      overdueFollowupsRows,
      unansweredEnquiriesRows,
      // 11. Recent audit logs
      recentActivityRows,
      // 12. Integration settings
      integrationRows,
    ] = await Promise.all([
      db
        .select({
          total: sql<number>`count(*)::int`,
          unresolved: sql<number>`count(*) filter (where ${enquiries.status} in ('new', 'reviewing', 'qualified', 'proposal_sent'))::int`,
          awaitingFirstResponse: sql<number>`count(*) filter (where ${enquiries.status} = 'new')::int`,
          requiringAttention: sql<number>`count(*) filter (where ${enquiries.status} = 'new' and ${enquiries.submittedAt} <= ${fortyEightHoursAgo})::int`,
        })
        .from(enquiries),

      db
        .select({
          total: sql<number>`count(*)::int`,
          active: sql<number>`count(*) filter (where ${pmsProjects.status} in ('planning', 'in_progress', 'review'))::int`,
          inProgress: sql<number>`count(*) filter (where ${pmsProjects.status} = 'in_progress')::int`,
          approachingDeadline: sql<number>`count(*) filter (where ${pmsProjects.status} in ('planning', 'in_progress', 'review') and ${pmsProjects.dueDate} is not null and ${pmsProjects.dueDate} <= ${fourteenDaysFromNow} and ${pmsProjects.dueDate} >= ${now})::int`,
          completed: sql<number>`count(*) filter (where ${pmsProjects.status} = 'completed')::int`,
        })
        .from(pmsProjects)
        .catch(() => [
          { total: 0, active: 0, inProgress: 0, approachingDeadline: 0, completed: 0 },
        ]),

      db
        .select({
          total: sql<number>`count(*)::int`,
          incomplete: sql<number>`count(*) filter (where ${studioTasks.completed} = false)::int`,
          assignedToMe: sql<number>`count(*) filter (where ${studioTasks.completed} = false and ${studioTasks.assigneeUserId} = ${currentUserId})::int`,
          overdue: sql<number>`count(*) filter (where ${studioTasks.completed} = false and ${studioTasks.dueDate} is not null and ${studioTasks.dueDate} < ${now})::int`,
          completed: sql<number>`count(*) filter (where ${studioTasks.completed} = true)::int`,
        })
        .from(studioTasks)
        .catch(() => [
          { total: 0, incomplete: 0, assignedToMe: 0, overdue: 0, completed: 0 },
        ]),

      db
        .select({
          draftProjects: sql<number>`(select count(*) from ${projects} where ${projects.status} = 'draft')::int`,
          draftServices: sql<number>`(select count(*) from ${services} where ${services.status} = 'draft')::int`,
          draftBlogPosts: sql<number>`(select count(*) from ${blogPosts} where ${blogPosts.status} = 'draft')::int`,
        })
        .from(sql`(select 1) as dummy`),

      db
        .select({
          id: enquiries.id,
          referenceCode: enquiries.referenceCode,
          contactName: enquiries.contactName,
          companyName: enquiries.companyName,
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
          id: pmsProjects.id,
          title: pmsProjects.title,
          clientId: pmsProjects.clientId,
          status: pmsProjects.status,
          progressPercent: pmsProjects.progressPercent,
          dueDate: pmsProjects.dueDate,
          dueDateLabel: pmsProjects.dueDateLabel,
          serviceInterest: pmsProjects.serviceInterest,
        })
        .from(pmsProjects)
        .where(inArray(pmsProjects.status, ["planning", "in_progress", "review"]))
        .orderBy(desc(pmsProjects.updatedAt))
        .limit(5)
        .catch(() => []),

      db
        .select({ id: crmClients.id, name: crmClients.name, companyName: crmClients.companyName })
        .from(crmClients)
        .catch(() => []),

      db
        .select({
          id: studioTasks.id,
          title: studioTasks.title,
          category: studioTasks.category,
          dueDate: studioTasks.dueDate,
          dueDateLabel: studioTasks.dueDateLabel,
          priority: studioTasks.priority,
          completed: studioTasks.completed,
          pmsProjectId: studioTasks.pmsProjectId,
        })
        .from(studioTasks)
        .where(
          and(
            eq(studioTasks.completed, false),
            gte(studioTasks.dueDate, now),
            lte(studioTasks.dueDate, sevenDaysFromNow)
          )
        )
        .orderBy(studioTasks.dueDate)
        .limit(6)
        .catch(() => []),

      db
        .select({
          id: crmFollowups.id,
          title: crmFollowups.title,
          channel: crmFollowups.channel,
          dueAt: crmFollowups.dueAt,
          completed: crmFollowups.completed,
          clientId: crmFollowups.clientId,
        })
        .from(crmFollowups)
        .where(
          and(
            eq(crmFollowups.completed, false),
            gte(crmFollowups.dueAt, now),
            lte(crmFollowups.dueAt, sevenDaysFromNow)
          )
        )
        .orderBy(crmFollowups.dueAt)
        .limit(5)
        .catch(() => []),

      db
        .select({
          id: studioTasks.id,
          title: studioTasks.title,
          dueDate: studioTasks.dueDate,
          priority: studioTasks.priority,
        })
        .from(studioTasks)
        .where(and(eq(studioTasks.completed, false), lt(studioTasks.dueDate, now)))
        .orderBy(studioTasks.dueDate)
        .limit(5)
        .catch(() => []),

      db
        .select({
          id: crmFollowups.id,
          title: crmFollowups.title,
          dueAt: crmFollowups.dueAt,
          channel: crmFollowups.channel,
        })
        .from(crmFollowups)
        .where(and(eq(crmFollowups.completed, false), lt(crmFollowups.dueAt, now)))
        .orderBy(crmFollowups.dueAt)
        .limit(5)
        .catch(() => []),

      db
        .select({
          id: enquiries.id,
          contactName: enquiries.contactName,
          submittedAt: enquiries.submittedAt,
          projectType: enquiries.projectType,
        })
        .from(enquiries)
        .where(eq(enquiries.status, "new"))
        .orderBy(enquiries.submittedAt)
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
        .limit(8),

      db
        .select()
        .from(siteSettings)
        .where(inArray(siteSettings.settingKey, ["integrations", "seo_defaults", "contact_info"]))
        .catch(() => []),
    ]);

    const clientMap = new Map(clientRows.map((c) => [c.id, c.companyName || c.name]));

    // Format recent enquiries
    const formattedRecentEnquiries = recentEnquiriesRows.map((inq) => ({
      id: inq.id,
      referenceCode: inq.referenceCode,
      contactName: inq.contactName,
      companyName: inq.companyName || null,
      emailNormalized: inq.emailNormalized,
      projectType: inq.projectType,
      status: inq.status,
      submittedAt: inq.submittedAt.toISOString(),
      relativeDate: formatEnquiryDate(new Date(inq.submittedAt), now),
    }));

    // Format Project Pulse
    const formattedProjectPulse = pulseProjectsRows.map((p) => {
      const clientName = p.clientId ? clientMap.get(p.clientId) || "Direct Client" : "Studio Project";
      return {
        id: p.id,
        name: p.title,
        client: clientName,
        status:
          p.status === "in_progress"
            ? "In Progress"
            : p.status === "planning"
            ? "Planning & R&D"
            : p.status === "review"
            ? "In Review"
            : "Active",
        progress: p.progressPercent || 0,
        deadline: p.dueDate ? p.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : p.dueDateLabel || "TBD",
        serviceInterest: p.serviceInterest,
      };
    });

    // Format Upcoming Deadlines list (combines upcoming tasks, milestones, and followups)
    const upcomingDeadlinesList: {
      id: string;
      title: string;
      type: "task" | "project_milestone" | "client_deliverable" | "follow_up";
      dueAt: string;
      relativeDue: string;
      isOverdue: boolean;
      context: string;
      href: string;
    }[] = [];

    for (const t of upcomingTasksRows) {
      if (t.dueDate) {
        upcomingDeadlinesList.push({
          id: `task-${t.id}`,
          title: t.title,
          type: "task",
          dueAt: t.dueDate.toISOString(),
          relativeDue: formatRelativeTime(t.dueDate, now),
          isOverdue: false,
          context: t.category,
          href: "/admin/tasks",
        });
      }
    }

    for (const f of upcomingFollowupsRows) {
      upcomingDeadlinesList.push({
        id: `fu-${f.id}`,
        title: f.title,
        type: "follow_up",
        dueAt: f.dueAt.toISOString(),
        relativeDue: formatRelativeTime(f.dueAt, now),
        isOverdue: false,
        context: `Via ${f.channel}`,
        href: "/admin/inquiries?view=followups",
      });
    }

    // Sort upcoming deadlines chronologically
    upcomingDeadlinesList.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

    // Build Needs Attention items (operational issues requiring attention)
    const needsAttention: {
      id: string;
      title: string;
      module: "CRM / Leads" | "Tasks" | "Projects" | "Content" | "Follow-ups" | "Integrations";
      urgency: "critical" | "high" | "medium";
      status: string;
      timeAgo: string;
      actionLabel: string;
      href: string;
    }[] = [];

    // 1. Unanswered new enquiries
    for (const unans of unansweredEnquiriesRows.slice(0, 2)) {
      needsAttention.push({
        id: `att-enq-${unans.id}`,
        title: `New enquiry awaiting response from ${unans.contactName}`,
        module: "CRM / Leads",
        urgency: "critical",
        status: "Awaiting Reply",
        timeAgo: formatRelativeTime(new Date(unans.submittedAt), now),
        actionLabel: "Review",
        href: `/admin/inquiries?id=${unans.id}`,
      });
    }

    // 2. Overdue follow-ups
    for (const ofu of overdueFollowupsRows.slice(0, 2)) {
      needsAttention.push({
        id: `att-fu-${ofu.id}`,
        title: `Overdue client follow-up: "${ofu.title}"`,
        module: "Follow-ups",
        urgency: "high",
        status: "Overdue",
        timeAgo: formatRelativeTime(new Date(ofu.dueAt), now),
        actionLabel: "Complete",
        href: "/admin/inquiries?view=followups",
      });
    }

    // 3. Overdue studio tasks
    for (const ot of overdueTasksRows.slice(0, 2)) {
      needsAttention.push({
        id: `att-task-${ot.id}`,
        title: `Task past deadline: "${ot.title}"`,
        module: "Tasks",
        urgency: ot.priority === "urgent" || ot.priority === "high" ? "high" : "medium",
        status: "Overdue",
        timeAgo: ot.dueDate ? formatRelativeTime(new Date(ot.dueDate), now) : "Past due",
        actionLabel: "View Task",
        href: "/admin/tasks",
      });
    }

    // 4. Pending content publication drafts
    const totalDraftContent =
      (contentDraftStats?.draftProjects ?? 0) +
      (contentDraftStats?.draftServices ?? 0) +
      (contentDraftStats?.draftBlogPosts ?? 0);

    if (totalDraftContent > 0) {
      needsAttention.push({
        id: "att-content-drafts",
        title: `${totalDraftContent} content draft(s) awaiting publication review`,
        module: "Content",
        urgency: "medium",
        status: "Pending Review",
        timeAgo: "Live CMS",
        actionLabel: "Review Content",
        href: "/admin/pages",
      });
    }

    // Recent Activity feed
    const activityItems = recentActivityRows.map((act) => {
      let title = "System event";
      let subtitle = act.entityType;
      let iconType: "enquiry" | "project" | "content" | "media" | "task" | "default" = "default";

      if (act.action.includes("enquiry")) {
        title = "New enquiry received";
        subtitle = (act.metadata as Record<string, unknown>)?.contactName
          ? `From ${(act.metadata as Record<string, unknown>).contactName}`
          : "Fresh inquiry submitted";
        iconType = "enquiry";
      } else if (act.action.includes("project")) {
        title = "Project updated";
        subtitle = ((act.metadata as Record<string, unknown>)?.note as string) || "Project milestone updated";
        iconType = "project";
      } else if (act.action.includes("task")) {
        title = "Task status changed";
        subtitle = ((act.metadata as Record<string, unknown>)?.title as string) || "Studio task updated";
        iconType = "task";
      } else if (act.action.includes("service") || act.action.includes("blog") || act.action.includes("page")) {
        title = "Content updated";
        subtitle = ((act.metadata as Record<string, unknown>)?.note as string) || `${act.entityType} modified`;
        iconType = "content";
      } else if (act.action.includes("media")) {
        title = "Media asset added";
        subtitle = "Asset uploaded to studio library";
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

    // Verified Platform Health
    const isCloudinaryConfigured = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY
    );
    const isEmailConfigured = Boolean(
      process.env.RESEND_API_KEY || (process.env.SMTP_HOST && process.env.SMTP_USER)
    );
    const isGoogleCalendarConfigured = Boolean(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CALENDAR_ID
    );

    const platformHealth = {
      website: {
        status: "Operational",
        detail: "Edge routes responding",
        isHealthy: true,
      },
      database: {
        status: "Operational",
        detail: "PostgreSQL connected",
        isHealthy: true,
      },
      emailDelivery: {
        status: isEmailConfigured ? "Connected" : "Simulated Mode",
        detail: isEmailConfigured ? "Transactional provider active" : "Offline / Mock delivery",
        isHealthy: isEmailConfigured,
      },
      mediaStorage: {
        status: isCloudinaryConfigured ? "Connected" : "Unconfigured",
        detail: isCloudinaryConfigured ? "Cloudinary CDN ready" : "Asset upload credentials missing",
        isHealthy: isCloudinaryConfigured,
      },
      calendarSync: {
        status: isGoogleCalendarConfigured ? "Connected" : "Not Configured",
        detail: isGoogleCalendarConfigured ? "Google Workspace integration" : "Local calendar only",
        isHealthy: isGoogleCalendarConfigured,
      },
    };

    // Calculate deadines count in next 7 days
    const upcomingDeadlinesCount = upcomingDeadlinesList.length;

    return apiOk({
      kpis: {
        openEnquiries: {
          total: enquiryMetrics?.unresolved ?? 0,
          awaitingFirstResponse: enquiryMetrics?.awaitingFirstResponse ?? 0,
          requiringAttention: enquiryMetrics?.requiringAttention ?? 0,
        },
        activeProjects: {
          total: pmsProjectMetrics?.active ?? 0,
          inProgress: pmsProjectMetrics?.inProgress ?? 0,
          approachingDeadline: pmsProjectMetrics?.approachingDeadline ?? 0,
        },
        pendingTasks: {
          total: taskMetrics?.incomplete ?? 0,
          assignedToMe: taskMetrics?.assignedToMe ?? 0,
          overdue: taskMetrics?.overdue ?? 0,
        },
        upcomingDeadlines: {
          total: upcomingDeadlinesCount,
          nextSevenDays: upcomingDeadlinesCount,
          overdueCount: (taskMetrics?.overdue ?? 0) + overdueFollowupsRows.length,
        },
      },
      needsAttention,
      recentEnquiries: formattedRecentEnquiries,
      projectPulse: formattedProjectPulse,
      upcomingDeadlines: upcomingDeadlinesList.slice(0, 6),
      recentActivity: activityItems,
      platformHealth,
      quickActions: [
        { label: "Create Project", href: "/admin/projects?action=create", icon: "folder-plus" },
        { label: "Create Task", href: "/admin/tasks?action=create", icon: "check-square" },
        { label: "Add Client", href: "/admin/inquiries?view=clients&action=create", icon: "user-plus" },
        { label: "View Enquiries", href: "/admin/inquiries", icon: "inbox" },
        { label: "Publish Content", href: "/admin/pages", icon: "file-text" },
        { label: "Manage Services", href: "/admin/services", icon: "layers" },
        { label: "Manage Industries", href: "/admin/industries", icon: "layout-grid" },
      ],
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/overview");
  }
}
