import type { NextRequest } from "next/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  enquiries,
  enquiryNotes,
  enquiryStatusHistory,
  getDb,
} from "@/db";
import { requireAdminRole } from "@/lib/server/session";
import { recordAuditLog } from "@/lib/server/audit";
import { sanitizePlainText } from "@/lib/server/sanitize";
import { handleApiError } from "@/lib/server/errors";
import { enquiryNoteSchema } from "@/lib/validations/cms";
import {
  apiBadRequest,
  apiForbidden,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";

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
  reason: z.string().trim().max(320).transform(sanitizePlainText).optional(),
});

const uuidSchema = z.string().uuid("Invalid enquiry ID");

function canAccessEnquiry(
  roles: string[],
  userId: string,
  assignedAdminUserId: string | null
): boolean {
  if (roles.includes("admin")) return true;
  if (!assignedAdminUserId) return true;
  return assignedAdminUserId === userId;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid enquiry identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existing] = await db
      .select({
        id: enquiries.id,
        referenceCode: enquiries.referenceCode,
        contactName: enquiries.contactName,
        emailNormalized: enquiries.emailNormalized,
        companyName: enquiries.companyName,
        phone: enquiries.phone,
        projectType: enquiries.projectType,
        goalsAndRequirements: enquiries.goalsAndRequirements,
        budgetMin: enquiries.budgetMin,
        budgetMax: enquiries.budgetMax,
        budgetCurrency: enquiries.budgetCurrency,
        expectedTimeline: enquiries.expectedTimeline,
        status: enquiries.status,
        source: enquiries.source,
        wantsDiscoveryCall: enquiries.wantsDiscoveryCall,
        assignedAdminUserId: enquiries.assignedAdminUserId,
        submittedAt: enquiries.submittedAt,
        updatedAt: enquiries.updatedAt,
      })
      .from(enquiries)
      .where(eq(enquiries.id, id))
      .limit(1);

    if (!existing) {
      return apiNotFound("Enquiry not found.");
    }

    if (
      !canAccessEnquiry(
        auth.session.roles,
        auth.session.userId,
        existing.assignedAdminUserId
      )
    ) {
      return apiForbidden("You do not have permission to access this enquiry.");
    }

    const [history, notes] = await Promise.all([
      db
        .select({
          id: enquiryStatusHistory.id,
          previousStatus: enquiryStatusHistory.previousStatus,
          newStatus: enquiryStatusHistory.newStatus,
          reason: enquiryStatusHistory.reason,
          createdAt: enquiryStatusHistory.createdAt,
        })
        .from(enquiryStatusHistory)
        .where(eq(enquiryStatusHistory.enquiryId, id))
        .orderBy(desc(enquiryStatusHistory.createdAt)),
      db
        .select({
          id: enquiryNotes.id,
          note: enquiryNotes.body,
          authorId: enquiryNotes.authorUserId,
          createdAt: enquiryNotes.createdAt,
        })
        .from(enquiryNotes)
        .where(eq(enquiryNotes.enquiryId, id))
        .orderBy(desc(enquiryNotes.createdAt)),
    ]);

    return apiOk({
      ...existing,
      history,
      notes,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/enquiries/[id]");
  }
}

export async function POST(
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

    const parsed = enquiryNoteSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid enquiry note payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existing] = await db
      .select({
        id: enquiries.id,
        assignedAdminUserId: enquiries.assignedAdminUserId,
      })
      .from(enquiries)
      .where(eq(enquiries.id, id))
      .limit(1);

    if (!existing) {
      return apiNotFound("Enquiry not found.");
    }

    if (
      !canAccessEnquiry(
        auth.session.roles,
        auth.session.userId,
        existing.assignedAdminUserId
      )
    ) {
      return apiForbidden("You do not have permission to annotate this enquiry.");
    }

    const [createdNote] = await db
      .insert(enquiryNotes)
      .values({
        enquiryId: id,
        authorUserId: auth.session.userId,
        body: parsed.data.note,
      })
      .returning({
        id: enquiryNotes.id,
        note: enquiryNotes.body,
        authorId: enquiryNotes.authorUserId,
        createdAt: enquiryNotes.createdAt,
      });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "enquiry.note_added",
      entityType: "enquiry",
      entityId: id,
    });

    return apiOk(createdNote, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/enquiries/[id]");
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

    if (
      !canAccessEnquiry(
        auth.session.roles,
        auth.session.userId,
        existing.assignedAdminUserId
      )
    ) {
      return apiForbidden("You do not have permission to modify this enquiry.");
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
    return handleApiError(err, "PATCH /api/v1/admin/enquiries/[id]");
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
      return apiBadRequest("Invalid enquiry identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [deleted] = await db
      .delete(enquiries)
      .where(eq(enquiries.id, id))
      .returning({ id: enquiries.id, referenceCode: enquiries.referenceCode });

    if (!deleted) {
      return apiNotFound("Enquiry not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "enquiry.deleted",
      entityType: "enquiry",
      entityId: id,
      metadata: { referenceCode: deleted.referenceCode },
    });

    return apiOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/enquiries/[id]");
  }
}
