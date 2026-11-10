import { asc, desc, eq, inArray, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  crmClients,
  enquiries,
  getDb,
  mediaAssets,
  pmsActivityLogs,
  pmsDiscussions,
  pmsMilestones,
  pmsProjectFiles,
  pmsProjectMembers,
  pmsProjects,
  pmsStarredProjects,
  pmsTaskAssignees,
  pmsTaskComments,
  pmsTaskSubtasks,
  studioTasks,
  users,
} from "@/db";
import { logPmsActivity } from "@/lib/pms/notifications";
import { getProjectPermissions } from "@/lib/pms/permissions";
import {
  apiBadRequest,
  apiForbidden,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { pmsProjectPatchFullSchema } from "@/lib/validations/pms";

const uuidSchema = z.string().uuid("Invalid project identifier.");

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid project identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("PMS project not found.");
    if (!perms.canView) {
      return apiForbidden("You do not have access to this project.");
    }

    const [
      [project],
      starRows,
      members,
      tasks,
      milestones,
      files,
      discussions,
      activityLogs,
      studioUsers,
    ] = await Promise.all([
      db
        .select({
          id: pmsProjects.id,
          referenceCode: pmsProjects.referenceCode,
          title: pmsProjects.title,
          clientId: pmsProjects.clientId,
          clientName: crmClients.name,
          clientCompany: crmClients.companyName,
          clientEmail: crmClients.emailNormalized,
          clientPhone: crmClients.phone,
          clientService: crmClients.serviceInterest,
          sourceEnquiryId: pmsProjects.sourceEnquiryId,
          sourceReferenceCode: enquiries.referenceCode,
          serviceInterest: pmsProjects.serviceInterest,
          status: pmsProjects.status,
          dueDateLabel: pmsProjects.dueDateLabel,
          summary: pmsProjects.summary,
          description: pmsProjects.description,
          internalNotes: pmsProjects.internalNotes,
          coverAssetId: pmsProjects.coverAssetId,
          coverUrl: mediaAssets.secureUrl,
          progressPercent: pmsProjects.progressPercent,
          startDate: pmsProjects.startDate,
          dueDate: pmsProjects.dueDate,
          templateKey: pmsProjects.templateKey,
          workflowConfig: pmsProjects.workflowConfig,
          createdAt: pmsProjects.createdAt,
          updatedAt: pmsProjects.updatedAt,
        })
        .from(pmsProjects)
        .leftJoin(crmClients, eq(pmsProjects.clientId, crmClients.id))
        .leftJoin(enquiries, eq(pmsProjects.sourceEnquiryId, enquiries.id))
        .leftJoin(mediaAssets, eq(pmsProjects.coverAssetId, mediaAssets.id))
        .where(eq(pmsProjects.id, id))
        .limit(1),
      db
        .select({ projectId: pmsStarredProjects.projectId })
        .from(pmsStarredProjects)
        .where(eq(pmsStarredProjects.projectId, id)),
      db
        .select({
          id: pmsProjectMembers.id,
          userId: pmsProjectMembers.userId,
          projectRole: pmsProjectMembers.projectRole,
          capacityHoursPerWeek: pmsProjectMembers.capacityHoursPerWeek,
          membershipStatus: pmsProjectMembers.membershipStatus,
          addedAt: pmsProjectMembers.addedAt,
          displayName: users.displayName,
          emailNormalized: users.emailNormalized,
        })
        .from(pmsProjectMembers)
        .innerJoin(users, eq(pmsProjectMembers.userId, users.id))
        .where(eq(pmsProjectMembers.projectId, id))
        .orderBy(asc(users.displayName)),
      db
        .select()
        .from(studioTasks)
        .where(eq(studioTasks.pmsProjectId, id))
        .orderBy(asc(studioTasks.position), desc(studioTasks.createdAt)),
      db
        .select()
        .from(pmsMilestones)
        .where(eq(pmsMilestones.projectId, id))
        .orderBy(asc(pmsMilestones.position), asc(pmsMilestones.dueDate)),
      db
        .select({
          id: pmsProjectFiles.id,
          projectId: pmsProjectFiles.projectId,
          taskId: pmsProjectFiles.taskId,
          mediaAssetId: pmsProjectFiles.mediaAssetId,
          title: pmsProjectFiles.title,
          category: pmsProjectFiles.category,
          versionGroupId: pmsProjectFiles.versionGroupId,
          version: pmsProjectFiles.version,
          versionNote: pmsProjectFiles.versionNote,
          uploadedByUserId: pmsProjectFiles.uploadedByUserId,
          uploaderName: users.displayName,
          secureUrl: mediaAssets.secureUrl,
          resourceType: mediaAssets.resourceType,
          mimeType: mediaAssets.mimeType,
          fileSizeBytes: mediaAssets.fileSizeBytes,
          createdAt: pmsProjectFiles.createdAt,
        })
        .from(pmsProjectFiles)
        .innerJoin(mediaAssets, eq(pmsProjectFiles.mediaAssetId, mediaAssets.id))
        .leftJoin(users, eq(pmsProjectFiles.uploadedByUserId, users.id))
        .where(eq(pmsProjectFiles.projectId, id))
        .orderBy(desc(pmsProjectFiles.createdAt)),
      db
        .select({
          id: pmsDiscussions.id,
          projectId: pmsDiscussions.projectId,
          parentId: pmsDiscussions.parentId,
          authorUserId: pmsDiscussions.authorUserId,
          authorName: users.displayName,
          body: pmsDiscussions.body,
          mentions: pmsDiscussions.mentions,
          attachmentAssetIds: pmsDiscussions.attachmentAssetIds,
          createdAt: pmsDiscussions.createdAt,
        })
        .from(pmsDiscussions)
        .leftJoin(users, eq(pmsDiscussions.authorUserId, users.id))
        .where(eq(pmsDiscussions.projectId, id))
        .orderBy(asc(pmsDiscussions.createdAt)),
      db
        .select({
          id: pmsActivityLogs.id,
          action: pmsActivityLogs.action,
          summary: pmsActivityLogs.summary,
          taskId: pmsActivityLogs.taskId,
          actorName: users.displayName,
          createdAt: pmsActivityLogs.createdAt,
        })
        .from(pmsActivityLogs)
        .leftJoin(users, eq(pmsActivityLogs.actorUserId, users.id))
        .where(eq(pmsActivityLogs.projectId, id))
        .orderBy(desc(pmsActivityLogs.createdAt))
        .limit(80),
      db
        .select({
          id: users.id,
          displayName: users.displayName,
          emailNormalized: users.emailNormalized,
        })
        .from(users)
        .where(eq(users.status, "active"))
        .orderBy(asc(users.displayName)),
    ]);

    const taskIds = tasks.map((t) => t.id);
    const [taskAssignees, taskSubtasks, taskCommentCounts, taskFileCounts] =
      taskIds.length > 0
        ? await Promise.all([
            db
              .select({
                taskId: pmsTaskAssignees.taskId,
                userId: pmsTaskAssignees.userId,
                displayName: users.displayName,
                emailNormalized: users.emailNormalized,
              })
              .from(pmsTaskAssignees)
              .innerJoin(users, eq(pmsTaskAssignees.userId, users.id))
              .where(inArray(pmsTaskAssignees.taskId, taskIds)),
            db
              .select()
              .from(pmsTaskSubtasks)
              .where(inArray(pmsTaskSubtasks.taskId, taskIds))
              .orderBy(asc(pmsTaskSubtasks.position)),
            db
              .select({
                taskId: pmsTaskComments.taskId,
                count: sql<number>`count(*)::int`,
              })
              .from(pmsTaskComments)
              .where(inArray(pmsTaskComments.taskId, taskIds))
              .groupBy(pmsTaskComments.taskId),
            db
              .select({
                taskId: pmsProjectFiles.taskId,
                count: sql<number>`count(*)::int`,
              })
              .from(pmsProjectFiles)
              .where(inArray(pmsProjectFiles.taskId, taskIds))
              .groupBy(pmsProjectFiles.taskId),
          ])
        : [[], [], [], []];

    const assigneesByTask = new Map<
      string,
      Array<{ userId: string; displayName: string; emailNormalized: string }>
    >();
    for (const a of taskAssignees) {
      const list = assigneesByTask.get(a.taskId) ?? [];
      list.push({
        userId: a.userId,
        displayName: a.displayName,
        emailNormalized: a.emailNormalized,
      });
      assigneesByTask.set(a.taskId, list);
    }

    const subtasksByTask = new Map<string, typeof taskSubtasks>();
    for (const st of taskSubtasks) {
      const list = subtasksByTask.get(st.taskId) ?? [];
      list.push(st);
      subtasksByTask.set(st.taskId, list);
    }

    const commentCountMap = new Map(
      taskCommentCounts.map((c) => [c.taskId, c.count])
    );
    const fileCountMap = new Map(
      taskFileCounts
        .filter((f) => Boolean(f.taskId))
        .map((f) => [f.taskId!, f.count])
    );

    const userMap = new Map(studioUsers.map((u) => [u.id, u]));

    const enrichedTasks = tasks.map((t) => {
      let assignees = assigneesByTask.get(t.id) ?? [];
      if (assignees.length === 0 && t.assigneeUserId) {
        const u = userMap.get(t.assigneeUserId);
        if (u) {
          assignees = [
            {
              userId: u.id,
              displayName: u.displayName,
              emailNormalized: u.emailNormalized,
            },
          ];
        }
      }
      const subs = subtasksByTask.get(t.id) ?? [];
      const subtasksCompleted = subs.filter((s) => s.completed).length;

      return {
        ...t,
        taskCode: t.taskCode || `TSK-${t.id.slice(0, 4).toUpperCase()}`,
        assignees,
        subtasks: subs,
        subtasksTotal: subs.length,
        subtasksCompleted,
        commentsCount: commentCountMap.get(t.id) ?? 0,
        attachmentsCount: fileCountMap.get(t.id) ?? 0,
      };
    });

    // Compute per-member workload
    const now = new Date();
    const enrichedMembers = members.map((m) => {
      const assigned = enrichedTasks.filter((t) =>
        t.assignees.some((a) => a.userId === m.userId)
      );
      const completed = assigned.filter(
        (t) => t.completed || t.workflowStatus === "done"
      ).length;
      const overdue = assigned.filter(
        (t) =>
          !t.completed &&
          t.workflowStatus !== "done" &&
          t.dueDate &&
          new Date(t.dueDate).getTime() < now.getTime()
      ).length;
      const estimatedMinutes = assigned.reduce(
        (acc, t) => acc + (t.estimatedMinutes || 0),
        0
      );
      const loggedMinutes = assigned.reduce(
        (acc, t) => acc + (t.loggedMinutes || 0),
        0
      );
      return {
        ...m,
        assignedTasks: assigned.length,
        completedTasks: completed,
        overdueTasks: overdue,
        estimatedMinutes,
        loggedMinutes,
      };
    });

    const totalTasks = enrichedTasks.length;
    const completedTasks = enrichedTasks.filter(
      (t) => t.completed || t.workflowStatus === "done"
    ).length;
    const computedProgress =
      totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : project.progressPercent;

    return apiOk({
      project: {
        ...project,
        referenceCode:
          project.referenceCode || `PRJ-${project.id.slice(0, 4).toUpperCase()}`,
        isStarred: starRows.length > 0,
        progress: computedProgress,
        totalTasks,
        completedTasks,
      },
      permissions: perms,
      tasks: enrichedTasks,
      milestones,
      members: enrichedMembers,
      files,
      discussions,
      activityLogs,
      studioUsers,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/pms/projects/[id]");
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
      return apiBadRequest("Invalid project identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = pmsProjectPatchFullSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid project update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("PMS project not found.");
    if (!perms.canManageProject) {
      return apiForbidden("Only project managers or admins can modify project settings.");
    }

    const data = parsed.data;

    if (data.action === "duplicate") {
      const [source] = await db
        .select()
        .from(pmsProjects)
        .where(eq(pmsProjects.id, id))
        .limit(1);
      if (!source) return apiNotFound("PMS project not found.");

      const duplicated = await db.transaction(async (tx) => {
        const [{ existingCount }] = await tx
          .select({ existingCount: sql<number>`count(*)::int` })
          .from(pmsProjects);
        const refNum = String(existingCount + 1).padStart(3, "0");

        const [copy] = await tx
          .insert(pmsProjects)
          .values({
            referenceCode: `PRJ-${refNum}`,
            title: `${source.title} (Copy)`.slice(0, 200),
            clientId: source.clientId,
            serviceInterest: source.serviceInterest,
            status: "planning",
            dueDateLabel: source.dueDateLabel,
            summary: source.summary,
            description: source.description,
            coverAssetId: source.coverAssetId,
            leadUserId: auth.session.userId,
          })
          .returning();

        await tx.insert(pmsProjectMembers).values({
          projectId: copy.id,
          userId: auth.session.userId,
          projectRole: "project_manager",
        });

        const srcMilestones = await tx
          .select()
          .from(pmsMilestones)
          .where(eq(pmsMilestones.projectId, id));
        if (srcMilestones.length > 0) {
          await tx.insert(pmsMilestones).values(
            srcMilestones.map((m) => ({
              projectId: copy.id,
              title: m.title,
              description: m.description,
              dueDate: m.dueDate,
              status: "pending",
              position: m.position,
            }))
          );
        }

        const srcTasks = await tx
          .select()
          .from(studioTasks)
          .where(eq(studioTasks.pmsProjectId, id));
        for (let i = 0; i < srcTasks.length; i += 1) {
          const t = srcTasks[i];
          await tx.insert(studioTasks).values({
            pmsProjectId: copy.id,
            taskCode: `TSK-${refNum}-${i + 1}`,
            title: t.title,
            description: t.description,
            category: t.category,
            workflowStatus: "todo",
            priority: t.priority,
            labels: t.labels,
            dueDateLabel: t.dueDateLabel,
            estimatedMinutes: t.estimatedMinutes,
            position: t.position,
            completed: false,
            assigneeUserId: auth.session.userId,
          });
        }

        await logPmsActivity(tx, {
          projectId: copy.id,
          actorUserId: auth.session.userId,
          action: "project.duplicated",
          summary: `Duplicated from ${source.title}`,
        });

        return copy;
      });

      return apiOk(duplicated, undefined, 201);
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (data.title !== undefined) updates.title = data.title;
    if (data.clientId !== undefined) updates.clientId = data.clientId || null;
    if (data.serviceInterest !== undefined) {
      updates.serviceInterest = data.serviceInterest;
    }
    if (data.status !== undefined) updates.status = data.status;
    if (data.dueDateLabel !== undefined) updates.dueDateLabel = data.dueDateLabel;
    if (data.summary !== undefined) updates.summary = data.summary;
    if (data.description !== undefined) updates.description = data.description;
    if (data.internalNotes !== undefined) {
      updates.internalNotes = data.internalNotes;
    }
    if (data.coverAssetId !== undefined) {
      updates.coverAssetId = data.coverAssetId || null;
    }
    if (data.progressPercent !== undefined) {
      updates.progressPercent = data.progressPercent;
    }
    if (data.startDate !== undefined) {
      updates.startDate = data.startDate ? new Date(data.startDate) : null;
    }
    if (data.dueDate !== undefined) {
      updates.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    if (data.workflowConfig !== undefined) {
      updates.workflowConfig = data.workflowConfig;
    }

    const [updated] = await db
      .update(pmsProjects)
      .set(updates)
      .where(eq(pmsProjects.id, id))
      .returning();

    if (!updated) {
      return apiNotFound("PMS project not found.");
    }

    await logPmsActivity(db, {
      projectId: id,
      actorUserId: auth.session.userId,
      action: "project.updated",
      summary:
        data.status !== undefined
          ? `Updated project status to ${data.status}`
          : data.progressPercent !== undefined
          ? `Updated project progress to ${data.progressPercent}%`
          : "Updated project configuration",
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "pms_project.updated",
      entityType: "pms_project",
      entityId: id,
      metadata: { status: updated.status },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/pms/projects/[id]");
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
      return apiBadRequest("Invalid project identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("PMS project not found.");
    if (!perms.canDeleteProject) {
      return apiForbidden("Only Studio Admins can delete PMS projects.");
    }

    const [deleted] = await db
      .delete(pmsProjects)
      .where(eq(pmsProjects.id, id))
      .returning({ id: pmsProjects.id, title: pmsProjects.title });

    if (!deleted) {
      return apiNotFound("PMS project not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "pms_project.deleted",
      entityType: "pms_project",
      entityId: id,
      metadata: { title: deleted.title },
    });

    return apiOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/pms/projects/[id]");
  }
}
