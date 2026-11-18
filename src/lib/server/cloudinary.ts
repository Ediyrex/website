import { createHash } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export const CLOUDINARY_FOLDERS = {
  BRAND: "ediyrex/brand",
  HOME: "ediyrex/website/home",
  MEDIA: "ediyrex/website/media",
  WEB: "ediyrex/website/web",
  AI: "ediyrex/website/agents-automation",
  PORTFOLIO: "ediyrex/portfolio",
  BLOG: "ediyrex/blog",
  STUDIO: "ediyrex/studio",
  CLIENT_ASSETS: "ediyrex/client-assets",
  CMS: "ediyrex-cms",
} as const;

export type CloudinaryFolderKey = keyof typeof CLOUDINARY_FOLDERS;

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    if (process.env.NODE_ENV === "test") {
      return {
        cloudName: "ediyrex-test",
        apiKey: "test-api-key",
        apiSecret: "test-api-secret",
      };
    }
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryConfigured(): boolean {
  return getCloudinaryConfig() !== null;
}

/**
 * Returns configured official Cloudinary v2 SDK instance.
 */
export function getCloudinaryV2() {
  const config = getCloudinaryConfig();
  if (config) {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true,
    });
  }
  return cloudinary;
}

/**
 * Computes deterministic SHA-1 signature for Cloudinary direct uploads.
 */
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

/**
 * Prepares direct browser upload parameters with signature.
 */
export function createSignedUploadParams(options: {
  folder?: string;
  tags?: string[];
  resourceType?: "image" | "video" | "auto";
} = {}) {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error("Cloudinary credentials are not configured.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = options.folder || CLOUDINARY_FOLDERS.CMS;

  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
  };

  if (options.tags && options.tags.length > 0) {
    paramsToSign.tags = options.tags.join(",");
  }

  const signature = createCloudinarySignature(paramsToSign, config.apiSecret);

  return {
    configured: true,
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    timestamp,
    folder,
    signature,
    uploadUrl: `https://api.cloudinary.com/v1_1/${encodeURIComponent(
      config.cloudName
    )}/${options.resourceType || "auto"}/upload`,
  };
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
  folder = CLOUDINARY_FOLDERS.CMS
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
 * Deletes an asset from Cloudinary using the official SDK.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<{ result: string }> {
  const config = getCloudinaryConfig();
  if (!config) {
    return { result: "ok" };
  }

  const v2 = getCloudinaryV2();
  return await v2.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

/**
 * Generates an optimized Cloudinary delivery URL (`f_auto,q_auto`) with optional width, height, and crop.
 */
export function buildOptimizedMediaUrl(
  rawUrl: string,
  options?: number | { width?: number; height?: number; crop?: string; quality?: string }
): string {
  if (!rawUrl || !rawUrl.includes("res.cloudinary.com") || !rawUrl.includes("/upload/")) {
    return rawUrl;
  }

  const opts = typeof options === "number" ? { width: options } : options || {};
  const transforms: string[] = ["f_auto", "q_auto"];

  if (opts.width) transforms.push(`w_${opts.width}`);
  if (opts.height) transforms.push(`h_${opts.height}`);
  if (opts.crop) transforms.push(`c_${opts.crop}`);
  if (opts.quality) transforms.push(`q_${opts.quality}`);

  return rawUrl.replace("/upload/", `/upload/${transforms.join(",")}/`);
}

/**
 * Generates a video poster frame image URL from a Cloudinary video.
 */
export function getVideoPosterUrl(videoUrl: string, width?: number): string {
  if (!videoUrl || !videoUrl.includes("res.cloudinary.com")) {
    return videoUrl;
  }

  // Replace video extension with .jpg and add auto-format/quality and start-offset 0
  let poster = videoUrl.replace(/\.(mp4|webm|mov|mkv)$/i, ".jpg");
  if (!poster.includes("/upload/")) return poster;

  const transforms = width ? `f_auto,q_auto,so_0,w_${width}` : "f_auto,q_auto,so_0";
  return poster.replace("/upload/", `/upload/${transforms}/`);
}
