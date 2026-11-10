import { createHash, randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { and, eq, gte } from "drizzle-orm";
import { enquirySchema } from "@/lib/validations/enquiry";
import {
  getDb,
  services,
  enquiries,
  enquiryStatusHistory,
  notificationOutbox,
} from "@/db";
import { mapBudgetTierToNumeric } from "@/lib/server/budget";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { handleApiError } from "@/lib/server/errors";
import {
  apiBadRequest,
  apiTooManyRequests,
} from "@/lib/server/api-response";
import { logger } from "@/lib/server/logger";

function hashValue(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function generateReferenceCode(): string {
  const year = new Date().getUTCFullYear();
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `ENQ-${year}-${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "local";
    const ipHash = hashValue(clientIp);

    // Rate limit: 5 enquiries per 10 minutes per IP hash
    const rateCheck = checkRateLimit(`enquiries:${ipHash}`, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      logger.warn({ ipHash }, "Enquiry submission rate-limited");
      return apiTooManyRequests(rateCheck.retryAfterSeconds);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parseResult = enquirySchema.safeParse(body);
    if (!parseResult.success) {
      return apiBadRequest(
        "Validation failed. Please review the highlighted fields.",
        parseResult.error.flatten().fieldErrors
      );
    }

    const validData = parseResult.data;
    const emailNormalized = validData.email.toLowerCase();
    const mappedBudget = mapBudgetTierToNumeric(
      validData.budgetCurrency,
      validData.budgetRange
    );

    const db = getDb();
    if (!db) {
      logger.info(
        {
          mode: "local_preview",
          projectType: validData.projectType,
          budgetCurrency: validData.budgetCurrency,
          budgetRange: validData.budgetRange,
          wantsDiscoveryCall: validData.wantsDiscoveryCall,
        },
        "Enquiry validated in local preview mode"
      );

      return NextResponse.json(
        {
          success: true,
          stored: false,
          mode: "local_preview",
          message:
            "Enquiry validated in local preview mode. Persistent database storage and email delivery will be enabled once PostgreSQL is connected.",
          data: {
            referenceId: `PREVIEW-${Date.now().toString().slice(-6)}`,
            status: "validated_preview",
            wantsDiscoveryCall: validData.wantsDiscoveryCall,
          },
        },
        { status: 200 }
      );
    }

    // Deduplication check across 5-minute window
    const dedupeHash = hashValue(
      `${emailNormalized}:${validData.projectType}:${validData.goals}`
    );
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const [existingDuplicate] = await db
      .select({
        id: enquiries.id,
        referenceCode: enquiries.referenceCode,
      })
      .from(enquiries)
      .where(
        and(
          eq(enquiries.dedupeHash, dedupeHash),
          gte(enquiries.submittedAt, fiveMinutesAgo)
        )
      )
      .limit(1);

    if (existingDuplicate) {
      return NextResponse.json(
        {
          success: true,
          stored: true,
          duplicate: true,
          message: "Your enquiry was already received.",
          data: {
            referenceId: existingDuplicate.referenceCode,
            status: "new",
            wantsDiscoveryCall: validData.wantsDiscoveryCall,
          },
        },
        { status: 200 }
      );
    }

    // Resolve optional matching service & division
    const [matchedService] = await db
      .select({
        id: services.id,
        divisionId: services.divisionId,
      })
      .from(services)
      .where(eq(services.slug, validData.projectType))
      .limit(1);

    const referenceCode = generateReferenceCode();
    const consentTimestamp = new Date();

    await db.transaction(async (tx) => {
      const [createdEnquiry] = await tx
        .insert(enquiries)
        .values({
          referenceCode,
          contactName: validData.name,
          emailNormalized,
          companyName: validData.company || null,
          phone: validData.phone || null,
          serviceDivisionId: matchedService?.divisionId ?? null,
          serviceId: matchedService?.id ?? null,
          projectType: validData.projectType,
          goalsAndRequirements: validData.goals,
          budgetMin: mappedBudget.budgetMin,
          budgetMax: mappedBudget.budgetMax,
          budgetCurrency: mappedBudget.budgetCurrency,
          expectedTimeline: validData.timeline,
          status: "new",
          source: "website_contact_form",
          wantsDiscoveryCall: validData.wantsDiscoveryCall,
          consentAt: consentTimestamp,
          privacyNoticeVersion: "v1.0",
          dedupeHash,
          ipHash,
        })
        .returning({ id: enquiries.id, referenceCode: enquiries.referenceCode });

      await tx.insert(enquiryStatusHistory).values({
        enquiryId: createdEnquiry.id,
        previousStatus: null,
        newStatus: "new",
        reason: "Initial website submission",
      });

      await tx.insert(notificationOutbox).values({
        eventType: "enquiry.submitted.studio_alert",
        entityType: "enquiry",
        entityId: createdEnquiry.id,
        dedupeKey: `enquiry-alert:${createdEnquiry.id}`,
        payload: {
          referenceCode: createdEnquiry.referenceCode,
          projectType: validData.projectType,
          wantsDiscoveryCall: validData.wantsDiscoveryCall,
        },
        status: "pending",
      });
    });

    logger.info(
      {
        referenceCode,
        projectType: validData.projectType,
        wantsDiscoveryCall: validData.wantsDiscoveryCall,
      },
      "Enquiry persisted and outbox queued"
    );

    return NextResponse.json(
      {
        success: true,
        stored: true,
        message:
          "Enquiry submitted successfully. Our studio leads will review your scope and follow up within 24 business hours.",
        data: {
          referenceId: referenceCode,
          status: "new",
          wantsDiscoveryCall: validData.wantsDiscoveryCall,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return handleApiError(err, "POST /api/v1/enquiries");
  }
}
