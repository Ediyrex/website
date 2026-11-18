import { eq, and, lte, lt, desc, sql, count } from "drizzle-orm";
import { getDb } from "@/db";
import { notificationOutbox } from "@/db/schema/enquiries";
import { outboxStatusEnum } from "@/db/schema/enums";
import {
  ADMIN_NOTIFICATION_EMAIL,
  EMAIL_TEMPLATE_KEYS,
  NOTIFICATION_EVENT_TYPES,
} from "./email.constants";
import type {
  EmailSendResult,
  NotificationJobData,
  SendEmailOptions,
} from "./email.types";
import { sendEmail } from "./email.provider";
import {
  renderEnquiryReceivedEmail,
  renderNewEnquiryAdminEmail,
  renderPasswordResetEmail,
  renderTestEmail,
} from "./email.templates";
import { logger } from "@/lib/server/logger";

/**
 * Enqueues a notification job into the PostgreSQL notification_outbox table.
 */
export async function queueNotificationJob(
  job: NotificationJobData
): Promise<{ id: string; queued: boolean; error?: string }> {
  const db = getDb();

  if (!db) {
    logger.info(
      { eventType: job.eventType, entityId: job.entityId },
      "Notification queued in local preview mode (no database connection)"
    );
    return {
      id: `preview_${Date.now()}`,
      queued: false,
    };
  }

  try {
    const [inserted] = await db
      .insert(notificationOutbox)
      .values({
        eventType: job.eventType,
        entityType: job.entityType,
        entityId: job.entityId,
        dedupeKey: job.dedupeKey || null,
        payload: {
          ...job.payload,
          recipientEmail: job.recipientEmail,
          templateKey: job.templateKey,
        },
        status: "pending",
        attemptCount: 0,
        maxAttempts: 5,
        nextRetryAt: new Date(),
      })
      .onConflictDoNothing({ target: notificationOutbox.dedupeKey })
      .returning({ id: notificationOutbox.id });

    if (!inserted) {
      logger.info(
        { dedupeKey: job.dedupeKey },
        "Notification job deduplicated (already exists)"
      );
      return {
        id: "deduplicated",
        queued: false,
      };
    }

    return {
      id: inserted.id,
      queued: true,
    };
  } catch (error) {
    logger.error({ error, job }, "Failed to enqueue notification job");
    return {
      id: "",
      queued: false,
      error: error instanceof Error ? error.message : "Database queue error",
    };
  }
}

/**
 * Dispatches an email according to the job event type and template key.
 */
