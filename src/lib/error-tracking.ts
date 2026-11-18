/**
 * Universal Error Tracking & Monitoring System for EDIYREX Studio
 * Integrates with Sentry for real-time exception reporting, telemetry breadcrumbs,
 * and context enrichment across both client and server environments.
 */

import * as Sentry from "@sentry/nextjs";

export interface ErrorTrackingContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Dispatches an exception to Sentry with attached metadata context
 */
export function trackError(
  error: unknown,
  context?: ErrorTrackingContext
): void {
  const err = error instanceof Error ? error : new Error(String(error));

  if (process.env.NODE_ENV === "development") {
    console.error(`[ErrorTracking] ${context?.component || "App"}:`, err, context?.metadata);
  }

  Sentry.captureException(err, {
    tags: {
      component: context?.component || "unknown",
      action: context?.action || "unknown",
    },
    extra: {
      ...context?.metadata,
      userId: context?.userId,
    },
  });
}

/**
 * Records a breadcrumb for debugging user interaction trails
 */
export function trackBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>,
  level: Sentry.SeverityLevel = "info"
): void {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Tracks a notable non-exception warning or message
 */
export function trackMessage(
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: Record<string, unknown>
): void {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}
