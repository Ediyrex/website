/**
 * Cloudflare Turnstile Configuration & Constants
 */

export const TURNSTILE_VERIFY_ENDPOINT =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Cloudflare Official Testing Keys
 * Always passes: 1x0000000000000000000000000000000AA
 * Always fails:  2x0000000000000000000000000000000AB
 * Yields interactive challenge: 3x0000000000000000000000000000000AA
 */
export const TURNSTILE_TEST_KEYS = {
  PASSING_SECRET: "1x0000000000000000000000000000000AA",
  PASSING_SITEKEY: "1x00000000000000000000AA",
  FAILING_SECRET: "2x0000000000000000000000000000000AB",
  FAILING_SITEKEY: "2x00000000000000000000AB",
} as const;

/**
 * Standard Application Actions
 */
export const TURNSTILE_ACTIONS = {
  CONTACT_SUBMIT: "contact_submit",
  PROJECT_ENQUIRY: "project_enquiry",
  QUOTE_REQUEST: "quote_request",
  NEWSLETTER_SIGNUP: "newsletter_signup",
  ADMIN_LOGIN: "admin_login",
  PASSWORD_RECOVERY: "password_recovery",
  FILE_UPLOAD_INIT: "file_upload_init",
  PUBLIC_AI_REQUEST: "public_ai_request",
} as const;

export type TurnstileAction =
  (typeof TURNSTILE_ACTIONS)[keyof typeof TURNSTILE_ACTIONS];

export const TURNSTILE_TIMEOUT_MS = 6000;
