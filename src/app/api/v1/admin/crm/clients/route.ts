import { unstable_rethrow } from "next/navigation";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { crmClients, enquiries, getDb, pmsProjects } from "@/db";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { logger } from "@/lib/server/logger";
import { requireAdminRole } from "@/lib/server/session";
import { crmClientUpsertSchema } from "@/lib/validations/cms";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status")?.trim() || "all";
    const queryParam = searchParams.get("q")?.trim();

    const conditions = [];
    if (statusParam === "active" || statusParam === "archived") {
      conditions.push(eq(crmClients.status, statusParam));
    }
    if (queryParam) {
      conditions.push(
        or(
          ilike(crmClients.name, `%${queryParam}%`),
          ilike(crmClients.emailNormalized, `%${queryParam}%`),
          ilike(crmClients.companyName, `%${queryParam}%`),
          ilike(crmClients.serviceInterest, `%${queryParam}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, statusCountRows, projectCounts] = await Promise.all([
      db
        .select({
          id: crmClients.id,
          name: crmClients.name,
          emailNormalized: crmClients.emailNormalized,
          companyName: crmClients.companyName,
          phone: crmClients.phone,
          serviceInterest: crmClients.serviceInterest,
          source: crmClients.source,
          sourceEnquiryId: crmClients.sourceEnquiryId,
          sourceReferenceCode: enquiries.referenceCode,
          status: crmClients.status,
          notes: crmClients.notes,
          createdAt: crmClients.createdAt,
          updatedAt: crmClients.updatedAt,
        })
        .from(crmClients)
        .leftJoin(enquiries, eq(crmClients.sourceEnquiryId, enquiries.id))
        .where(whereClause)
        .orderBy(desc(crmClients.createdAt))
        .limit(100),
      db
        .select({
          status: crmClients.status,
          count: sql<number>`count(*)::int`,
        })
        .from(crmClients)
        .groupBy(crmClients.status),
      db
        .select({
          clientId: pmsProjects.clientId,
          count: sql<number>`count(*)::int`,
        })
        .from(pmsProjects)
        .groupBy(pmsProjects.clientId),
    ]);

    const projectMap = new Map<string, number>();
    for (const pc of projectCounts) {
      if (pc.clientId) projectMap.set(pc.clientId, pc.count);
    }

    let activeCount = 0;
    let archivedCount = 0;
    for (const sc of statusCountRows) {
      if (sc.status === "active") activeCount = sc.count;
      if (sc.status === "archived") archivedCount = sc.count;
    }

    return apiOk({
      clients: rows.map((row) => ({
        ...row,
        pmsProjectCount: projectMap.get(row.id) ?? 0,
      })),
      counts: {
        all: activeCount + archivedCount,
        active: activeCount,
        archived: archivedCount,
      },
    });
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to fetch CRM clients");
    return apiServerError("Unable to fetch CRM clients.");
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

    const parsed = crmClientUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid client payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;
    const [created] = await db
      .insert(crmClients)
      .values({
        name: data.name,
        emailNormalized: data.email.toLowerCase(),
        companyName: data.companyName || null,
        phone: data.phone || null,
        serviceInterest: data.serviceInterest,
        source: data.source,
        status: data.status,
        notes: data.notes,
      })
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "crm_client.created",
      entityType: "crm_client",
      entityId: created.id,
      metadata: { name: created.name, companyName: created.companyName },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/crm/clients");
  }
}
