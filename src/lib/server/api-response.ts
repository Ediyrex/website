import { NextResponse } from "next/server";

export function apiOk<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  return NextResponse.json(
    meta ? { data, meta } : { data },
    { status }
  );
}

export function apiError(
  error: string,
  message: string,
  status: number,
  details?: Record<string, unknown>
) {
  return NextResponse.json(
    details ? { error, message, details } : { error, message },
    { status }
  );
}

export function apiBadRequest(
  message: string,
  details?: Record<string, unknown>
) {
  return apiError("Validation failed", message, 400, details);
}

export function apiNotFound(message = "Resource not found") {
  return apiError("Not Found", message, 404);
}

export function apiUnauthorized(message = "Authentication required.") {
  return apiError("Unauthorized", message, 401);
}

export function apiForbidden(
  message = "Insufficient permissions for this operation."
) {
  return apiError("Forbidden", message, 403);
}

export function apiTooManyRequests(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please wait before trying again.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}

export function apiServerError(
  message = "An unexpected server error occurred."
) {
  return apiError("Internal Server Error", message, 500);
}

