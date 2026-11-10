import { unstable_rethrow } from "next/navigation";
import { desc, eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { crmClients, enquiries, getDb, pmsProjects, studioTasks } from "@/db";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { logger } from "@/lib/server/logger";
import { requireAdminRole } from "@/lib/server/session";
import { pmsProjectCreateSchema } from "@/lib/validations/cms";

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [rows, taskCounts] = await Promise.all([
      db
        .select({
          id: pmsProjects.id,
          title: pmsProjects.title,
          clientId: pmsProjects.clientId,
          clientName: crmClients.name,
          clientCompany: crmClients.companyName,
          sourceEnquiryId: pmsProjects.sourceEnquiryId,
          sourceReferenceCode: enquiries.referenceCode,
          serviceInterest: pmsProjects.serviceInterest,
          status: pmsProjects.status,
          dueDateLabel: pmsProjects.dueDateLabel,
          summary: pmsProjects.summary,
          createdAt: pmsProjects.createdAt,
          updatedAt: pmsProjects.updatedAt,
        })
        .from(pmsProjects)
        .leftJoin(crmClients, eq(pmsProjects.clientId, crmClients.id))
        .leftJoin(enquiries, eq(pmsProjects.sourceEnquiryId, enquiries.id))
        .orderBy(desc(pmsProjects.createdAt))
        .limit(100),
      db
        .select({
          pmsProjectId: studioTasks.pmsProjectId,
          totalTasks: sql<number>`count(*)::int`,
          completedTasks: sql<number>`count(*) filter (where ${studioTasks.completed} = true)::int`,
        })
        .from(studioTasks)
        .groupBy(studioTasks.pmsProjectId),
    ]);

    const taskMap = new Map<
      string,
      { totalTasks: number; completedTasks: number }
    >();
    for (const tc of taskCounts) {
      if (tc.pmsProjectId) {
        taskMap.set(tc.pmsProjectId, {
          totalTasks: tc.totalTasks,
          completedTasks: tc.completedTasks,
        });
      }
    }

    return apiOk(
      rows.map((row) => ({
        ...row,
        ...(taskMap.get(row.id) ?? { totalTasks: 0, completedTasks: 0 }),
      }))
    );
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to fetch PMS projects");
    return apiServerError("Unable to load PMS projects.");
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

    const parsed = pmsProjectCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid PMS project payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;
    const created = await db.transaction(async (tx) => {
      const [project] = await tx
        .insert(pmsProjects)
        .values({
          title: data.title,
          clientId: data.clientId || null,
          sourceEnquiryId: data.sourceEnquiryId || null,
          serviceInterest: data.serviceInterest,
          status: data.status,
          dueDateLabel: data.dueDateLabel,
          summary: data.summary,
          leadUserId: auth.session.userId,
        })
        .returning();

      await tx.insert(studioTasks).values({
        pmsProjectId: project.id,
        title: `Kickoff: ${project.title}`,
        category: `PMS · ${project.serviceInterest}`,
        dueDateLabel: project.dueDateLabel || "This week",
        completed: false,
        assigneeUserId: auth.session.userId,
      });

      return project;
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "pms_project.created",
      entityType: "pms_project",
      entityId: created.id,
      metadata: {
        title: created.title,
        clientId: created.clientId,
        sourceEnquiryId: created.sourceEnquiryId,
      },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/projects");
  }
}

