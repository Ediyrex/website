import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  getDb,
  pmsProjectMembers,
  pmsTaskAssignees,
  pmsTaskComments,
  studioTasks,
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
import { pmsTaskReviewSchema } from "@/lib/validations/pms";

const uuidSchema = z.string().uuid("Invalid task identifier.");

export async function POST(
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

    const parsed = pmsTaskReviewSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid review payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const [task] = await db
      .select()
      .from(studioTasks)
      .where(eq(studioTasks.id, id))
      .limit(1);
    if (!task) return apiNotFound("Task not found.");

    const perms = task.pmsProjectId
      ? await getProjectPermissions(db, auth.session, task.pmsProjectId)
      : {
          canEditTasks: true,
          canApproveReviews: auth.session.roles.includes("admin"),
        };

    const { decision, feedback } = parsed.data;

    if (decision === "submit" && !perms.canEditTasks) {
      return apiForbidden("Viewers cannot submit tasks for review.");
    }
    if (
      (decision === "approve" || decision === "request_revisions") &&
      !perms.canApproveReviews
    ) {
      return apiForbidden(
        "Only Project Managers, Team Leads, or Admins can approve or reject deliverables."
      );
    }

    const updated = await db.transaction(async (tx) => {
      const now = new Date();
      let updates: Record<string, unknown> = { updatedAt: now };

      if (decision === "submit") {
        updates = {
          ...updates,
          workflowStatus: "in_review",
          completed: false,
          reviewStatus: "pending_review",
          submittedByUserId: auth.session.userId,
          reviewFeedback: feedback || null,
        };
      } else if (decision === "approve") {
        updates = {
          ...updates,
          workflowStatus: "done",
          completed: true,
          reviewStatus: "approved",
          reviewedByUserId: auth.session.userId,
          reviewedAt: now,
          reviewFeedback: feedback || null,
        };
      } else {
        updates = {
          ...updates,
          workflowStatus: "in_progress",
          completed: false,
          reviewStatus: "changes_requested",
          reviewedByUserId: auth.session.userId,
          reviewedAt: now,
          reviewFeedback: feedback || "Revisions requested.",
        };
      }

      const [row] = await tx
        .update(studioTasks)
        .set(updates)
        .where(eq(studioTasks.id, id))
        .returning();

      if (feedback) {
        await tx.insert(pmsTaskComments).values({
          taskId: id,
          authorUserId: auth.session.userId,
          body: `[Review · ${decision.replace("_", " ").toUpperCase()}] ${feedback}`,
          isReviewNote: true,
        });
      }

      const summary =
        decision === "submit"
          ? `Submitted "${row.title}" for review`
          : decision === "approve"
          ? `Approved review for "${row.title}"`
          : `Requested revisions on "${row.title}"`;

      await logPmsActivity(tx, {
        projectId: task.pmsProjectId,
        taskId: id,
        actorUserId: auth.session.userId,
        action: `review.${decision}`,
        summary,
      });

      if (decision === "submit" && task.pmsProjectId) {
        const leads = await tx
          .select({
            userId: pmsProjectMembers.userId,
            projectRole: pmsProjectMembers.projectRole,
          })
          .from(pmsProjectMembers)
          .where(eq(pmsProjectMembers.projectId, task.pmsProjectId));

        const reviewers = leads
          .filter((l) =>
            ["super_admin", "studio_admin", "project_manager", "team_lead"].includes(
              l.projectRole
            )
          )
          .map((l) => l.userId);

        await notifyPmsUsers(tx, {
          recipientUserIds: reviewers,
          actorUserId: auth.session.userId,
          projectId: task.pmsProjectId,
          taskId: id,
          category: "review",
          title: `Review requested: ${row.title}`,
          body: feedback || `${auth.session.displayName} submitted work for approval.`,
        });
      } else {
        const assignees = await tx
          .select({ userId: pmsTaskAssignees.userId })
          .from(pmsTaskAssignees)
          .where(eq(pmsTaskAssignees.taskId, id));
        const targets = [
          ...(task.submittedByUserId ? [task.submittedByUserId] : []),
          ...assignees.map((a) => a.userId),
        ];

        await notifyPmsUsers(tx, {
          recipientUserIds: targets,
          actorUserId: auth.session.userId,
          projectId: task.pmsProjectId,
          taskId: id,
          category: "review",
          title:
            decision === "approve"
              ? `Approved: ${row.title}`
              : `Revisions requested: ${row.title}`,
          body: feedback || summary,
        });
      }

      return row;
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/tasks/[id]/review");
  }
}