async function dispatchJobEmail(job: {
  id: string;
  eventType: string;
  payload: Record<string, unknown>;
}): Promise<EmailSendResult> {
  const { eventType, payload } = job;
  const templateKey = (payload.templateKey as string) || "";
  const recipient = (payload.recipientEmail as string) || "";

  // 1. Client Enquiry Received Confirmation
  if (
    eventType === NOTIFICATION_EVENT_TYPES.ENQUIRY_SUBMITTED ||
    templateKey === EMAIL_TEMPLATE_KEYS.ENQUIRY_RECEIVED
  ) {
    if (!recipient) {
      return { success: false, error: "Missing recipientEmail in job payload" };
    }

    const { subject, html } = renderEnquiryReceivedEmail({
      name: (payload.name as string) || "Valued Client",
      referenceCode: (payload.referenceCode as string) || "EDY-REF",
      projectType: (payload.projectType as string) || "General Enquiry",
      budgetCurrency: (payload.budgetCurrency as string) || "USD",
      budgetRange: (payload.budgetRange as string) || "Flexible",
      wantsDiscoveryCall: Boolean(payload.wantsDiscoveryCall),
    });

    return await sendEmail({
      to: recipient,
      subject,
      html,
      tags: [
        { name: "category", value: "enquiry_confirmation" },
        { name: "entity_id", value: job.id },
      ],
    });
  }

  // 2. Internal Studio Alert: New Enquiry
  if (
    eventType === NOTIFICATION_EVENT_TYPES.ENQUIRY_STUDIO_ALERT ||
    templateKey === EMAIL_TEMPLATE_KEYS.NEW_ENQUIRY_ADMIN
  ) {
    const studioEmail = recipient || ADMIN_NOTIFICATION_EMAIL;

    const { subject, html } = renderNewEnquiryAdminEmail({
      name: (payload.name as string) || "Inquirer",
      email: (payload.email as string) || "no-reply@ediyrex.com",
      company: payload.company as string | undefined,
      phone: payload.phone as string | undefined,
      referenceCode: (payload.referenceCode as string) || "EDY-REF",
      projectType: (payload.projectType as string) || "Studio Brief",
      goals: (payload.goals as string) || "No specific details provided",
      budgetCurrency: (payload.budgetCurrency as string) || "USD",
      budgetRange: (payload.budgetRange as string) || "Flexible",
      timeline: (payload.timeline as string) || "Not specified",
      wantsDiscoveryCall: Boolean(payload.wantsDiscoveryCall),
    });

    return await sendEmail({
      to: studioEmail,
      subject,
      html,
      tags: [
        { name: "category", value: "studio_lead_alert" },
        { name: "entity_id", value: job.id },
      ],
    });
  }

  // 3. Password Reset
  if (
    eventType === NOTIFICATION_EVENT_TYPES.PASSWORD_RESET ||
    templateKey === EMAIL_TEMPLATE_KEYS.PASSWORD_RESET
  ) {
    if (!recipient) {
      return { success: false, error: "Missing recipientEmail for password reset" };
    }

    const { subject, html } = renderPasswordResetEmail({
      displayName: (payload.displayName as string) || "Studio Member",
      resetUrl: (payload.resetUrl as string) || "https://ediyrex.com/admin/login",
      expiresInMinutes: (payload.expiresInMinutes as number) || 30,
    });

    return await sendEmail({
      to: recipient,
      subject,
      html,
      tags: [{ name: "category", value: "auth_password_reset" }],
    });
  }

  // 4. Test Notification
  if (templateKey === "test_email" || eventType === "notification.test") {
    const to = recipient || ADMIN_NOTIFICATION_EMAIL;
    const { subject, html } = renderTestEmail(to);

    return await sendEmail({
      to,
      subject,
      html,
      tags: [{ name: "category", value: "infrastructure_test" }],
    });
  }

  return {
    success: false,
    error: `Unsupported notification event type or templateKey: ${eventType} / ${templateKey}`,
  };
}

/**
 * Processes pending or failed outbox jobs with exponential backoff and retry tracking.
 */
export async function processOutboxJobs(limit = 10): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
}> {
  const db = getDb();
  if (!db) {
    return { processed: 0, succeeded: 0, failed: 0 };
  }

  const now = new Date();

  // Find candidate jobs ready for processing
  const jobs = await db
    .select()
    .from(notificationOutbox)
    .where(
      and(
        sql`${notificationOutbox.status} IN ('pending', 'failed')`,
        lte(notificationOutbox.nextRetryAt, now),
        lt(notificationOutbox.attemptCount, notificationOutbox.maxAttempts)
      )
    )
    .orderBy(notificationOutbox.nextRetryAt)
    .limit(limit);

  if (!jobs || jobs.length === 0) {
    return { processed: 0, succeeded: 0, failed: 0 };
  }

  let succeeded = 0;
  let failed = 0;

  for (const job of jobs) {
    // Optimistic lock
    await db
      .update(notificationOutbox)
      .set({
        status: "processing",
        lockedAt: now,
      })
      .where(
        and(
          eq(notificationOutbox.id, job.id),
          sql`${notificationOutbox.status} IN ('pending', 'failed')`
        )
      );

    try {
      const result = await dispatchJobEmail({
        id: job.id,
        eventType: job.eventType,
        payload: (job.payload as Record<string, unknown>) || {},
      });

      if (result.success) {
        await db
          .update(notificationOutbox)
          .set({
            status: "sent",
            deliveredAt: new Date(),
            lastError: null,
            lockedAt: null,
          })
          .where(eq(notificationOutbox.id, job.id));

        succeeded++;
      } else {
        const nextAttempt = job.attemptCount + 1;
        const isDeadLetter = nextAttempt >= job.maxAttempts;
        const backoffMinutes = Math.min(Math.pow(2, nextAttempt), 60);
        const nextRetryAt = new Date(Date.now() + backoffMinutes * 60 * 1000);

        await db
          .update(notificationOutbox)
          .set({
            status: isDeadLetter ? "dead_letter" : "failed",
            attemptCount: nextAttempt,
            nextRetryAt,
            lastError: (result.error || "Unknown delivery failure").slice(0, 255),
            lockedAt: null,
          })
          .where(eq(notificationOutbox.id, job.id));

        failed++;
      }
    } catch (err) {
      const nextAttempt = job.attemptCount + 1;
      const isDeadLetter = nextAttempt >= job.maxAttempts;
      const backoffMinutes = Math.min(Math.pow(2, nextAttempt), 60);

      await db
        .update(notificationOutbox)
        .set({
          status: isDeadLetter ? "dead_letter" : "failed",
          attemptCount: nextAttempt,
          nextRetryAt: new Date(Date.now() + backoffMinutes * 60 * 1000),
          lastError: (err instanceof Error ? err.message : String(err)).slice(
            0,
            255
          ),
          lockedAt: null,
        })
        .where(eq(notificationOutbox.id, job.id));

      failed++;
    }
  }

  return {
    processed: jobs.length,
    succeeded,
    failed,
  };
}

