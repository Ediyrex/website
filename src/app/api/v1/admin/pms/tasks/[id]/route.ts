import { asc, desc, eq, inArray, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  getDb,
  mediaAssets,
  pmsActivityLogs,
  pmsProjectFiles,
  pmsProjects,
  pmsTaskAssignees,
  pmsTaskComments,
  pmsTaskSubtasks,
  pmsTaskWorkLogs,
  studioTasks,
  users,
} from "@/db";
import { logPmsActivity, notifyPmsUsers } from "@/lib/pms/notifications";
import { getProjectPermissions } from "@/lib/pms/permissions";
import {
  apiBadRequest,
  apiForbidden,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { pmsTaskUpdateSchema } from "@/lib/validations/pms";

const uuidSchema = z.string().uuid("Invalid task identifier.");

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid task identifier.");
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const [task] = await db
      .select()
      .from(studioTasks)
      .where(eq(studioTasks.id, id))
      .limit(1);

    if (!task) return apiNotFound("Task not found.");

    if (task.pmsProjectId) {
      const perms = await getProjectPermissions(
        db,
        auth.session,
        task.pmsProjectId
      );
      if (!perms.canView) {
        return apiForbidden("You do not have access to this task.");
      }
    }

    const [
      assignees,
      subtasks,
      comments,
      workLogs,
      attachments,
      activityLogs,
      siblingTasks,
      projectRows,
    ] = await Promise.all([
      db
        .select({
          userId: pmsTaskAssignees.userId,
          displayName: users.displayName,
          emailNormalized: users.emailNormalized,
        })
        .from(pmsTaskAssignees)
        .innerJoin(users, eq(pmsTaskAssignees.userId, users.id))
        .where(eq(pmsTaskAssignees.taskId, id)),
      db
        .select()
        .from(pmsTaskSubtasks)
        .where(eq(pmsTaskSubtasks.taskId, id))
        .orderBy(asc(pmsTaskSubtasks.position), asc(pmsTaskSubtasks.createdAt)),
      db
        .select({
          id: pmsTaskComments.id,
          authorUserId: pmsTaskComments.authorUserId,
          authorName: users.displayName,
          body: pmsTaskComments.body,
          mentions: pmsTaskComments.mentions,
          attachmentAssetIds: pmsTaskComments.attachmentAssetIds,
          isReviewNote: pmsTaskComments.isReviewNote,
          createdAt: pmsTaskComments.createdAt,
        })
        .from(pmsTaskComments)
        .leftJoin(users, eq(pmsTaskComments.authorUserId, users.id))
        .where(eq(pmsTaskComments.taskId, id))
        .orderBy(asc(pmsTaskComments.createdAt)),
      db
        .select({
          id: pmsTaskWorkLogs.id,
          userId: pmsTaskWorkLogs.userId,
          userName: users.displayName,
          minutes: pmsTaskWorkLogs.minutes,
          note: pmsTaskWorkLogs.note,
          loggedAt: pmsTaskWorkLogs.loggedAt,
        })
        .from(pmsTaskWorkLogs)
        .leftJoin(users, eq(pmsTaskWorkLogs.userId, users.id))
        .where(eq(pmsTaskWorkLogs.taskId, id))
        .orderBy(desc(pmsTaskWorkLogs.loggedAt)),
      db
        .select({
          id: pmsProjectFiles.id,
          title: pmsProjectFiles.title,
          category: pmsProjectFiles.category,
          version: pmsProjectFiles.version,
          secureUrl: mediaAssets.secureUrl,
          resourceType: mediaAssets.resourceType,
          createdAt: pmsProjectFiles.createdAt,
        })
        .from(pmsProjectFiles)
        .innerJoin(mediaAssets, eq(pmsProjectFiles.mediaAssetId, mediaAssets.id))
        .where(eq(pmsProjectFiles.taskId, id))
        .orderBy(desc(pmsProjectFiles.createdAt)),
      db
        .select({
          id: pmsActivityLogs.id,
          action: pmsActivityLogs.action,
          summary: pmsActivityLogs.summary,
          actorName: users.displayName,
          createdAt: pmsActivityLogs.createdAt,
        })
        .from(pmsActivityLogs)
        .leftJoin(users, eq(pmsActivityLogs.actorUserId, users.id))
        .where(eq(pmsActivityLogs.taskId, id))
        .orderBy(desc(pmsActivityLogs.createdAt))
        .limit(40),
      task.pmsProjectId
        ? db
            .select({
              id: studioTasks.id,
              taskCode: studioTasks.taskCode,
              title: studioTasks.title,
              workflowStatus: studioTasks.workflowStatus,
            })
            .from(studioTasks)
            .where(eq(studioTasks.pmsProjectId, task.pmsProjectId))
        : Promise.resolve([]),
      task.pmsProjectId
        ? db
            .select({ id: pmsProjects.id, title: pmsProjects.title })
            .from(pmsProjects)
            .where(eq(pmsProjects.id, task.pmsProjectId))
            .limit(1)
        : Promise.resolve([]),
    ]);

    return apiOk({
      task: {
        ...task,
        taskCode: task.taskCode || `TSK-${task.id.slice(0, 4).toUpperCase()}`,
        projectTitle: projectRows[0]?.title || null,
      },
      assignees,
      subtasks,
      comments,
      workLogs,
      attachments,
      activityLogs,
      siblingTasks: siblingTasks.filter((s) => s.id !== id),
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/pms/tasks/[id]");
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid task identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = pmsTaskUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid task update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const [existing] = await db
      .select()
      .from(studioTasks)
      .where(eq(studioTasks.id, id))
      .limit(1);
    if (!existing) return apiNotFound("Task not found.");

    if (existing.pmsProjectId) {
      const perms = await getProjectPermissions(
        db,
        auth.session,
        existing.pmsProjectId
      );
      if (!perms.canEditTasks) {
        return apiForbidden("Viewers cannot modify tasks.");
      }
    }

    const data = parsed.data;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (data.title !== undefined) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.category !== undefined) updates.category = data.category;
    if (data.priority !== undefined) updates.priority = data.priority;
    if (data.labels !== undefined) updates.labels = data.labels;
    if (data.dueDateLabel !== undefined) updates.dueDateLabel = data.dueDateLabel;
    if (data.startDate !== undefined) {
      updates.startDate = data.startDate ? new Date(data.startDate) : null;
    }
    if (data.dueDate !== undefined) {
      const nextDue = data.dueDate ? new Date(data.dueDate) : null;
      updates.dueDate = nextDue;
      if (nextDue && data.dueDateLabel === undefined) {
        updates.dueDateLabel = nextDue.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    }
    if (data.estimatedMinutes !== undefined) {
      updates.estimatedMinutes = data.estimatedMinutes;
    }
    if (data.position !== undefined) updates.position = data.position;
    if (data.dependencyTaskIds !== undefined) {
      updates.dependencyTaskIds = data.dependencyTaskIds.filter((d) => d !== id);
    }
    if (data.recurrenceRule !== undefined) {
      updates.recurrenceRule = data.recurrenceRule;
    }

    if (data.workflowStatus !== undefined) {
      updates.workflowStatus = data.workflowStatus;
      updates.completed = data.workflowStatus === "done";
    } else if (data.completed !== undefined) {
      updates.completed = data.completed;
      updates.workflowStatus = data.completed ? "done" : "in_progress";
    }

    if (data.assigneeUserIds !== undefined) {
      updates.assigneeUserId = data.assigneeUserIds[0] || null;
    }

    const updated = await db.transaction(async (tx) => {
      const [row] = await tx
        .update(studioTasks)
        .set(updates)
        .where(eq(studioTasks.id, id))
        .returning();

      if (data.assigneeUserIds !== undefined) {
        const prevRows = await tx
          .select({ userId: pmsTaskAssignees.userId })
          .from(pmsTaskAssignees)
          .where(eq(pmsTaskAssignees.taskId, id));
        const prevSet = new Set(prevRows.map((r) => r.userId));

        await tx
          .delete(pmsTaskAssignees)
          .where(eq(pmsTaskAssignees.taskId, id));

        const uniqueNext = Array.from(new Set(data.assigneeUserIds));
        if (uniqueNext.length > 0) {
          await tx
            .insert(pmsTaskAssignees)
            .values(uniqueNext.map((userId) => ({ taskId: id, userId })));
        }

        const newlyAdded = uniqueNext.filter((uid) => !prevSet.has(uid));
        if (newlyAdded.length > 0) {
          await notifyPmsUsers(tx, {
            recipientUserIds: newlyAdded,
            actorUserId: auth.session.userId,
            projectId: existing.pmsProjectId,
            taskId: id,
            category: "task",
            title: `Assigned to task: ${row.title}`,
            body: `${auth.session.displayName} assigned you.`,
          });
        }
      }

      if (
        data.workflowStatus &&
        data.workflowStatus !== existing.workflowStatus
      ) {
        const assigneeRows = await tx
          .select({ userId: pmsTaskAssignees.userId })
          .from(pmsTaskAssignees)
          .where(eq(pmsTaskAssignees.taskId, id));

        await Promise.all([
          logPmsActivity(tx, {
            projectId: existing.pmsProjectId,
            taskId: id,
            actorUserId: auth.session.userId,
            action: "task.status_changed",
            summary: `Moved "${row.title}" from ${existing.workflowStatus.replace(
              "_",
              " "
            )} to ${data.workflowStatus.replace("_", " ")}`,
          }),
          notifyPmsUsers(tx, {
            recipientUserIds: assigneeRows.map((a) => a.userId),
            actorUserId: auth.session.userId,
            projectId: existing.pmsProjectId,
            taskId: id,
            category: "task",
            title: `Task moved to ${data.workflowStatus.replace("_", " ")}`,
            body: row.title,
          }),
        ]);

        // Auto-spawn next recurring occurrence when transitioning to done
        const activeRule = row.recurrenceRule;
        if (
          data.workflowStatus === "done" &&
          activeRule &&
          activeRule !== "none"
        ) {
          const baseDue = row.dueDate ? new Date(row.dueDate) : new Date();
          const nextDue = new Date(baseDue.getTime());
          if (activeRule === "daily") nextDue.setDate(nextDue.getDate() + 1);
          else if (activeRule === "weekly") nextDue.setDate(nextDue.getDate() + 7);
          else if (activeRule === "biweekly") nextDue.setDate(nextDue.getDate() + 14);
          else if (activeRule === "monthly") nextDue.setMonth(nextDue.getMonth() + 1);

          const [{ totalTasks }] = await tx
            .select({ totalTasks: sql<number>`count(*)::int` })
            .from(studioTasks);

          const [spawned] = await tx
            .insert(studioTasks)
            .values({
              pmsProjectId: row.pmsProjectId,
              taskCode: `TSK-${String(totalTasks + 101)}`,
              title: row.title,
              description: row.description,
              category: row.category,
              workflowStatus: "todo",
              priority: row.priority,
              labels: row.labels,
              dueDate: nextDue,
              dueDateLabel: nextDue.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              estimatedMinutes: row.estimatedMinutes,
              recurrenceRule: activeRule,
              recurrenceParentId: row.id,
              assigneeUserId: row.assigneeUserId,
              completed: false,
            })
            .returning();

          if (assigneeRows.length > 0) {
            await tx.insert(pmsTaskAssignees).values(
              assigneeRows.map((a) => ({
                taskId: spawned.id,
                userId: a.userId,
              }))
            );
          }

          await logPmsActivity(tx, {
            projectId: existing.pmsProjectId,
            taskId: spawned.id,
            actorUserId: auth.session.userId,
            action: "task.recurred",
            summary: `Spawned next ${activeRule} occurrence: ${spawned.taskCode}`,
          });
        }
      } else {
        await logPmsActivity(tx, {
          projectId: existing.pmsProjectId,
          taskId: id,
          actorUserId: auth.session.userId,
          action: "task.updated",
          summary: `Updated "${row.title}"`,
        });
      }

      return row;
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/pms/tasks/[id]");
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid task identifier.");
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const [existing] = await db
      .select()
      .from(studioTasks)
      .where(eq(studioTasks.id, id))
      .limit(1);
    if (!existing) return apiNotFound("Task not found.");

    if (existing.pmsProjectId) {
      const perms = await getProjectPermissions(
        db,
        auth.session,
        existing.pmsProjectId
      );
      if (!perms.canEditTasks) {
        return apiForbidden("Viewers cannot delete tasks.");
      }
    }

    // Remove this taskId from other tasks' dependency arrays cleanly
    const dependentTasks = existing.pmsProjectId
      ? await db
          .select({
            id: studioTasks.id,
            dependencyTaskIds: studioTasks.dependencyTaskIds,
          })
          .from(studioTasks)
          .where(eq(studioTasks.pmsProjectId, existing.pmsProjectId))
      : [];

    const toClean = dependentTasks.filter((t) =>
      t.dependencyTaskIds.includes(id)
    );
    if (toClean.length > 0) {
      await Promise.all(
        toClean.map((t) =>
          db
            .update(studioTasks)
            .set({
              dependencyTaskIds: t.dependencyTaskIds.filter((d) => d !== id),
            })
            .where(inArray(studioTasks.id, [t.id]))
        )
      );
    }

    await db.delete(studioTasks).where(eq(studioTasks.id, id));

    if (existing.pmsProjectId) {
      await logPmsActivity(db, {
        projectId: existing.pmsProjectId,
        actorUserId: auth.session.userId,
        action: "task.deleted",
        summary: `Deleted task "${existing.title}"`,
      });
    }

    return apiOk({ deleted: true });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/pms/tasks/[id]");
  }
}

