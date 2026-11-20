import { asc, desc, eq, inArray, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  getDb,
  pmsActivityLogs,
  pmsProjects,
  pmsTaskAssignees,
  pmsTaskComments,
  pmsTaskSubtasks,
  studioTasks,
  users,
} from "@/db";
import { logPmsActivity, notifyPmsUsers } from "@/lib/pms/notifications";
import {
  apiBadRequest,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";

const uuidSchema = z.string().uuid("Invalid task ID.");

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
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [task] = await db
      .select({
        id: studioTasks.id,
        taskCode: studioTasks.taskCode,
        title: studioTasks.title,
        description: studioTasks.description,
        pmsProjectId: studioTasks.pmsProjectId,
        projectTitle: pmsProjects.title,
        projectRef: pmsProjects.referenceCode,
        assigneeUserId: studioTasks.assigneeUserId,
        assigneeName: users.displayName,
        assigneeEmail: users.emailNormalized,
        assigneeAvatar: users.avatarUrl,
        workflowStatus: studioTasks.workflowStatus,
        priority: studioTasks.priority,
        labels: studioTasks.labels,
        dueDate: studioTasks.dueDate,
        dueDateLabel: studioTasks.dueDateLabel,
        completed: studioTasks.completed,
        reviewStatus: studioTasks.reviewStatus,
        createdAt: studioTasks.createdAt,
        updatedAt: studioTasks.updatedAt,
      })
      .from(studioTasks)
      .leftJoin(pmsProjects, eq(studioTasks.pmsProjectId, pmsProjects.id))
      .leftJoin(users, eq(studioTasks.assigneeUserId, users.id))
      .where(eq(studioTasks.id, id))
      .limit(1);

    if (!task) {
      return apiNotFound("Task not found.");
    }

    const [subtasks, comments, activity] = await Promise.all([
      db
        .select({
          id: pmsTaskSubtasks.id,
          title: pmsTaskSubtasks.title,
          completed: pmsTaskSubtasks.completed,
          position: pmsTaskSubtasks.position,
          createdAt: pmsTaskSubtasks.createdAt,
        })
        .from(pmsTaskSubtasks)
        .where(eq(pmsTaskSubtasks.taskId, id))
        .orderBy(asc(pmsTaskSubtasks.position), asc(pmsTaskSubtasks.createdAt)),
      db
        .select({
          id: pmsTaskComments.id,
          body: pmsTaskComments.body,
          authorUserId: pmsTaskComments.authorUserId,
          authorName: users.displayName,
          authorAvatar: users.avatarUrl,
          createdAt: pmsTaskComments.createdAt,
        })
        .from(pmsTaskComments)
        .leftJoin(users, eq(pmsTaskComments.authorUserId, users.id))
        .where(eq(pmsTaskComments.taskId, id))
        .orderBy(asc(pmsTaskComments.createdAt)),
      db
        .select({
          id: pmsActivityLogs.id,
          action: pmsActivityLogs.action,
          summary: pmsActivityLogs.summary,
          createdAt: pmsActivityLogs.createdAt,
        })
        .from(pmsActivityLogs)
        .where(eq(pmsActivityLogs.taskId, id))
        .orderBy(desc(pmsActivityLogs.createdAt))
        .limit(15),
    ]);

    let statusLabel: "todo" | "in_progress" | "in_review" | "blocked" | "completed" = "todo";
    if (task.completed || task.workflowStatus === "done") {
      statusLabel = "completed";
    } else if (task.labels?.includes("blocked") || task.reviewStatus === "changes_requested") {
      statusLabel = "blocked";
    } else if (task.workflowStatus === "in_review") {
      statusLabel = "in_review";
    } else if (task.workflowStatus === "in_progress") {
      statusLabel = "in_progress";
    } else {
      statusLabel = "todo";
    }

    let priorityLabel: "low" | "normal" | "high" | "urgent" = "normal";
    if (task.priority === "urgent") priorityLabel = "urgent";
    else if (task.priority === "high") priorityLabel = "high";
    else if (task.priority === "low") priorityLabel = "low";
    else priorityLabel = "normal";

    return apiOk({
      ...task,
      status: statusLabel,
      priority: priorityLabel,
      subtasks,
      comments,
      activity,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/tasks/[id]");
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

    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.description !== undefined) updates.description = String(body.description).trim();
    if (body.category !== undefined) updates.category = String(body.category).trim();
    if (body.dueDateLabel !== undefined) updates.dueDateLabel = String(body.dueDateLabel).trim();
    if (body.pmsProjectId !== undefined) {
      updates.pmsProjectId = body.pmsProjectId ? String(body.pmsProjectId) : null;
    }
    if (body.assigneeUserId !== undefined) {
      updates.assigneeUserId = body.assigneeUserId ? String(body.assigneeUserId) : null;
    }

    // Status mapping
    if (body.status !== undefined || body.workflowStatus !== undefined) {
      const s = body.status || body.workflowStatus;
      if (s === "completed" || s === "done") {
        updates.workflowStatus = "done";
        updates.completed = true;
      } else if (s === "blocked") {
        updates.workflowStatus = "backlog";
        updates.reviewStatus = "changes_requested";
        updates.completed = false;
      } else if (s === "in_review") {
        updates.workflowStatus = "in_review";
        updates.completed = false;
      } else if (s === "in_progress") {
        updates.workflowStatus = "in_progress";
        updates.completed = false;
      } else {
        updates.workflowStatus = "todo";
        updates.completed = false;
      }
    }

    if (body.completed !== undefined) {
      updates.completed = Boolean(body.completed);
      if (body.completed) {
        updates.workflowStatus = "done";
      }
    }

    // Priority mapping
    if (body.priority !== undefined) {
      const p = body.priority === "normal" ? "medium" : body.priority;
      updates.priority = p;
    }

    if (body.dueDate !== undefined) {
      updates.dueDate = body.dueDate ? new Date(body.dueDate) : null;
      if (body.dueDate) {
        updates.dueDateLabel = new Date(body.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    }

    const [updated] = await db
      .update(studioTasks)
      .set(updates)
      .where(eq(studioTasks.id, id))
      .returning();

    if (!updated) {
      return apiNotFound("Task not found.");
    }

    // Handle assignee relation
    if (body.assigneeUserId) {
      await db
        .insert(pmsTaskAssignees)
        .values({
          taskId: id,
          userId: body.assigneeUserId,
        })
        .onConflictDoNothing();
    }

    // Add activity log
    await logPmsActivity(db, {
      projectId: updated.pmsProjectId,
      taskId: updated.id,
      actorUserId: auth.session.userId,
      action: "task.updated",
      summary: `Updated task ${updated.taskCode || updated.title}`,
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "task.updated",
      entityType: "studio_task",
      entityId: id,
      metadata: { title: updated.title, completed: updated.completed },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/tasks/[id]");
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
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [deleted] = await db
      .delete(studioTasks)
      .where(eq(studioTasks.id, id))
      .returning({ id: studioTasks.id, title: studioTasks.title });

    if (!deleted) {
      return apiNotFound("Task not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "task.deleted",
      entityType: "studio_task",
      entityId: id,
      metadata: { title: deleted.title },
    });

    return apiOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/tasks/[id]");
  }
}
