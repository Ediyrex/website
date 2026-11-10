import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  getDb,
  mediaAssets,
  pmsProjectFiles,
  pmsProjectMembers,
} from "@/db";
import { logPmsActivity, notifyPmsUsers } from "@/lib/pms/notifications";
import { getProjectPermissions } from "@/lib/pms/permissions";
import {
  apiBadRequest,
  apiForbidden,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { pmsFileRegisterSchema } from "@/lib/validations/pms";

const uuidSchema = z.string().uuid("Invalid identifier.");

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid project identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = pmsFileRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid project file payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("Project not found.");
    if (!perms.canEditTasks) {
      return apiForbidden("You do not have permission to upload project files.");
    }

    const data = parsed.data;
    const [asset] = await db
      .select({ id: mediaAssets.id })
      .from(mediaAssets)
      .where(eq(mediaAssets.id, data.mediaAssetId))
      .limit(1);
    if (!asset) return apiNotFound("Media asset not found.");

    // Auto-increment version by versionGroupId (or matching filename if first version in chain)
    const groupFilter = data.versionGroupId
      ? eq(pmsProjectFiles.versionGroupId, data.versionGroupId)
      : and(
          eq(pmsProjectFiles.projectId, id),
          eq(pmsProjectFiles.title, data.title)
        );

    const existingGroupRows = await db
      .select({
        versionGroupId: pmsProjectFiles.versionGroupId,
        version: pmsProjectFiles.version,
      })
      .from(pmsProjectFiles)
      .where(groupFilter);

    const resolvedGroupId =
      data.versionGroupId ||
      existingGroupRows.find((r) => Boolean(r.versionGroupId))?.versionGroupId ||
      randomUUID();

    const maxVersion = existingGroupRows.reduce(
      (max, r) => Math.max(max, r.version),
      0
    );
    const version = maxVersion > 0 ? maxVersion + 1 : data.version;

    const [created] = await db
      .insert(pmsProjectFiles)
      .values({
        projectId: id,
        taskId: data.taskId || null,
        mediaAssetId: data.mediaAssetId,
        title: data.title,
        category: data.category,
        versionGroupId: resolvedGroupId,
        version,
        versionNote: data.versionNote || null,
        uploadedByUserId: auth.session.userId,
      })
      .returning();

    const members = await db
      .select({ userId: pmsProjectMembers.userId })
      .from(pmsProjectMembers)
      .where(eq(pmsProjectMembers.projectId, id));

    await Promise.all([
      logPmsActivity(db, {
        projectId: id,
        taskId: data.taskId || null,
        actorUserId: auth.session.userId,
        action: "file.uploaded",
        summary: `Uploaded "${data.title}" (v${version})`,
      }),
      notifyPmsUsers(db, {
        recipientUserIds: members.map((m) => m.userId),
        actorUserId: auth.session.userId,
        projectId: id,
        taskId: data.taskId || null,
        category: "file",
        title: `New file uploaded: ${data.title} (v${version})`,
        body: `${auth.session.displayName} added a ${data.category} file.`,
      }),
    ]);

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/projects/[id]/files");
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId") || "";
    if (!uuidSchema.safeParse(id).success || !uuidSchema.safeParse(fileId).success) {
      return apiBadRequest("Invalid project or file identifier.");
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("Project not found.");
    if (!perms.canEditTasks) {
      return apiForbidden("You do not have permission to remove project files.");
    }

    const [deleted] = await db
      .delete(pmsProjectFiles)
      .where(and(eq(pmsProjectFiles.id, fileId), eq(pmsProjectFiles.projectId, id)))
      .returning({ id: pmsProjectFiles.id, title: pmsProjectFiles.title });

    if (!deleted) return apiNotFound("Project file not found.");

    await logPmsActivity(db, {
      projectId: id,
      actorUserId: auth.session.userId,
      action: "file.removed",
      summary: `Removed file "${deleted.title}" from project repository`,
    });

    return apiOk({ deleted: true });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/pms/projects/[id]/files");
  }
}

