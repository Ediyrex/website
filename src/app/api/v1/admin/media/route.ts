import { and, asc, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb, mediaAssets } from "@/db";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import {
  buildOptimizedMediaUrl,
  isCloudinaryConfigured,
} from "@/lib/server/cloudinary";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { mediaRegisterSchema } from "@/lib/validations/cms";
import { paginationSchema } from "@/lib/validations/query";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { searchParams } = new URL(request.url);
    const parsedPage = paginationSchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? "12",
    });
    if (!parsedPage.success) {
      return apiBadRequest(
        "Invalid pagination parameters.",
        parsedPage.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const { page, limit } = parsedPage.data;
    const offset = (page - 1) * limit;
    const queryParam = searchParams.get("q")?.trim();
    const typeParam = searchParams.get("type")?.trim();
    const folderParam = searchParams.get("folder")?.trim();
    const tagParam = searchParams.get("tag")?.trim().toLowerCase();
    const sortParam = searchParams.get("sort")?.trim();

    const conditions = [isNull(mediaAssets.archivedAt)];
    if (
      typeParam === "image" ||
      typeParam === "video" ||
      typeParam === "document"
    ) {
      conditions.push(eq(mediaAssets.resourceType, typeParam));
    }
    if (folderParam) {
      conditions.push(eq(mediaAssets.folder, folderParam));
    }
    if (tagParam) {
      conditions.push(
        sql`${mediaAssets.tags} @> ${JSON.stringify([tagParam])}::jsonb`
      );
    }
    if (queryParam) {
      const searchCond = or(
        ilike(mediaAssets.altText, `%${queryParam}%`),
        ilike(mediaAssets.caption, `%${queryParam}%`),
        ilike(mediaAssets.providerPublicId, `%${queryParam}%`),
        ilike(mediaAssets.secureUrl, `%${queryParam}%`),
        ilike(mediaAssets.folder, `%${queryParam}%`),
        sql`${mediaAssets.tags}::text ilike ${`%${queryParam}%`}`
      );
      if (searchCond) conditions.push(searchCond);
    }

    const whereClause = and(...conditions);

    const orderByClause =
      sortParam === "oldest"
        ? asc(mediaAssets.createdAt)
        : sortParam === "largest"
          ? desc(mediaAssets.fileSizeBytes)
          : desc(mediaAssets.createdAt);

    const [rows, [{ total }], [globalStats], folderRows] = await Promise.all([
      db
        .select()
        .from(mediaAssets)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ total: sql<number>`count(*)::int` })
        .from(mediaAssets)
        .where(whereClause),
      db
        .select({
          totalAll: sql<number>`count(*)::int`,
          imagesCount: sql<number>`count(*) filter (where ${mediaAssets.resourceType} = 'image')::int`,
          videosCount: sql<number>`count(*) filter (where ${mediaAssets.resourceType} = 'video')::int`,
          documentsCount: sql<number>`count(*) filter (where ${mediaAssets.resourceType} = 'document')::int`,
          totalBytes: sql<number>`coalesce(sum(${mediaAssets.fileSizeBytes}), 0)::bigint`,
        })
        .from(mediaAssets)
        .where(isNull(mediaAssets.archivedAt)),
      db
        .select({
          folder: mediaAssets.folder,
          count: sql<number>`count(*)::int`,
        })
        .from(mediaAssets)
        .where(isNull(mediaAssets.archivedAt))
        .groupBy(mediaAssets.folder)
        .orderBy(asc(mediaAssets.folder)),
    ]);

    return apiOk(rows, {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      cloudinaryConfigured: isCloudinaryConfigured(),
      stats: {
        totalAll: globalStats?.totalAll ?? 0,
        imagesCount: globalStats?.imagesCount ?? 0,
        videosCount: globalStats?.videosCount ?? 0,
        documentsCount: globalStats?.documentsCount ?? 0,
        totalBytes: Number(globalStats?.totalBytes ?? 0),
        folderCounts: folderRows,
      },
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/media");
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

    const parsed = mediaRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid media metadata payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;
    const optimizedUrl =
      data.storageProvider === "cloudinary"
        ? buildOptimizedMediaUrl(data.secureUrl)
        : data.secureUrl;

    const [created] = await db
      .insert(mediaAssets)
      .values({
        storageProvider: data.storageProvider,
        providerAssetId: data.providerAssetId,
        providerPublicId: data.providerPublicId || null,
        assetUrl: data.assetUrl,
        secureUrl: optimizedUrl,
        resourceType: data.resourceType,
        mimeType: data.mimeType,
        fileSizeBytes: data.fileSizeBytes,
        width: data.width ?? null,
        height: data.height ?? null,
        altText: data.altText,
        caption: data.caption || null,
        folder: data.folder || "Website",
        tags: data.tags || [],
        uploadedByUserId: auth.session.userId,
      })
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "media.registered",
      entityType: "media_asset",
      entityId: created.id,
      metadata: {
        storageProvider: created.storageProvider,
        folder: created.folder,
      },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/media");
  }
}
