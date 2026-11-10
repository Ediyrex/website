import { afterEach, describe, expect, it } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { applySecurityAndCorsHeaders, isOriginAllowed } from "../cors";

const originalAllowedOrigins = process.env.ALLOWED_ORIGINS;
const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

afterEach(() => {
  if (originalAllowedOrigins === undefined) {
    delete process.env.ALLOWED_ORIGINS;
  } else {
    process.env.ALLOWED_ORIGINS = originalAllowedOrigins;
  }

  if (originalSiteUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  }
});

describe("CORS & security headers", () => {
  it("allows requests without an Origin header and configured origins", () => {
    process.env.ALLOWED_ORIGINS = "https://ediyrex.com, http://localhost:3000";

    expect(isOriginAllowed(null)).toBe(true);
    expect(isOriginAllowed("https://ediyrex.com")).toBe(true);
    expect(isOriginAllowed("https://ediyrex.com/")).toBe(true);
    expect(isOriginAllowed("http://localhost:3000")).toBe(true);
  });

  it("rejects origins outside the allowlist", () => {
    process.env.ALLOWED_ORIGINS = "https://ediyrex.com";

    expect(isOriginAllowed("https://evil.example.com")).toBe(false);
    expect(isOriginAllowed("http://ediyrex.com")).toBe(false);
  });

  it("sets Helmet-style headers and strict CORS headers on /api/* responses", () => {
    process.env.ALLOWED_ORIGINS = "https://ediyrex.com";
    process.env.NEXT_PUBLIC_SITE_URL = "https://ediyrex.com";

    const request = new NextRequest("https://ediyrex.com/api/v1/services", {
      headers: {
        origin: "https://ediyrex.com",
      },
    });
    const response = applySecurityAndCorsHeaders(NextResponse.next(), request);

    expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin"
    );
    expect(response.headers.get("Strict-Transport-Security")).toBe(
      "max-age=31536000; includeSubDomains"
    );
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://ediyrex.com"
    );
  });
});

