import { unstable_rethrow } from "next/navigation";
import { and, asc, desc, eq, gte, lt, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { crmClients, crmFollowups, enquiries, getDb } from "@/db";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { logger } from "@/lib/server/logger";
import { requireAdminRole } from "@/lib/server/session";
import { crmFollowupCreateSchema } from "@/lib/validations/cms";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter")?.trim() || "upcoming";
    const now = new Date();

    const conditions = [];
    if (filter === "upcoming") {
      conditions.push(eq(crmFollowups.completed, false));
      conditions.push(gte(crmFollowups.dueAt, now));
    } else if (filter === "overdue") {
      conditions.push(eq(crmFollowups.completed, false));
      conditions.push(lt(crmFollowups.dueAt, now));
    } else if (filter === "completed") {
      conditions.push(eq(crmFollowups.completed, true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, [{ upcoming }], [{ overdue }], [{ completed }]] =
      await Promise.all([
        db
          .select({
            id: crmFollowups.id,
            enquiryId: crmFollowups.enquiryId,
            clientId: crmFollowups.clientId,
            title: crmFollowups.title,
            notes: crmFollowups.notes,
            channel: crmFollowups.channel,
            dueAt: crmFollowups.dueAt,
            completed: crmFollowups.completed,
            completedAt: crmFollowups.completedAt,
            createdAt: crmFollowups.createdAt,
            contactName: sql<string>`coalesce(${crmClients.name}, ${enquiries.contactName}, 'Studio Lead')`,
            contactEmail: sql<string | null>`coalesce(${crmClients.emailNormalized}, ${enquiries.emailNormalized})`,
            enquiryReference: enquiries.referenceCode,
            clientCompany: crmClients.companyName,
          })
          .from(crmFollowups)
          .leftJoin(enquiries, eq(crmFollowups.enquiryId, enquiries.id))
          .leftJoin(crmClients, eq(crmFollowups.clientId, crmClients.id))
          .where(whereClause)
          .orderBy(
            filter === "completed"
              ? desc(crmFollowups.completedAt)
              : asc(crmFollowups.dueAt)
          )
          .limit(100),
        db
          .select({ upcoming: sql<number>`count(*)::int` })
          .from(crmFollowups)
          .where(
            and(
              eq(crmFollowups.completed, false),
              gte(crmFollowups.dueAt, now)
            )
          ),
        db
          .select({ overdue: sql<number>`count(*)::int` })
          .from(crmFollowups)
          .where(
            and(
              eq(crmFollowups.completed, false),
              lt(crmFollowups.dueAt, now)
            )
          ),
        db
          .select({ completed: sql<number>`count(*)::int` })
          .from(crmFollowups)
          .where(eq(crmFollowups.completed, true)),
      ]);

    return apiOk({
      followups: rows,
      counts: {
        upcoming,
        overdue,
        completed,
        all: upcoming + overdue + completed,
      },
    });
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to fetch CRM follow-ups");
    return apiServerError("Unable to load follow-ups.");
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

    const parsed = crmFollowupCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid follow-up payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;
    const [created] = await db
      .insert(crmFollowups)
      .values({
        enquiryId: data.enquiryId || null,
        clientId: data.clientId || null,
        title: data.title,
        notes: data.notes,
        channel: data.channel,
        dueAt: new Date(data.dueAt),
        completed: false,
        assignedUserId: auth.session.userId,
      })
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "crm_followup.created",
      entityType: "crm_followup",
      entityId: created.id,
      metadata: {
        enquiryId: created.enquiryId,
        clientId: created.clientId,
        dueAt: created.dueAt.toISOString(),
      },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/crm/followups");
  }
}
