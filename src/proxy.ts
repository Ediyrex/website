import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/server/session-constants";
import {
  applySecurityAndCorsHeaders,
  isOriginAllowed,
} from "@/lib/server/cors";

export function proxy(request: NextRequest) {
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

  const response = NextResponse.next();
  return applySecurityAndCorsHeaders(response, request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
