import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import {
  createCloudinarySignature,
  getCloudinaryConfig,
} from "@/lib/server/cloudinary";

export async function POST() {
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

    const folder = "ediyrex-cms";
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createCloudinarySignature(
      { folder, timestamp },
      config.apiSecret
    );

    return NextResponse.json({
      data: {
        configured: true,
        mode: "cloudinary",
        cloudName: config.cloudName,
        apiKey: config.apiKey,
        timestamp,
        folder,
        signature,
      },
    });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/media/signature");
  }
}

