import { and, asc, desc, eq, gte, ilike, inArray, isNotNull, isNull, lt, lte, or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  getDb,
  pmsActivityLogs,
  pmsProjects,
  pmsTaskAssignees,
  pmsTaskSubtasks,
  studioTasks,
  users,
} from "@/db";
import { logPmsActivity, notifyPmsUsers } from "@/lib/pms/notifications";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { pmsTaskCreateSchema } from "@/lib/validations/pms";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "all";
    const projectId = searchParams.get("projectId") || "all";
    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
    const assigneeId = searchParams.get("assigneeId") || "all";
    const q = searchParams.get("q")?.trim() || "";
    const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || "10") || 10));
    const offset = (page - 1) * limit;

    const now = new Date();

    // Compute Studio-wide KPIs
    const [
      allTasksCountResult,
      myTasksCountResult,
      inProgressCountResult,
      overdueCountResult,
      completedCountResult,
      projectsList,
      teamMembers,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(studioTasks),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(studioTasks)
        .leftJoin(pmsTaskAssignees, eq(studioTasks.id, pmsTaskAssignees.taskId))
        .where(
          and(
            eq(studioTasks.completed, false),
            or(
              eq(studioTasks.assigneeUserId, auth.session.userId),
              eq(pmsTaskAssignees.userId, auth.session.userId)
            )
          )
        ),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(studioTasks)
        .where(
          and(
            eq(studioTasks.workflowStatus, "in_progress"),
            eq(studioTasks.completed, false)
          )
        ),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(studioTasks)
        .where(
          and(
            eq(studioTasks.completed, false),
            isNotNull(studioTasks.dueDate),
            lt(studioTasks.dueDate, now)
          )
        ),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(studioTasks)
        .where(
          or(
            eq(studioTasks.completed, true),
            eq(studioTasks.workflowStatus, "done")
          )
        ),
      db
        .select({
          id: pmsProjects.id,
          title: pmsProjects.title,
          referenceCode: pmsProjects.referenceCode,
        })
        .from(pmsProjects)
        .orderBy(asc(pmsProjects.title)),
      db
        .select({
          id: users.id,
          name: users.displayName,
          email: users.emailNormalized,
          avatarUrl: users.avatarUrl,
        })
        .from(users)
        .where(eq(users.status, "active"))
        .orderBy(asc(users.displayName)),
    ]);

    // Build filter conditions
    const conditions = [];

    // Tab filter
    if (tab === "my-tasks") {
      conditions.push(
        and(
          eq(studioTasks.completed, false),
          or(
            eq(studioTasks.assigneeUserId, auth.session.userId),
            sql`EXISTS (SELECT 1 FROM pms_task_assignees WHERE pms_task_assignees.task_id = ${studioTasks.id} AND pms_task_assignees.user_id = ${auth.session.userId})`
          )
        )
      );
    } else if (tab === "project") {
      conditions.push(isNotNull(studioTasks.pmsProjectId));
    } else if (tab === "studio") {
      conditions.push(isNull(studioTasks.pmsProjectId));
    } else if (tab === "completed") {
      conditions.push(
        or(
          eq(studioTasks.completed, true),
          eq(studioTasks.workflowStatus, "done")
        )
      );
    }

    // Project filter
    if (projectId === "studio") {
      conditions.push(isNull(studioTasks.pmsProjectId));
    } else if (projectId !== "all") {
      conditions.push(eq(studioTasks.pmsProjectId, projectId));
    }

    // Status filter
    if (status === "todo") {
      conditions.push(
        and(
          or(eq(studioTasks.workflowStatus, "todo"), eq(studioTasks.workflowStatus, "backlog")),
          eq(studioTasks.completed, false)
        )
      );
    } else if (status === "in_progress") {
      conditions.push(
        and(eq(studioTasks.workflowStatus, "in_progress"), eq(studioTasks.completed, false))
      );
    } else if (status === "in_review") {
      conditions.push(
        and(eq(studioTasks.workflowStatus, "in_review"), eq(studioTasks.completed, false))
      );
    } else if (status === "blocked") {
      conditions.push(
        and(
          eq(studioTasks.completed, false),
          or(
            eq(studioTasks.reviewStatus, "changes_requested"),
            sql`${studioTasks.labels} ? 'blocked'`
          )
        )
      );
    } else if (status === "completed") {
      conditions.push(
        or(eq(studioTasks.completed, true), eq(studioTasks.workflowStatus, "done"))
      );
    }

    // Priority filter
    if (priority !== "all") {
      const priorityDb = priority === "normal" ? "medium" : priority;
      conditions.push(eq(studioTasks.priority, priorityDb));
    }

    // Assignee filter
    if (assigneeId === "me") {
      conditions.push(
        or(
          eq(studioTasks.assigneeUserId, auth.session.userId),
          sql`EXISTS (SELECT 1 FROM pms_task_assignees WHERE pms_task_assignees.task_id = ${studioTasks.id} AND pms_task_assignees.user_id = ${auth.session.userId})`
        )
      );
    } else if (assigneeId === "unassigned") {
      conditions.push(isNull(studioTasks.assigneeUserId));
    } else if (assigneeId !== "all") {
      conditions.push(
        or(
          eq(studioTasks.assigneeUserId, assigneeId),
          sql`EXISTS (SELECT 1 FROM pms_task_assignees WHERE pms_task_assignees.task_id = ${studioTasks.id} AND pms_task_assignees.user_id = ${assigneeId})`
        )
      );
    }

    // Search query
    if (q) {
      conditions.push(
        or(
          ilike(studioTasks.title, `%${q}%`),
          ilike(studioTasks.description, `%${q}%`),
          ilike(studioTasks.taskCode, `%${q}%`),
          ilike(pmsProjects.title, `%${q}%`),
          ilike(users.displayName, `%${q}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Total filtered count
    const [{ filteredCount }] = await db
      .select({ filteredCount: sql<number>`count(*)::int` })
      .from(studioTasks)
      .leftJoin(pmsProjects, eq(studioTasks.pmsProjectId, pmsProjects.id))
      .leftJoin(users, eq(studioTasks.assigneeUserId, users.id))
      .where(whereClause);

    // Fetch tasks
    const rows = await db
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
      .where(whereClause)
      .orderBy(
        asc(studioTasks.completed),
        asc(studioTasks.dueDate),
        desc(studioTasks.createdAt)
      )
      .limit(limit)
      .offset(offset);

    // Fetch subtask counts
    const taskIds = rows.map((r) => r.id);
    const subtaskMap: Record<string, { total: number; completed: number }> = {};
    if (taskIds.length > 0) {
      const subtaskCounts = await db
        .select({
          taskId: pmsTaskSubtasks.taskId,
          total: sql<number>`count(*)::int`,
          completed: sql<number>`count(*) filter (where ${pmsTaskSubtasks.completed} = true)::int`,
        })
        .from(pmsTaskSubtasks)
        .where(inArray(pmsTaskSubtasks.taskId, taskIds))
        .groupBy(pmsTaskSubtasks.taskId);

      for (const st of subtaskCounts) {
        subtaskMap[st.taskId] = { total: st.total, completed: st.completed };
      }
    }

    const tasks = rows.map((r) => {
      const isCompleted = r.completed || r.workflowStatus === "done";
      let statusLabel: "todo" | "in_progress" | "in_review" | "blocked" | "completed" = "todo";
      if (isCompleted) {
        statusLabel = "completed";
      } else if (r.labels?.includes("blocked") || r.reviewStatus === "changes_requested") {
        statusLabel = "blocked";
      } else if (r.workflowStatus === "in_review") {
        statusLabel = "in_review";
      } else if (r.workflowStatus === "in_progress") {
        statusLabel = "in_progress";
      } else {
        statusLabel = "todo";
      }

      let priorityLabel: "low" | "normal" | "high" | "urgent" = "normal";
      if (r.priority === "urgent") priorityLabel = "urgent";
      else if (r.priority === "high") priorityLabel = "high";
      else if (r.priority === "low") priorityLabel = "low";
      else priorityLabel = "normal";

      const isOverdue =
        !isCompleted && r.dueDate && new Date(r.dueDate).getTime() < now.getTime();

      const st = subtaskMap[r.id] || { total: 0, completed: 0 };

      return {
        id: r.id,
        taskCode: r.taskCode || "TSK-000",
        title: r.title,
        description: r.description || "",
        type: r.pmsProjectId ? ("project" as const) : ("studio" as const),
        pmsProjectId: r.pmsProjectId,
        projectTitle: r.projectTitle,
        projectRef: r.projectRef,
        assigneeUserId: r.assigneeUserId,
        assigneeName: r.assigneeName || "Unassigned",
        assigneeEmail: r.assigneeEmail,
        assigneeAvatar: r.assigneeAvatar,
        status: statusLabel,
        priority: priorityLabel,
        dueDate: r.dueDate ? r.dueDate.toISOString() : null,
        dueDateLabel: r.dueDateLabel || (r.dueDate ? new Date(r.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null),
        isOverdue: Boolean(isOverdue),
        completed: isCompleted,
        subtaskCount: st.total,
        completedSubtaskCount: st.completed,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      };
    });

    return apiOk({
      tasks,
      kpis: {
        total: allTasksCountResult[0]?.count ?? 0,
        myTasks: myTasksCountResult[0]?.count ?? 0,
        inProgress: inProgressCountResult[0]?.count ?? 0,
        overdue: overdueCountResult[0]?.count ?? 0,
        completed: completedCountResult[0]?.count ?? 0,
      },
      pagination: {
        total: filteredCount,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(filteredCount / limit)),
      },
      projects: projectsList,
      assignees: teamMembers,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/tasks");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = pmsTaskCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid task payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;
    const assignees = Array.from(
      new Set(
        data.assigneeUserIds && data.assigneeUserIds.length > 0
          ? data.assigneeUserIds
          : [auth.session.userId]
      )
    );

    const created = await db.transaction(async (tx) => {
      const [{ count }] = await tx
        .select({ count: sql<number>`count(*)::int` })
        .from(studioTasks);
      const taskCode = `TSK-${String(count + 101)}`;
      const parsedDue = data.dueDate ? new Date(data.dueDate) : null;
      const dueDateLabel = parsedDue
        ? parsedDue.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : data.dueDateLabel;

      const [task] = await tx
        .insert(studioTasks)
        .values({
          pmsProjectId: data.pmsProjectId || null,
          taskCode,
          title: data.title,
          description: data.description,
          category: data.category,
          workflowStatus: data.workflowStatus,
          priority: data.priority,
          labels: data.labels,
          dueDateLabel,
          startDate: data.startDate ? new Date(data.startDate) : null,
          dueDate: parsedDue,
          estimatedMinutes: data.estimatedMinutes,
          completed: data.workflowStatus === "done",
          assigneeUserId: assignees[0] || auth.session.userId,
          position: count,
        })
        .returning();

      if (assignees.length > 0) {
        await tx.insert(pmsTaskAssignees).values(
          assignees.map((userId) => ({
            taskId: task.id,
            userId,
          }))
        );
      }

      await logPmsActivity(tx, {
        projectId: data.pmsProjectId || null,
        taskId: task.id,
        actorUserId: auth.session.userId,
        action: "task.created",
        summary: `Created task ${taskCode}: ${task.title}`,
      });

      await notifyPmsUsers(tx, {
        recipientUserIds: assignees,
        actorUserId: auth.session.userId,
        projectId: data.pmsProjectId || null,
        taskId: task.id,
        category: "task",
        title: `New task assigned: ${task.title}`,
        body: `Priority: ${task.priority} · Due: ${task.dueDateLabel}`,
      });

      return task;
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "task.created",
      entityType: "studio_task",
      entityId: created.id,
      metadata: { title: created.title, pmsProjectId: created.pmsProjectId },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/tasks");
  }
}
