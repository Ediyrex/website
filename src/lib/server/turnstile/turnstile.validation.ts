import { z } from "zod";

/**
 * Validates the basic structural format of a Turnstile response token.
 * Turnstile tokens are base64/hex-like alphanumeric strings.
 */
export const turnstileTokenSchema = z
  .string()
  .trim()
  .min(10, "Turnstile token is too short or missing")
  .max(4096, "Turnstile token exceeds maximum length")
  .regex(/^[A-Za-z0-9._-]+$/, "Turnstile token contains invalid characters");

/**
 * Helper to check if a token is syntactically valid before sending to Cloudflare.
 */
export function isValidTokenFormat(token: unknown): token is string {
  if (typeof token !== "string") return false;
  return turnstileTokenSchema.safeParse(token).success;
}
