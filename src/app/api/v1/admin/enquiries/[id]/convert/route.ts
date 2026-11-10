import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  crmClients,
  enquiries,
  enquiryStatusHistory,
  getDb,
  pmsProjects,
  studioTasks,
} from "@/db";
import {
  apiBadRequest,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { crmConvertToClientSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid enquiry identifier.");

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

    let body: unknown = {};
    try {
      const text = await request.text();
      if (text) body = JSON.parse(text);
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = crmConvertToClientSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid conversion payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existingEnquiry] = await db
      .select()
      .from(enquiries)
      .where(eq(enquiries.id, id))
      .limit(1);

    if (!existingEnquiry) {
      return apiNotFound("Inquiry not found.");
    }

    const data = parsed.data;

    const result = await db.transaction(async (tx) => {
      let client;
      if (existingEnquiry.convertedClientId) {
        const [found] = await tx
          .select()
          .from(crmClients)
          .where(eq(crmClients.id, existingEnquiry.convertedClientId))
          .limit(1);
        client = found;
      }

      if (!client) {
        const [createdClient] = await tx
          .insert(crmClients)
          .values({
            name: data.name || existingEnquiry.contactName,
            emailNormalized: existingEnquiry.emailNormalized,
            companyName: data.companyName ?? existingEnquiry.companyName,
            phone: data.phone ?? existingEnquiry.phone,
            serviceInterest:
              data.serviceInterest || existingEnquiry.projectType,
            source: existingEnquiry.source,
            sourceEnquiryId: existingEnquiry.id,
            status: "active",
            notes: data.notes || existingEnquiry.goalsAndRequirements,
          })
          .returning();
        client = createdClient;
      }

      await tx
        .update(enquiries)
        .set({
          status: "won",
          convertedClientId: client.id,
          updatedAt: new Date(),
        })
        .where(eq(enquiries.id, id));

      if (existingEnquiry.status !== "won") {
        await tx.insert(enquiryStatusHistory).values({
          enquiryId: id,
          changedById: auth.session.userId,
          previousStatus: existingEnquiry.status,
          newStatus: "won",
          reason: `Converted to client (${client.name})`,
        });
      }

      let pmsProject = null;
      if (data.createPmsProject) {
        const projectTitle =
          data.pmsProjectTitle ||
          `${client.companyName || client.name} — ${client.serviceInterest}`;
        const [createdProject] = await tx
          .insert(pmsProjects)
          .values({
            title: projectTitle,
            clientId: client.id,
            sourceEnquiryId: existingEnquiry.id,
            serviceInterest: client.serviceInterest,
            status: "planning",
            dueDateLabel: existingEnquiry.expectedTimeline || "This month",
            summary: existingEnquiry.goalsAndRequirements,
            leadUserId: auth.session.userId,
          })
          .returning();
        pmsProject = createdProject;

        await tx.insert(studioTasks).values({
          pmsProjectId: createdProject.id,
          title: `Kickoff: ${projectTitle}`,
          category: `PMS · ${client.serviceInterest}`,
          dueDateLabel: "This week",
          completed: false,
          assigneeUserId: auth.session.userId,
        });
      }

      return { client, pmsProject };
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "enquiry.converted_to_client",
      entityType: "crm_client",
      entityId: result.client.id,
      metadata: {
        enquiryId: id,
        referenceCode: existingEnquiry.referenceCode,
        pmsProjectId: result.pmsProject?.id || null,
      },
    });

    return apiOk(result, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/enquiries/[id]/convert");
  }
}

