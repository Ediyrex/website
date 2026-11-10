import { describe, expect, it } from "vitest";
import {
  buildOptimizedMediaUrl,
  createCloudinarySignature,
} from "../cloudinary";

describe("Cloudinary helpers", () => {
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

  it("leaves non-Cloudinary URLs unchanged", () => {
    expect(buildOptimizedMediaUrl("/uploads/cms/sample.png")).toBe(
      "/uploads/cms/sample.png"
    );
  });
});

