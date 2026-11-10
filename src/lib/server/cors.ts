import { NextResponse, type NextRequest } from "next/server";
import { getAllowedOrigins } from "./env";

export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true; // Same-origin or non-browser server requests without Origin
  const normalized = origin.replace(/\/$/, "");
  const allowed = getAllowedOrigins();
  return allowed.includes(normalized);
}

export function applySecurityAndCorsHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  // Helmet-style security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set("X-DNS-Prefetch-Control", "off");

  if (process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://")) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  // Strict CORS on /api/*
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    if (origin && isOriginAllowed(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      response.headers.append("Vary", "Origin");
    }
  }

  return response;
}

