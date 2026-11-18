import { Resend } from "resend";
import {
  DEFAULT_FROM_EMAIL,
  DEFAULT_REPLY_TO,
} from "./email.constants";
import type { SendEmailOptions, EmailSendResult } from "./email.types";
import { logger } from "@/lib/server/logger";

let resendInstance: Resend | null = null;

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

/**
 * Strips HTML tags to produce a clean plain-text fallback.
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<[^>]+>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\n\s+\n/g, "\n\n")
    .trim();
}

/**
 * Sends a transactional email through Resend.
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<EmailSendResult> {
  const {
    to,
    subject,
    html,
    text,
    from = DEFAULT_FROM_EMAIL,
    replyTo = DEFAULT_REPLY_TO,
    tags,
    headers,
  } = options;

  const resend = getResendClient();

  // Test / simulated environment bypass
  if (!resend || process.env.NODE_ENV === "test") {
    logger.info(
      { to, subject, isMocked: true },
      "Simulated transactional email delivery (test/offline mode)"
    );
    return {
      success: true,
      messageId: `msg_mock_${Date.now()}`,
      isMocked: true,
    };
  }

  const plainText = text || htmlToPlainText(html);

  try {
    const payload: {
      from: string;
      to: string | string[];
      subject: string;
      html: string;
      text: string;
      replyTo?: string;
      tags?: { name: string; value: string }[];
      headers?: Record<string, string>;
    } = {
      from,
      to,
      subject,
      html,
      text: plainText,
      replyTo,
    };

    if (tags && tags.length > 0) {
      payload.tags = tags;
    }
    if (headers) {
      payload.headers = headers;
    }

    const { data, error } = await resend.emails.send(payload as any);

    if (error) {
      logger.error({ error, to, subject }, "Resend API returned error");
      return {
        success: false,
        error: error.message || "Failed to send email via Resend",
      };
    }

    logger.info({ messageId: data?.id, to, subject }, "Email delivered to Resend");
    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    logger.error({ error, to, subject }, "Unexpected exception while calling Resend");
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown email dispatch error",
    };
  }
}
