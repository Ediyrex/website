import { unstable_rethrow } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import {
  getDb,
  pmsProjectMembers,
  pmsTaskAssignees,
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

    const [activeUsers, tasks, assignees, memberships] = await Promise.all([
      db
        .select({
          id: users.id,
          displayName: users.displayName,
          emailNormalized: users.emailNormalized,
        })
        .from(users)
        .where(eq(users.status, "active"))
        .orderBy(asc(users.displayName)),
      db
        .select({
          id: studioTasks.id,
          completed: studioTasks.completed,
          workflowStatus: studioTasks.workflowStatus,
          dueDate: studioTasks.dueDate,
          estimatedMinutes: studioTasks.estimatedMinutes,
          loggedMinutes: studioTasks.loggedMinutes,
          assigneeUserId: studioTasks.assigneeUserId,
        })
        .from(studioTasks),
      db
        .select({
          taskId: pmsTaskAssignees.taskId,
          userId: pmsTaskAssignees.userId,
        })
        .from(pmsTaskAssignees),
      db
        .select({
          userId: pmsProjectMembers.userId,
          capacityHoursPerWeek: pmsProjectMembers.capacityHoursPerWeek,
        })
        .from(pmsProjectMembers)
        .where(eq(pmsProjectMembers.membershipStatus, "active")),
    ]);

    const taskMap = new Map(tasks.map((t) => [t.id, t]));
    const tasksByUser = new Map<string, Set<string>>();

    for (const a of assignees) {
      const set = tasksByUser.get(a.userId) ?? new Set<string>();
      set.add(a.taskId);
      tasksByUser.set(a.userId, set);
    }
    for (const t of tasks) {
      if (t.assigneeUserId) {
        const set = tasksByUser.get(t.assigneeUserId) ?? new Set<string>();
        set.add(t.id);
        tasksByUser.set(t.assigneeUserId, set);
      }
    }

    const now = new Date();
    const members = activeUsers.map((u) => {
      const taskIds = Array.from(tasksByUser.get(u.id) ?? []);
      const userTasks = taskIds
        .map((id) => taskMap.get(id))
        .filter((t): t is NonNullable<typeof t> => Boolean(t));

      const completedTasks = userTasks.filter(
        (t) => t.completed || t.workflowStatus === "done"
      ).length;
      const activeTasks = userTasks.length - completedTasks;
      const overdueTasks = userTasks.filter(
        (t) =>
          !t.completed &&
          t.workflowStatus !== "done" &&
          t.dueDate &&
          new Date(t.dueDate).getTime() < now.getTime()
      ).length;
      const estimatedHours = Number(
        (
          userTasks
            .filter((t) => !t.completed && t.workflowStatus !== "done")
            .reduce((acc, t) => acc + (t.estimatedMinutes || 120), 0) / 60
        ).toFixed(1)
      );
      const loggedHours = Number(
        (
          userTasks.reduce((acc, t) => acc + (t.loggedMinutes || 0), 0) / 60
        ).toFixed(1)
      );
      const capacityHours =
        memberships.find((m) => m.userId === u.id)?.capacityHoursPerWeek ?? 40;
      const utilizationPercent = Math.min(
        100,
        Math.round((estimatedHours / Math.max(1, capacityHours)) * 100)
      );

      return {
        ...u,
        assignedTasks: userTasks.length,
        activeTasks,
        completedTasks,
        overdueTasks,
        estimatedHours,
        loggedHours,
        capacityHours,
        utilizationPercent,
      };
    });

    return apiOk({ members });
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to fetch PMS workload");
    return apiServerError("Unable to compute team workload.");
  }
}

