import { unstable_rethrow } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import {
  getDb,
  pmsMilestones,
  pmsProjects,
  pmsTaskWorkLogs,
  studioTasks,
  users,
} from "@/db";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { logger } from "@/lib/server/logger";
import { requireAdminRole } from "@/lib/server/session";

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const [projects, tasks, milestones, workLogs] = await Promise.all([
      db.select().from(pmsProjects).orderBy(desc(pmsProjects.updatedAt)),
      db.select().from(studioTasks),
      db.select().from(pmsMilestones),
      db
        .select({
          id: pmsTaskWorkLogs.id,
          taskId: pmsTaskWorkLogs.taskId,
          userId: pmsTaskWorkLogs.userId,
          userName: users.displayName,
          minutes: pmsTaskWorkLogs.minutes,
          note: pmsTaskWorkLogs.note,
          loggedAt: pmsTaskWorkLogs.loggedAt,
          taskTitle: studioTasks.title,
          projectTitle: pmsProjects.title,
        })
        .from(pmsTaskWorkLogs)
        .leftJoin(users, eq(pmsTaskWorkLogs.userId, users.id))
        .leftJoin(studioTasks, eq(pmsTaskWorkLogs.taskId, studioTasks.id))
        .leftJoin(pmsProjects, eq(studioTasks.pmsProjectId, pmsProjects.id))
        .orderBy(desc(pmsTaskWorkLogs.loggedAt))
        .limit(40),
    ]);

    const now = new Date();
    const activeProjects = projects.filter((p) => p.status !== "archived");

    const projectHealth = activeProjects.map((p) => {
      const projTasks = tasks.filter((t) => t.pmsProjectId === p.id);
      const projMilestones = milestones.filter((m) => m.projectId === p.id);
      const totalTasks = projTasks.length;
      const doneTasks = projTasks.filter(
        (t) => t.completed || t.workflowStatus === "done"
      ).length;
      const overdueTasks = projTasks.filter(
        (t) =>
          !t.completed &&
          t.workflowStatus !== "done" &&
          t.dueDate &&
          new Date(t.dueDate).getTime() < now.getTime()
      ).length;
      const delayedMilestones = projMilestones.filter(
        (m) => m.status === "delayed"
      ).length;
      const estimatedMinutes = projTasks.reduce(
        (acc, t) => acc + (t.estimatedMinutes || 0),
        0
      );
      const loggedMinutes = projTasks.reduce(
        (acc, t) => acc + (t.loggedMinutes || 0),
        0
      );

      let health: "on_track" | "at_risk" | "delayed" | "completed" = "on_track";
      if (p.status === "completed") health = "completed";
      else if (overdueTasks > 1 || delayedMilestones > 0) health = "delayed";
      else if (overdueTasks === 1 || p.status === "on_hold") health = "at_risk";

      return {
        id: p.id,
        referenceCode:
          p.referenceCode || `PRJ-${p.id.slice(0, 4).toUpperCase()}`,
        title: p.title,
        serviceInterest: p.serviceInterest,
        status: p.status,
        health,
        totalTasks,
        doneTasks,
        overdueTasks,
        estimatedHours: Number((estimatedMinutes / 60).toFixed(1)),
        loggedHours: Number((loggedMinutes / 60).toFixed(1)),
      };
    });

    const workflowBreakdown = {
      backlog: tasks.filter((t) => t.workflowStatus === "backlog").length,
      todo: tasks.filter((t) => t.workflowStatus === "todo").length,
      in_progress: tasks.filter((t) => t.workflowStatus === "in_progress").length,
      in_review: tasks.filter((t) => t.workflowStatus === "in_review").length,
      done: tasks.filter((t) => t.workflowStatus === "done" || t.completed).length,
    };

    const priorityBreakdown = {
      urgent: tasks.filter((t) => t.priority === "urgent").length,
      high: tasks.filter((t) => t.priority === "high").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      low: tasks.filter((t) => t.priority === "low").length,
    };

    const totalEstimatedHours = Number(
      (
        tasks.reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0) / 60
      ).toFixed(1)
    );
    const totalLoggedHours = Number(
      (tasks.reduce((acc, t) => acc + (t.loggedMinutes || 0), 0) / 60).toFixed(
        1
      )
    );
    const recurringCount = tasks.filter(
      (t) => t.recurrenceRule && t.recurrenceRule !== "none"
    ).length;

    return apiOk({
      summary: {
        totalProjects: activeProjects.length,
        totalTasks: tasks.length,
        completedTasks: workflowBreakdown.done,
        overdueTasks: tasks.filter(
          (t) =>
            !t.completed &&
            t.workflowStatus !== "done" &&
            t.dueDate &&
            new Date(t.dueDate).getTime() < now.getTime()
        ).length,
        totalEstimatedHours,
        totalLoggedHours,
        recurringCount,
      },
      projectHealth,
      workflowBreakdown,
      priorityBreakdown,
      recentWorkLogs: workLogs,
    });
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to compute PMS reports");
    return apiServerError("Unable to compute PMS reports.");
  }
}

