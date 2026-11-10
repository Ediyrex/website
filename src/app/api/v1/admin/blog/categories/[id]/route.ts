import { and, eq, ne } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { blogCategories, getDb } from "@/db";
import {
  apiBadRequest,
  apiError,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { blogCategoryCreateSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid category ID.");

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid category identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = blogCategoryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid blog category update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [conflict] = await db
      .select({ id: blogCategories.id })
      .from(blogCategories)
      .where(and(eq(blogCategories.slug, parsed.data.slug), ne(blogCategories.id, id)))
      .limit(1);

    if (conflict) {
      return apiError(
        "Conflict",
        "Another blog category already uses this slug.",
        409
      );
    }

    const [updated] = await db
      .update(blogCategories)
      .set({
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
      })
      .where(eq(blogCategories.id, id))
      .returning();

    if (!updated) {
      return apiNotFound("Category not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "blog_category.updated",
      entityType: "blog_category",
      entityId: id,
      metadata: { slug: updated.slug },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/blog/categories/[id]");
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid category identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [deleted] = await db
      .delete(blogCategories)
      .where(eq(blogCategories.id, id))
      .returning({ id: blogCategories.id, slug: blogCategories.slug });

    if (!deleted) {
      return apiNotFound("Category not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "blog_category.deleted",
      entityType: "blog_category",
      entityId: id,
      metadata: { slug: deleted.slug },
    });

    return apiOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/blog/categories/[id]");
  }
}
