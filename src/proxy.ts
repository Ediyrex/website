import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { getDb, seoRedirects } from "@/db";
import { SESSION_COOKIE_NAME } from "@/lib/server/session-constants";
import {
  applySecurityAndCorsHeaders,
  isOriginAllowed,
} from "@/lib/server/cors";

interface CachedRedirect {
  source: string;
  destination: string;
  statusCode: number;
}

let cachedRedirects: CachedRedirect[] = [];
let cacheExpiresAt = 0;

async function lookupDynamicRedirect(pathname: string): Promise<CachedRedirect | null> {
  const now = Date.now();
  if (now > cacheExpiresAt) {
    const db = getDb();
    if (db) {
      try {
        const rows = await db
          .select({
            source: seoRedirects.source,
            destination: seoRedirects.destination,
            statusCode: seoRedirects.statusCode,
          })
          .from(seoRedirects)
          .where(eq(seoRedirects.isActive, true));

        cachedRedirects = rows.filter((r) => !r.source.includes(":"));
        cacheExpiresAt = now + 5000;
      } catch {
        cacheExpiresAt = now + 5000;
      }
    } else {
      cacheExpiresAt = now + 5000;
    }
  }

  return cachedRedirects.find((r) => r.source === pathname) ?? null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Enforce strict origin allowlist on API routes
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    if (origin && !isOriginAllowed(origin)) {
      return NextResponse.json(
        { error: "Forbidden", message: "Origin not allowed by CORS policy." },
        { status: 403 }
      );
    }

    if (request.method === "OPTIONS") {
      const preflight = new NextResponse(null, { status: 204 });
      return applySecurityAndCorsHeaders(preflight, request);
    }
  }

  // Optimistic session cookie check on /admin/*
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const hasCookie = request.cookies.has(SESSION_COOKIE_NAME);
    if (!hasCookie) {
      const redirectRes = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      return applySecurityAndCorsHeaders(redirectRes, request);
    }
  }

  // Live 301 / 302 CMS redirect lookup for public GET page requests
  if (
    request.method === "GET" &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/admin") &&
    !pathname.includes(".")
  ) {
    const matched = await lookupDynamicRedirect(pathname);
    if (matched) {
      const targetUrl = matched.destination.startsWith("http")
        ? matched.destination
        : new URL(matched.destination, request.url);
      const res = NextResponse.redirect(
        targetUrl,
        matched.statusCode === 302 ? 302 : 301
      );
      return applySecurityAndCorsHeaders(res, request);
    }
  }

  const response = NextResponse.next();
  return applySecurityAndCorsHeaders(response, request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
