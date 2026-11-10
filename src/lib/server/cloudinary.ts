import { createHash } from "node:crypto";

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryConfigured(): boolean {
  return getCloudinaryConfig() !== null;
}

export function createCloudinarySignature(
  params: Record<string, string | number>,
  apiSecret: string
): string {
  const sortedQuery = Object.keys(params)
    .sort()
    .filter((key) => params[key] !== undefined && params[key] !== "")
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1")
    .update(`${sortedQuery}${apiSecret}`)
    .digest("hex");
}

export interface CloudinaryUploadResult {
  providerAssetId: string;
  providerPublicId: string;
  assetUrl: string;
  secureUrl: string;
  resourceType: "image" | "video" | "document";
  mimeType: string;
  fileSizeBytes: number;
  width: number | null;
  height: number | null;
  providerMetadata: Record<string, unknown>;
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  folder = "ediyrex-cms"
): Promise<CloudinaryUploadResult> {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error("Cloudinary credentials are not configured.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createCloudinarySignature({ folder, timestamp }, config.apiSecret);

  const form = new FormData();
  const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
  form.append("file", blob, fileName);
  form.append("api_key", config.apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/auto/upload`,
    {
      method: "POST",
      body: form,
    }
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Cloudinary upload failed (${response.status}): ${errText.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    asset_id?: string;
    public_id: string;
    url: string;
    secure_url: string;
    resource_type?: string;
    bytes: number;
    width?: number;
    height?: number;
    format?: string;
  };

  const mappedResourceType: "image" | "video" | "document" =
    data.resource_type === "video"
      ? "video"
      : data.resource_type === "image"
        ? "image"
        : "document";

  return {
    providerAssetId: data.asset_id || data.public_id,
    providerPublicId: data.public_id,
    assetUrl: data.url,
    secureUrl: data.secure_url,
    resourceType: mappedResourceType,
    mimeType,
    fileSizeBytes: data.bytes || fileBuffer.byteLength,
    width: typeof data.width === "number" ? data.width : null,
    height: typeof data.height === "number" ? data.height : null,
    providerMetadata: {
      format: data.format || null,
      folder,
      cloudName: config.cloudName,
    },
  };
}

/**
 * Generates an optimized Cloudinary delivery URL (`f_auto,q_auto`) when applicable.
 */
export function buildOptimizedMediaUrl(rawUrl: string, width?: number): string {
  if (!rawUrl.includes("res.cloudinary.com") || !rawUrl.includes("/upload/")) {
    return rawUrl;
  }

  const transforms = width ? `f_auto,q_auto,w_${width}` : "f_auto,q_auto";
  return rawUrl.replace("/upload/", `/upload/${transforms}/`);
}

