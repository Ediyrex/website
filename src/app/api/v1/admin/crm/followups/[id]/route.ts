import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { crmFollowups, getDb } from "@/db";
import {
  apiBadRequest,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { crmFollowupUpdateSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid follow-up identifier.");

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid follow-up identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = crmFollowupUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid follow-up update payload.",
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
    if (data.notes !== undefined) updates.notes = data.notes;
    if (data.channel !== undefined) updates.channel = data.channel;
    if (data.dueAt !== undefined) updates.dueAt = new Date(data.dueAt);
    if (data.completed !== undefined) {
      updates.completed = data.completed;
      updates.completedAt = data.completed ? new Date() : null;
    }

    const [updated] = await db
      .update(crmFollowups)
      .set(updates)
      .where(eq(crmFollowups.id, id))
      .returning();

    if (!updated) {
      return apiNotFound("Follow-up not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "crm_followup.updated",
      entityType: "crm_followup",
      entityId: id,
      metadata: { completed: updated.completed },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/crm/followups/[id]");
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
      return apiBadRequest("Invalid follow-up identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [deleted] = await db
      .delete(crmFollowups)
      .where(eq(crmFollowups.id, id))
      .returning({ id: crmFollowups.id });

    if (!deleted) {
      return apiNotFound("Follow-up not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "crm_followup.deleted",
      entityType: "crm_followup",
      entityId: id,
    });

    return apiOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/crm/followups/[id]");
  }
}