/**
 * Direct email sender for immediate, synchronous actions (e.g. testing credentials).
 */
export async function sendDirectTestEmail(
  toEmail: string
): Promise<EmailSendResult> {
  const { subject, html } = renderTestEmail(toEmail);
  return await sendEmail({
    to: toEmail,
    subject,
    html,
    tags: [{ name: "category", value: "test_verification" }],
  });
}

/**
 * Retrieves aggregate statistics for the admin notifications dashboard.
 */
export async function getOutboxStats(): Promise<{
  total: number;
  pending: number;
  processing: number;
  sent: number;
  failed: number;
  deadLetter: number;
}> {
  const db = getDb();
  if (!db) {
    return {
      total: 0,
      pending: 0,
      processing: 0,
      sent: 0,
      failed: 0,
      deadLetter: 0,
    };
  }

  const results = await db
    .select({
      status: notificationOutbox.status,
      count: count(),
    })
    .from(notificationOutbox)
    .groupBy(notificationOutbox.status);

  let total = 0;
  let pending = 0;
  let processing = 0;
  let sent = 0;
  let failed = 0;
  let deadLetter = 0;

  for (const row of results) {
    const rowCount = Number(row.count) || 0;
    total += rowCount;
    if (row.status === "pending") pending += rowCount;
    else if (row.status === "processing") processing += rowCount;
    else if (row.status === "sent") sent += rowCount;
    else if (row.status === "failed") failed += rowCount;
    else if (row.status === "dead_letter") deadLetter += rowCount;
  }

  return { total, pending, processing, sent, failed, deadLetter };
}

/**
 * Retrieves a list of recent outbox records for the admin view.
 */
export async function listOutboxJobs(options: {
  limit?: number;
  offset?: number;
  status?: string;
}): Promise<any[]> {
  const db = getDb();
  if (!db) return [];

  const { limit = 50, offset = 0, status } = options;

  let query = db
    .select()
    .from(notificationOutbox)
    .orderBy(desc(notificationOutbox.createdAt))
    .limit(limit)
    .offset(offset);

  if (
    status &&
    ["pending", "processing", "sent", "failed", "dead_letter"].includes(status)
  ) {
    return await db
      .select()
      .from(notificationOutbox)
      .where(eq(notificationOutbox.status, status as any))
      .orderBy(desc(notificationOutbox.createdAt))
      .limit(limit)
      .offset(offset);
  }

  return await query;
}

/**
 * Re-queues a failed or dead-letter job for immediate retry.
 */
export async function retryOutboxJob(jobId: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  const result = await db
    .update(notificationOutbox)
    .set({
      status: "pending",
      attemptCount: 0,
      nextRetryAt: new Date(),
      lastError: null,
      lockedAt: null,
    })
    .where(eq(notificationOutbox.id, jobId));

  return true;
}
