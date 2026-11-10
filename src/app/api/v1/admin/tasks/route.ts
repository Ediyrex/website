import { desc } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb, studioTasks } from "@/db";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { studioTaskCreateSchema } from "@/lib/validations/cms";

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const rows = await db
      .select()
      .from(studioTasks)
      .orderBy(studioTasks.completed, desc(studioTasks.createdAt))
      .limit(50);

    return apiOk(rows);
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/tasks");
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

    const parsed = studioTaskCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid task payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [created] = await db
      .insert(studioTasks)
      .values({
        title: parsed.data.title,
        category: parsed.data.category,
        dueDateLabel: parsed.data.dueDateLabel,
        completed: false,
        assigneeUserId: auth.session.userId,
      })
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "task.created",
      entityType: "studio_task",
      entityId: created.id,
      metadata: { title: created.title },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/tasks");
  }
}

