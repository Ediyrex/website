import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import {
  createSignedUploadParams,
  getCloudinaryConfig,
  CLOUDINARY_FOLDERS,
} from "@/lib/server/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const config = getCloudinaryConfig();
    if (!config) {
      return NextResponse.json({
        data: {
          configured: false,
          mode: "local_fallback",
          message:
            "Cloudinary credentials are not configured. Uploads use secure local fallback until CLOUDINARY_* variables are added.",
        },
      });
    }

    let body: { folder?: string; tags?: string[]; resourceType?: "image" | "video" | "auto" } = {};
    try {
      body = await request.json();
    } catch {
      // Body is optional
    }

    const folder = body.folder || CLOUDINARY_FOLDERS.CMS;
    const signedParams = createSignedUploadParams({
      folder,
      tags: body.tags,
      resourceType: body.resourceType,
    });

    return NextResponse.json({
      data: {
        configured: true,
        mode: "cloudinary",
        cloudName: signedParams.cloudName,
        apiKey: signedParams.apiKey,
        timestamp: signedParams.timestamp,
        folder: signedParams.folder,
        signature: signedParams.signature,
        uploadUrl: signedParams.uploadUrl,
      },
    });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/media/signature");
  }
}
