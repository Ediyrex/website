import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, enquiries, enquiryStatusHistory } from "@/db";
import { requireAdminRole } from "@/lib/server/session";
import { recordAuditLog } from "@/lib/server/audit";
import {
  apiBadRequest,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { logger } from "@/lib/server/logger";

const updateEnquiryStatusSchema = z.object({
  status: z.enum([
    "new",
    "reviewing",
    "qualified",
    "proposal_sent",
    "won",
    "lost",
    "archived",
  ]),
  reason: z.string().trim().max(320).optional(),
});

const uuidSchema = z.string().uuid("Invalid enquiry ID");

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid enquiry identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = updateEnquiryStatusSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid status update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existing] = await db
      .select()
      .from(enquiries)
      .where(eq(enquiries.id, id))
      .limit(1);

    if (!existing) {
      return apiNotFound("Enquiry not found.");
    }

    const nextStatus = parsed.data.status;

    const updated = await db.transaction(async (tx) => {
      const [row] = await tx
        .update(enquiries)
        .set({
          status: nextStatus,
          archivedAt: nextStatus === "archived" ? new Date() : null,
        })
        .where(eq(enquiries.id, id))
        .returning({
          id: enquiries.id,
          referenceCode: enquiries.referenceCode,
          status: enquiries.status,
          updatedAt: enquiries.updatedAt,
        });

      await tx.insert(enquiryStatusHistory).values({
        enquiryId: id,
        changedById: auth.session.userId,
        previousStatus: existing.status,
        newStatus: nextStatus,
        reason: parsed.data.reason || null,
      });

      return row;
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "enquiry.status_updated",
      entityType: "enquiry",
      entityId: id,
      metadata: {
        previousStatus: existing.status,
        newStatus: nextStatus,
      },
    });

    return apiOk(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update enquiry status");
    return apiServerError("Unable to update enquiry status.");
  }
}

