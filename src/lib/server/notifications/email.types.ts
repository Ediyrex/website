import type { EMAIL_TEMPLATE_KEYS, NOTIFICATION_EVENT_TYPES } from "./email.constants";

export type EmailTemplateKey =
  (typeof EMAIL_TEMPLATE_KEYS)[keyof typeof EMAIL_TEMPLATE_KEYS];

export type NotificationEventType =
  (typeof NOTIFICATION_EVENT_TYPES)[keyof typeof NOTIFICATION_EVENT_TYPES];

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
  headers?: Record<string, string>;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  isMocked?: boolean;
}

export interface NotificationJobData {
  eventType: string;
  entityType: string;
  entityId: string;
  dedupeKey?: string;
  recipientEmail?: string;
  templateKey: EmailTemplateKey | string;
  payload: Record<string, unknown>;
}

export interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    created_at: string;
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    status?: string;
  };
}
