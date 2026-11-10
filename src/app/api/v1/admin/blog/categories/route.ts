import { asc, eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { blogCategories, blogPostCategories, getDb } from "@/db";
import {
  apiBadRequest,
  apiError,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { blogCategoryCreateSchema } from "@/lib/validations/cms";

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const rows = await db
      .select({
        id: blogCategories.id,
        name: blogCategories.name,
        slug: blogCategories.slug,
        description: blogCategories.description,
        count: sql<number>`count(${blogPostCategories.blogPostId})::int`,
      })
      .from(blogCategories)
      .leftJoin(
        blogPostCategories,
        eq(blogCategories.id, blogPostCategories.categoryId)
      )
      .groupBy(
        blogCategories.id,
        blogCategories.name,
        blogCategories.slug,
        blogCategories.description
      )
      .orderBy(asc(blogCategories.name));

    return apiOk(rows);
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/blog/categories");
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

    const parsed = blogCategoryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid blog category payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existingSlug] = await db
      .select({ id: blogCategories.id })
      .from(blogCategories)
      .where(eq(blogCategories.slug, parsed.data.slug))
      .limit(1);

    if (existingSlug) {
      return apiError(
        "Conflict",
        "A blog category with this slug already exists.",
        409
      );
    }

    const [created] = await db
      .insert(blogCategories)
      .values({
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
      })
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "blog_category.created",
      entityType: "blog_category",
      entityId: created.id,
      metadata: { slug: created.slug },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/blog/categories");
  }
}

