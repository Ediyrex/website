import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb, pmsProjectMembers, pmsProjects, users } from "@/db";
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
import {
  pmsMemberAddSchema,
  pmsMemberUpdateSchema,
} from "@/lib/validations/pms";

const uuidSchema = z.string().uuid("Invalid identifier.");

export async function POST(
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

    const parsed = pmsMemberAddSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid project member payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("Project not found.");
    if (!perms.canManageProject) {
      return apiForbidden("Only project managers or admins can assign team members.");
    }

    const data = parsed.data;
    const [[targetUser], [project]] = await Promise.all([
      db
        .select({ id: users.id, displayName: users.displayName })
        .from(users)
        .where(eq(users.id, data.userId))
        .limit(1),
      db
        .select({ id: pmsProjects.id, title: pmsProjects.title })
        .from(pmsProjects)
        .where(eq(pmsProjects.id, id))
        .limit(1),
    ]);

    if (!targetUser || !project) {
      return apiNotFound("User or project not found.");
    }

    const [existing] = await db
      .select()
      .from(pmsProjectMembers)
      .where(
        and(
          eq(pmsProjectMembers.projectId, id),
          eq(pmsProjectMembers.userId, data.userId)
        )
      )
      .limit(1);

    let member;
    if (existing) {
      [member] = await db
        .update(pmsProjectMembers)
        .set({
          projectRole: data.projectRole,
          capacityHoursPerWeek: data.capacityHoursPerWeek,
          membershipStatus: "active",
        })
        .where(eq(pmsProjectMembers.id, existing.id))
        .returning();
    } else {
      [member] = await db
        .insert(pmsProjectMembers)
        .values({
          projectId: id,
          userId: data.userId,
          projectRole: data.projectRole,
          capacityHoursPerWeek: data.capacityHoursPerWeek,
          membershipStatus: "active",
        })
        .returning();
    }

    await Promise.all([
      logPmsActivity(db, {
        projectId: id,
        actorUserId: auth.session.userId,
        action: "member.added",
        summary: `Assigned ${targetUser.displayName} as ${data.projectRole.replace(/_/g, " ")}`,
      }),
      notifyPmsUsers(db, {
        recipientUserIds: [data.userId],
        actorUserId: auth.session.userId,
        projectId: id,
        category: "project",
        title: `Project membership updated: ${project.title}`,
        body: `Role assigned: ${data.projectRole.replace(/_/g, " ")}`,
      }),
    ]);

    return apiOk(member, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/projects/[id]/members");
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

    const parsed = pmsMemberUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid member update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("Project not found.");
    if (!perms.canManageProject) {
      return apiForbidden("Only project managers or admins can update team roles.");
    }

    const data = parsed.data;
    const updates: Record<string, unknown> = {};
    if (data.projectRole !== undefined) updates.projectRole = data.projectRole;
    if (data.capacityHoursPerWeek !== undefined) {
      updates.capacityHoursPerWeek = data.capacityHoursPerWeek;
    }
    if (data.membershipStatus !== undefined) {
      updates.membershipStatus = data.membershipStatus;
    }

    const [updated] = await db
      .update(pmsProjectMembers)
      .set(updates)
      .where(
        and(
          eq(pmsProjectMembers.projectId, id),
          eq(pmsProjectMembers.userId, data.userId)
        )
      )
      .returning();

    if (!updated) {
      return apiNotFound("Project member not found.");
    }

    await logPmsActivity(db, {
      projectId: id,
      actorUserId: auth.session.userId,
      action: "member.updated",
      summary: `Updated project team role to ${updated.projectRole.replace(/_/g, " ")}`,
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/pms/projects/[id]/members");
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "";
    if (!uuidSchema.safeParse(id).success || !uuidSchema.safeParse(userId).success) {
      return apiBadRequest("Invalid project or user identifier.");
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("Project not found.");
    if (!perms.canManageProject) {
      return apiForbidden("Only project managers or admins can remove members.");
    }

    const [deleted] = await db
      .delete(pmsProjectMembers)
      .where(
        and(
          eq(pmsProjectMembers.projectId, id),
          eq(pmsProjectMembers.userId, userId)
        )
      )
      .returning({ id: pmsProjectMembers.id });

    if (!deleted) return apiNotFound("Project member not found.");

    await logPmsActivity(db, {
      projectId: id,
      actorUserId: auth.session.userId,
      action: "member.removed",
      summary: "Removed a team member from the project",
    });

    return apiOk({ deleted: true });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/pms/projects/[id]/members");
  }
}

