import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb, seoRedirects } from "@/db";
import {
  apiBadRequest,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";

const uuidSchema = z.string().uuid("Invalid redirect ID.");
const toggleSchema = z.object({
  isActive: z.boolean().optional(),
  statusCode: z
    .coerce
    .number()
    .int()
    .refine((n) => n === 301 || n === 302)
    .optional(),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid redirect identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = toggleSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest("Invalid redirect update payload.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const updateSet: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof parsed.data.isActive === "boolean") {
      updateSet.isActive = parsed.data.isActive;
    }
    if (parsed.data.statusCode) {
      updateSet.statusCode = parsed.data.statusCode;
    }

    const [updated] = await db
      .update(seoRedirects)
      .set(updateSet)
      .where(eq(seoRedirects.id, id))
      .returning();

    if (!updated) {
      return apiNotFound("Redirect rule not found.");
    }

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/seo/redirects/[id]");
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
      return apiBadRequest("Invalid redirect identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [deleted] = await db
      .delete(seoRedirects)
      .where(eq(seoRedirects.id, id))
      .returning({ id: seoRedirects.id });

    if (!deleted) {
      return apiNotFound("Redirect rule not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "seo.redirect_deleted",
      entityType: "seo_redirect",
      entityId: id,
    });

    return apiOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/seo/redirects/[id]");
  }
}

