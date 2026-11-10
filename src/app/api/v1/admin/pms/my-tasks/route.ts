import { unstable_rethrow } from "next/navigation";
import { asc, desc, eq, or } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb, pmsProjects, pmsTaskAssignees, studioTasks } from "@/db";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { logger } from "@/lib/server/logger";
import { requireAdminRole } from "@/lib/server/session";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab")?.trim() || "all";

    const rows = await db
      .select({
        id: studioTasks.id,
        pmsProjectId: studioTasks.pmsProjectId,
        projectTitle: pmsProjects.title,
        projectRef: pmsProjects.referenceCode,
        taskCode: studioTasks.taskCode,
        title: studioTasks.title,
        category: studioTasks.category,
        workflowStatus: studioTasks.workflowStatus,
        priority: studioTasks.priority,
        labels: studioTasks.labels,
        dueDate: studioTasks.dueDate,
        dueDateLabel: studioTasks.dueDateLabel,
        completed: studioTasks.completed,
        reviewStatus: studioTasks.reviewStatus,
        estimatedMinutes: studioTasks.estimatedMinutes,
        loggedMinutes: studioTasks.loggedMinutes,
        createdAt: studioTasks.createdAt,
      })
      .from(studioTasks)
      .leftJoin(pmsProjects, eq(studioTasks.pmsProjectId, pmsProjects.id))
      .leftJoin(pmsTaskAssignees, eq(studioTasks.id, pmsTaskAssignees.taskId))
      .where(
        or(
          eq(studioTasks.assigneeUserId, auth.session.userId),
          eq(pmsTaskAssignees.userId, auth.session.userId)
        )
      )
      .orderBy(asc(studioTasks.completed), asc(studioTasks.dueDate), desc(studioTasks.createdAt));

    // Deduplicate across left join
    const seen = new Set<string>();
    const uniqueTasks = rows.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const isDone = (t: (typeof uniqueTasks)[number]) =>
      t.completed || t.workflowStatus === "done";

    const isDueToday = (t: (typeof uniqueTasks)[number]) => {
      if (isDone(t)) return false;
      if (t.dueDate) {
        const d = new Date(t.dueDate).getTime();
        return d >= startOfToday.getTime() && d < endOfToday.getTime();
      }
      return t.dueDateLabel.toLowerCase() === "today";
    };

    const isOverdue = (t: (typeof uniqueTasks)[number]) => {
      if (isDone(t) || !t.dueDate) return false;
      return new Date(t.dueDate).getTime() < startOfToday.getTime();
    };

    const isUpcoming = (t: (typeof uniqueTasks)[number]) => {
      if (isDone(t)) return false;
      if (!t.dueDate) return !isDueToday(t);
      return new Date(t.dueDate).getTime() >= endOfToday.getTime();
    };

    const counts = {
      all: uniqueTasks.filter((t) => !isDone(t)).length,
      today: uniqueTasks.filter(isDueToday).length,
      upcoming: uniqueTasks.filter(isUpcoming).length,
      overdue: uniqueTasks.filter(isOverdue).length,
      completed: uniqueTasks.filter(isDone).length,
    };

    const filtered = uniqueTasks.filter((t) => {
      if (tab === "today") return isDueToday(t);
      if (tab === "upcoming") return isUpcoming(t);
      if (tab === "overdue") return isOverdue(t);
      if (tab === "completed") return isDone(t);
      return !isDone(t);
    });

    return apiOk({
      tasks: filtered.map((t) => ({
        ...t,
        taskCode: t.taskCode || `TSK-${t.id.slice(0, 4).toUpperCase()}`,
      })),
      counts,
    });
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to load My Tasks");
    return apiServerError("Unable to fetch personal tasks.");
  }
}

