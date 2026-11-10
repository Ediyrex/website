import { unstable_rethrow } from "next/navigation";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb, enquiries } from "@/db";
import { requireAdminRole } from "@/lib/server/session";
import {
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { logger } from "@/lib/server/logger";

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
    const queryParam = searchParams.get("q")?.trim();
    const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") || "20") || 20)
    );
    const offset = (page - 1) * limit;

    const conditions = [];
    if (
      statusParam &&
      (VALID_STATUSES as readonly string[]).includes(statusParam)
    ) {
      conditions.push(eq(enquiries.status, statusParam as EnquiryStatusValue));
    }

    if (queryParam) {
      conditions.push(
        or(
          ilike(enquiries.referenceCode, `%${queryParam}%`),
          ilike(enquiries.contactName, `%${queryParam}%`),
          ilike(enquiries.emailNormalized, `%${queryParam}%`),
          ilike(enquiries.projectType, `%${queryParam}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
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
        wantsDiscoveryCall: enquiries.wantsDiscoveryCall,
        submittedAt: enquiries.submittedAt,
        updatedAt: enquiries.updatedAt,
      })
      .from(enquiries)
      .where(whereClause)
      .orderBy(desc(enquiries.submittedAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(enquiries)
      .where(whereClause);

    return apiOk(rows, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to fetch admin enquiries");
    return apiServerError("Unable to load enquiries.");
  }
}
