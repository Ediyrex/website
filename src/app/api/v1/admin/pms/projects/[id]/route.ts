import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb, pmsProjects } from "@/db";
import {
  apiBadRequest,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { pmsProjectUpdateSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid project identifier.");

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

    const parsed = pmsProjectUpdateSchema.safeParse(body);
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

    const data = parsed.data;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (data.title !== undefined) updates.title = data.title;
    if (data.status !== undefined) updates.status = data.status;
    if (data.dueDateLabel !== undefined) updates.dueDateLabel = data.dueDateLabel;
    if (data.summary !== undefined) updates.summary = data.summary;

    const [updated] = await db
      .update(pmsProjects)
      .set(updates)
      .where(eq(pmsProjects.id, id))
      .returning();

    if (!updated) {
      return apiNotFound("PMS project not found.");
    }

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

    const [deleted] = await db
      .delete(pmsProjects)
      .where(eq(pmsProjects.id, id))
      .returning({ id: pmsProjects.id });

    if (!deleted) {
      return apiNotFound("PMS project not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "pms_project.deleted",
      entityType: "pms_project",
      entityId: id,
    });

    return apiOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/pms/projects/[id]");
  }
}

