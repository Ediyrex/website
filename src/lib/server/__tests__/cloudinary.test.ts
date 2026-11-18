import { describe, expect, it } from "vitest";
import {
  buildOptimizedMediaUrl,
  createCloudinarySignature,
  createSignedUploadParams,
  getVideoPosterUrl,
  CLOUDINARY_FOLDERS,
} from "../cloudinary";
import { parseVideoUrl } from "@/features/media/components/SocialVideoFrame";

describe("Cloudinary Helpers & Signed Uploads", () => {
  it("computes deterministic SHA-1 upload signatures", () => {
    const sig = createCloudinarySignature(
      { folder: "ediyrex-cms", timestamp: 1700000000 },
      "my_secret"
    );
    expect(sig).toMatch(/^[a-f0-9]{40}$/);
  });

  it("injects f_auto,q_auto transforms on res.cloudinary.com URLs", () => {
    const raw =
      "https://res.cloudinary.com/demo/image/upload/v1234/ediyrex-cms/hero.png";
    expect(buildOptimizedMediaUrl(raw)).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1234/ediyrex-cms/hero.png"
    );
    expect(buildOptimizedMediaUrl(raw, 800)).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/v1234/ediyrex-cms/hero.png"
    );
  });

  it("supports advanced options (width, height, crop, quality)", () => {
    const raw =
      "https://res.cloudinary.com/demo/image/upload/v1234/ediyrex-cms/banner.png";
    const optimized = buildOptimizedMediaUrl(raw, {
      width: 1200,
      height: 630,
      crop: "fill",
      quality: "auto:best",
    });
    expect(optimized).toContain("w_1200");
    expect(optimized).toContain("h_630");
    expect(optimized).toContain("c_fill");
    expect(optimized).toContain("q_auto:best");
  });

  it("leaves non-Cloudinary URLs unchanged", () => {
    expect(buildOptimizedMediaUrl("/uploads/cms/sample.png")).toBe(
      "/uploads/cms/sample.png"
    );
  });

  it("generates poster URLs from Cloudinary video URLs", () => {
    const videoUrl =
      "https://res.cloudinary.com/demo/video/upload/v1234/ediyrex/showreel.mp4";
    const poster = getVideoPosterUrl(videoUrl, 1080);
    expect(poster).toContain(".jpg");
    expect(poster).toContain("so_0");
    expect(poster).toContain("w_1080");
  });

  it("generates signed upload parameters with folder and timestamp", () => {
    const params = createSignedUploadParams({
      folder: CLOUDINARY_FOLDERS.PORTFOLIO,
      tags: ["client", "branding"],
    });

    expect(params.configured).toBe(true);
    expect(params.folder).toBe("ediyrex/portfolio");
    expect(params.timestamp).toBeGreaterThan(0);
    expect(params.signature).toBeDefined();
    expect(params.uploadUrl).toContain("api.cloudinary.com");
  });
});

describe("Social Video URL Parser (YouTube / Shorts / Reels / Vimeo)", () => {
  it("parses YouTube standard watch URLs into 16:9 widescreen embed", () => {
    const res = parseVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(res.platform).toBe("youtube");
    expect(res.isVertical).toBe(false);
    expect(res.embedUrl).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  it("parses youtu.be short URLs", () => {
    const res = parseVideoUrl("https://youtu.be/dQw4w9WgXcQ");
    expect(res.platform).toBe("youtube");
    expect(res.isVertical).toBe(false);
    expect(res.embedUrl).toContain("dQw4w9WgXcQ");
  });

  it("parses YouTube Shorts into 9:16 vertical smartphone format", () => {
    const res = parseVideoUrl("https://www.youtube.com/shorts/abc123XYZ");
    expect(res.platform).toBe("youtube_shorts");
    expect(res.isVertical).toBe(true);
    expect(res.embedUrl).toContain("youtube-nocookie.com/embed/abc123XYZ");
  });

  it("parses Instagram Reels into vertical reel format", () => {
    const res = parseVideoUrl("https://www.instagram.com/reel/C123456789/");
    expect(res.platform).toBe("instagram");
    expect(res.isVertical).toBe(true);
    expect(res.embedUrl).toContain("instagram.com/reel/C123456789/embed");
  });

  it("parses Vimeo video URLs", () => {
    const res = parseVideoUrl("https://vimeo.com/76979871");
    expect(res.platform).toBe("vimeo");
    expect(res.isVertical).toBe(false);
    expect(res.embedUrl).toContain("player.vimeo.com/video/76979871");
  });

  it("identifies direct video file URLs", () => {
    const res = parseVideoUrl("https://assets.ediyrex.com/brand-film.mp4");
    expect(res.platform).toBe("direct");
    expect(res.directSrc).toBe("https://assets.ediyrex.com/brand-film.mp4");
  });
});
