import { unstable_rethrow } from "next/navigation";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { logger } from "./logger";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function handleApiError(err: unknown, context: string): NextResponse {
  unstable_rethrow(err);

  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      Sentry.captureException(err, {
        extra: { context, code: err.code, details: err.details },
      });
    }
    return NextResponse.json(
      err.details
        ? { error: err.code, message: err.message, details: err.details }
        : { error: err.code, message: err.message },
      { status: err.statusCode }
    );
  }

  logger.error({ err, context }, "Unhandled API exception");
  Sentry.captureException(err, {
    extra: { context },
  });
  return NextResponse.json(
    {
      error: "Internal Server Error",
      message: "An unexpected server error occurred.",
    },
    { status: 500 }
  );
}

