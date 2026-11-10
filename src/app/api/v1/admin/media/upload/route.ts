import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
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
  uploadToCloudinary,
} from "@/lib/server/cloudinary";
import { handleApiError } from "@/lib/server/errors";
import { sanitizePlainText } from "@/lib/server/sanitize";
import { requireAdminRole } from "@/lib/server/session";
import {
  ALLOWED_MEDIA_MIME_TYPES,
  MAX_MEDIA_UPLOAD_BYTES,
} from "@/lib/validations/cms";

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return apiBadRequest("Expected multipart/form-data upload.");
    }

    const fileEntry = formData.get("file");
    if (!(fileEntry instanceof File)) {
      return apiBadRequest("No file provided in 'file' field.");
    }

    const mimeType = fileEntry.type.toLowerCase();
    if (
      !(ALLOWED_MEDIA_MIME_TYPES as readonly string[]).includes(mimeType)
    ) {
      return apiBadRequest(
        `Unsupported file type (${mimeType || "unknown"}). Allowed: JPEG, PNG, WebP, AVIF, GIF, MP4, WebM.`
      );
    }

    if (fileEntry.size <= 0 || fileEntry.size > MAX_MEDIA_UPLOAD_BYTES) {
      return apiBadRequest(
        `File size must be between 1 byte and ${Math.floor(MAX_MEDIA_UPLOAD_BYTES / (1024 * 1024))} MB.`
      );
    }

    const altRaw = formData.get("altText");
    const captionRaw = formData.get("caption");
    const folderRaw = formData.get("folder");
    const tagsRaw = formData.get("tags");

    const altText =
      typeof altRaw === "string" ? sanitizePlainText(altRaw).slice(0, 300) : "";
    const caption =
      typeof captionRaw === "string"
        ? sanitizePlainText(captionRaw).slice(0, 500) || null
        : null;
    const folder =
      typeof folderRaw === "string" && sanitizePlainText(folderRaw)
        ? sanitizePlainText(folderRaw).slice(0, 100)
        : "Website";
    const tags =
      typeof tagsRaw === "string"
        ? tagsRaw
            .split(",")
            .map((t) => sanitizePlainText(t).slice(0, 40))
            .filter(Boolean)
            .slice(0, 20)
        : [];

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const buffer = Buffer.from(await fileEntry.arrayBuffer());

    let insertPayload: {
      storageProvider: string;
      providerAssetId: string;
      providerPublicId: string | null;
      assetUrl: string;
      secureUrl: string;
      resourceType: "image" | "video" | "document";
      mimeType: string;
      fileSizeBytes: number;
      width: number | null;
      height: number | null;
      altText: string;
      caption: string | null;
      folder: string;
      tags: string[];
      providerMetadata: Record<string, unknown>;
      uploadedByUserId: string;
    };

    if (isCloudinaryConfigured()) {
      const uploaded = await uploadToCloudinary(
        buffer,
        fileEntry.name || "asset",
        mimeType,
        "ediyrex-cms"
      );
      insertPayload = {
        storageProvider: "cloudinary",
        providerAssetId: uploaded.providerAssetId,
        providerPublicId: uploaded.providerPublicId,
        assetUrl: uploaded.assetUrl,
        secureUrl: buildOptimizedMediaUrl(uploaded.secureUrl),
        resourceType: uploaded.resourceType,
        mimeType: uploaded.mimeType,
        fileSizeBytes: uploaded.fileSizeBytes,
        width: uploaded.width,
        height: uploaded.height,
        altText: altText || sanitizePlainText(fileEntry.name).slice(0, 120),
        caption,
        folder,
        tags,
        providerMetadata: uploaded.providerMetadata,
        uploadedByUserId: auth.session.userId,
      };
    } else {
      const ext = MIME_TO_EXTENSION[mimeType] || "bin";
      const fileId = randomUUID();
      const safeFileName = `${fileId}.${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "cms");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, safeFileName), buffer);

      const publicPath = `/uploads/cms/${safeFileName}`;
      insertPayload = {
        storageProvider: "local",
        providerAssetId: fileId,
        providerPublicId: safeFileName,
        assetUrl: publicPath,
        secureUrl: publicPath,
        resourceType: mimeType.startsWith("video/") ? "video" : "image",
        mimeType,
        fileSizeBytes: buffer.byteLength,
        width: null,
        height: null,
        altText: altText || sanitizePlainText(fileEntry.name).slice(0, 120),
        caption,
        folder,
        tags,
        providerMetadata: {
          originalName: sanitizePlainText(fileEntry.name).slice(0, 180),
          fallbackMode: true,
        },
        uploadedByUserId: auth.session.userId,
      };
    }

    const [created] = await db
      .insert(mediaAssets)
      .values(insertPayload)
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "media.uploaded",
      entityType: "media_asset",
      entityId: created.id,
      metadata: {
        storageProvider: created.storageProvider,
        mimeType: created.mimeType,
        fileSizeBytes: created.fileSizeBytes,
        folder: created.folder,
      },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/media/upload");
  }
}
