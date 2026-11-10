import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { crmClients, getDb } from "@/db";
import {
  apiBadRequest,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { crmClientUpsertSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid client identifier.");

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid client identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = crmClientUpsertSchema.partial().safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid client update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (data.name !== undefined) updates.name = data.name;
    if (data.email !== undefined) updates.emailNormalized = data.email.toLowerCase();
    if (data.companyName !== undefined) updates.companyName = data.companyName || null;
    if (data.phone !== undefined) updates.phone = data.phone || null;
    if (data.serviceInterest !== undefined) {
      updates.serviceInterest = data.serviceInterest;
    }
    if (data.source !== undefined) updates.source = data.source;
    if (data.status !== undefined) updates.status = data.status;
    if (data.notes !== undefined) updates.notes = data.notes;

    const [updated] = await db
      .update(crmClients)
      .set(updates)
      .where(eq(crmClients.id, id))
      .returning();

    if (!updated) {
      return apiNotFound("Client not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "crm_client.updated",
      entityType: "crm_client",
      entityId: id,
      metadata: { status: updated.status },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/crm/clients/[id]");
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid client identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [deleted] = await db
      .delete(crmClients)
      .where(eq(crmClients.id, id))
      .returning({ id: crmClients.id, name: crmClients.name });

    if (!deleted) {
      return apiNotFound("Client not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "crm_client.deleted",
      entityType: "crm_client",
      entityId: id,
      metadata: { name: deleted.name },
    });

    return apiOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/crm/clients/[id]");
  }
}

