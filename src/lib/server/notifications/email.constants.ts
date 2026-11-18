/**
 * Central Resend Email & Notification Constants
 */

export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "EDYREX Studio <onboarding@resend.dev>";

export const DEFAULT_REPLY_TO =
  process.env.RESEND_REPLY_TO || "ediyrex@gmail.com";

export const ADMIN_NOTIFICATION_EMAIL =
  process.env.EDYREX_ADMIN_NOTIFICATION_EMAIL || "ediyrex@gmail.com";

export const NOTIFICATION_EVENT_TYPES = {
  ENQUIRY_SUBMITTED: "enquiry.submitted",
  ENQUIRY_STUDIO_ALERT: "enquiry.submitted.studio_alert",
  DISCOVERY_CALL_BOOKED: "booking.discovery_call",
  PROJECT_KICKOFF: "project.kickoff",
  PROJECT_MILESTONE: "project.milestone",
  PROJECT_DELIVERED: "project.delivered",
  PASSWORD_RESET: "auth.password_reset",
  TEAM_INVITATION: "auth.team_invitation",
} as const;

export const EMAIL_TEMPLATE_KEYS = {
  ENQUIRY_RECEIVED: "enquiry_received",
  NEW_ENQUIRY_ADMIN: "new_enquiry_admin",
  DISCOVERY_CALL_CONFIRMED: "discovery_call_confirmed",
  PROJECT_UPDATE: "project_update",
  PASSWORD_RESET: "password_reset",
  TEAM_INVITATION: "team_invitation",
} as const;

export const EMAIL_THEME = {
  bg: "#08090B",
  cardBg: "#12151A",
  textPrimary: "#F5F3EE",
  textSecondary: "#B2B4BA",
  textMuted: "#777D87",
  accentGold: "#D6B77A",
  accentOrange: "#F06419",
  border: "#252A32",
} as const;
