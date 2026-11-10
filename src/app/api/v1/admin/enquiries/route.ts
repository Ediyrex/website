import { randomBytes } from "node:crypto";
import { unstable_rethrow } from "next/navigation";
import { and, asc, desc, eq, gte, ilike, inArray, isNotNull, or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  crmClients,
  crmFollowups,
  enquiries,
  enquiryNotes,
  enquiryStatusHistory,
  getDb,
} from "@/db";
import { requireAdminRole } from "@/lib/server/session";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { logger } from "@/lib/server/logger";
import { crmInquiryCreateSchema } from "@/lib/validations/cms";

const VALID_STATUSES = [
  "new",
  "reviewing",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
  "archived",
] as const;

type EnquiryStatusValue = (typeof VALID_STATUSES)[number];

function generateReferenceCode(): string {
  const year = new Date().getUTCFullYear();
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `ENQ-${year}-${suffix}`;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const serviceParam = searchParams.get("service")?.trim();
    const sourceParam = searchParams.get("source")?.trim();
    const windowParam = searchParams.get("window")?.trim() || "all";
    const pipelineWindowParam =
      searchParams.get("pipelineWindow")?.trim() || "30d";
    const queryParam = searchParams.get("q")?.trim();
    const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") || "10") || 10)
    );
    const offset = (page - 1) * limit;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const conditions = [];
    if (
      statusParam &&
      (VALID_STATUSES as readonly string[]).includes(statusParam)
    ) {
      conditions.push(eq(enquiries.status, statusParam as EnquiryStatusValue));
    }

    if (serviceParam && serviceParam !== "all") {
      conditions.push(eq(enquiries.projectType, serviceParam));
    }

    if (sourceParam && sourceParam !== "all") {
      conditions.push(eq(enquiries.source, sourceParam));
    }

    if (windowParam === "30d") {
      conditions.push(gte(enquiries.submittedAt, thirtyDaysAgo));
    } else if (windowParam === "7d") {
      conditions.push(gte(enquiries.submittedAt, sevenDaysAgo));
    }

    if (queryParam) {
      conditions.push(
        or(
          ilike(enquiries.referenceCode, `%${queryParam}%`),
          ilike(enquiries.contactName, `%${queryParam}%`),
          ilike(enquiries.emailNormalized, `%${queryParam}%`),
          ilike(enquiries.companyName, `%${queryParam}%`),
          ilike(enquiries.projectType, `%${queryParam}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const pipelineWhere =
      pipelineWindowParam === "30d"
        ? gte(enquiries.submittedAt, thirtyDaysAgo)
        : undefined;

    const [
      rows,
      [{ total }],
      allTimeStatusRows,
      pipelineStatusRows,
      [{ inquiriesLast30Days }],
      clientStatsRows,
      upcomingFollowups,
      serviceRows,
      sourceRows,
      firstHistoryRows,
      firstNoteRows,
    ] = await Promise.all([
      db
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
          convertedClientId: enquiries.convertedClientId,
          wantsDiscoveryCall: enquiries.wantsDiscoveryCall,
          submittedAt: enquiries.submittedAt,
          updatedAt: enquiries.updatedAt,
        })
        .from(enquiries)
        .where(whereClause)
        .orderBy(desc(enquiries.submittedAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: sql<number>`count(*)::int` })
        .from(enquiries)
        .where(whereClause),
      db
        .select({
          status: enquiries.status,
          count: sql<number>`count(*)::int`,
        })
        .from(enquiries)
        .groupBy(enquiries.status),
      db
        .select({
          status: enquiries.status,
          count: sql<number>`count(*)::int`,
        })
        .from(enquiries)
        .where(pipelineWhere)
        .groupBy(enquiries.status),
      db
        .select({ inquiriesLast30Days: sql<number>`count(*)::int` })
        .from(enquiries)
        .where(gte(enquiries.submittedAt, thirtyDaysAgo)),
      db
        .select({
          status: crmClients.status,
          count: sql<number>`count(*)::int`,
        })
        .from(crmClients)
        .groupBy(crmClients.status),
      db
        .select({
          id: crmFollowups.id,
          enquiryId: crmFollowups.enquiryId,
          clientId: crmFollowups.clientId,
          title: crmFollowups.title,
          channel: crmFollowups.channel,
          dueAt: crmFollowups.dueAt,
          completed: crmFollowups.completed,
          contactName: sql<string>`coalesce(${crmClients.name}, ${enquiries.contactName}, 'Studio Lead')`,
        })
        .from(crmFollowups)
        .leftJoin(enquiries, eq(crmFollowups.enquiryId, enquiries.id))
        .leftJoin(crmClients, eq(crmFollowups.clientId, crmClients.id))
        .where(eq(crmFollowups.completed, false))
        .orderBy(asc(crmFollowups.dueAt))
        .limit(5),
      db
        .selectDistinct({ projectType: enquiries.projectType })
        .from(enquiries)
        .orderBy(asc(enquiries.projectType)),
      db
        .selectDistinct({ source: enquiries.source })
        .from(enquiries)
        .orderBy(asc(enquiries.source)),
      db
        .select({
          enquiryId: enquiryStatusHistory.enquiryId,
          submittedAt: enquiries.submittedAt,
          firstActionAt: sql<Date>`min(${enquiryStatusHistory.createdAt})`,
        })
        .from(enquiryStatusHistory)
        .innerJoin(enquiries, eq(enquiryStatusHistory.enquiryId, enquiries.id))
        .where(isNotNull(enquiryStatusHistory.previousStatus))
        .groupBy(enquiryStatusHistory.enquiryId, enquiries.submittedAt),
      db
        .select({
          enquiryId: enquiryNotes.enquiryId,
          submittedAt: enquiries.submittedAt,
          firstActionAt: sql<Date>`min(${enquiryNotes.createdAt})`,
        })
        .from(enquiryNotes)
        .innerJoin(enquiries, eq(enquiryNotes.enquiryId, enquiries.id))
        .groupBy(enquiryNotes.enquiryId, enquiries.submittedAt),
    ]);

    const statusCounts: Record<string, number> = {
      new: 0,
      reviewing: 0,
      qualified: 0,
      proposal_sent: 0,
      won: 0,
      lost: 0,
      archived: 0,
    };
    let totalInquiries = 0;
    for (const r of allTimeStatusRows) {
      statusCounts[r.status] = r.count;
      totalInquiries += r.count;
    }

    const pipelineCounts: Record<string, number> = {
      new: 0,
      reviewing: 0,
      qualified: 0,
      proposal_sent: 0,
      won: 0,
    };
    for (const r of pipelineStatusRows) {
      if (r.status in pipelineCounts) {
        pipelineCounts[r.status] = r.count;
      }
    }

    let totalClients = 0;
    let activeClients = 0;
    for (const r of clientStatsRows) {
      totalClients += r.count;
      if (r.status === "active") activeClients += r.count;
    }

    const responseMap = new Map<string, number>();
    for (const row of [...firstHistoryRows, ...firstNoteRows]) {
      const submittedMs = new Date(row.submittedAt).getTime();
      const actionMs = new Date(row.firstActionAt).getTime();
      const diffHours = Math.max(0, (actionMs - submittedMs) / (1000 * 60 * 60));
      const existing = responseMap.get(row.enquiryId);
      if (existing === undefined || diffHours < existing) {
        responseMap.set(row.enquiryId, diffHours);
      }
    }

    const responseHoursList = Array.from(responseMap.values());
    const avgResponseHours =
      responseHoursList.length > 0
        ? Number(
            (
              responseHoursList.reduce((acc, n) => acc + n, 0) /
              responseHoursList.length
            ).toFixed(1)
          )
        : null;

    const activeLeads =
      statusCounts.new +
      statusCounts.reviewing +
      statusCounts.qualified +
      statusCounts.proposal_sent;

    const [{ overdueFollowupsCount }] = await db
      .select({ overdueFollowupsCount: sql<number>`count(*)::int` })
      .from(crmFollowups)
      .where(
        and(
          eq(crmFollowups.completed, false),
          sql`${crmFollowups.dueAt} < ${now}`
        )
      );

    // Count linked PMS projects per converted client if any
    const clientIdsOnPage = rows
      .map((r) => r.convertedClientId)
      .filter((id): id is string => Boolean(id));

    const clientStatusMap: Record<string, string> = {};
    if (clientIdsOnPage.length > 0) {
      const clientsList = await db
        .select({ id: crmClients.id, status: crmClients.status })
        .from(crmClients)
        .where(inArray(crmClients.id, clientIdsOnPage));
      for (const c of clientsList) {
        clientStatusMap[c.id] = c.status;
      }
    }

    return apiOk(
      {
        enquiries: rows,
        kpis: {
          totalInquiries,
          inquiriesLast30Days,
          activeLeads,
          inDiscussionCount: statusCounts.qualified,
          totalClients,
          activeClients,
          convertedLeads: statusCounts.won,
          avgResponseHours,
          respondedCount: responseHoursList.length,
          overdueFollowupsCount,
        },
        statusCounts,
        pipelineCounts,
        upcomingFollowups,
        serviceOptions: serviceRows
          .map((s) => s.projectType)
          .filter(Boolean),
        sourceOptions: sourceRows.map((s) => s.source).filter(Boolean),
        clientStatusMap,
      },
      {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      }
    );
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to fetch admin enquiries");
    return apiServerError("Unable to load enquiries.");
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

    const parsed = crmInquiryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid inquiry payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;
    const referenceCode = generateReferenceCode();

    const created = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(enquiries)
        .values({
          referenceCode,
          contactName: data.contactName,
          emailNormalized: data.email.toLowerCase(),
          companyName: data.companyName || null,
          phone: data.phone || null,
          projectType: data.projectType,
          goalsAndRequirements: data.goalsAndRequirements,
          expectedTimeline: data.expectedTimeline,
          source: data.source,
          status: data.status,
          wantsDiscoveryCall: data.wantsDiscoveryCall,
          consentAt: new Date(),
          privacyNoticeVersion: "admin-manual-v1",
          assignedAdminUserId: auth.session.userId,
        })
        .returning();

      await tx.insert(enquiryStatusHistory).values({
        enquiryId: row.id,
        changedById: auth.session.userId,
        previousStatus: null,
        newStatus: row.status,
        reason: `Added in CRM by ${auth.session.name || auth.session.email}`,
      });

      return row;
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "enquiry.created_manual",
      entityType: "enquiry",
      entityId: created.id,
      metadata: {
        referenceCode: created.referenceCode,
        source: created.source,
        status: created.status,
      },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/enquiries");
  }
}
