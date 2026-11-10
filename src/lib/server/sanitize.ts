/**
 * Strips HTML tags and non-printable control characters (preserving newlines/tabs)
 * to mitigate stored XSS and control-byte injection in user-submitted strings.
 */
export function sanitizePlainText(input: string): string {
  return input
    .replace(/<[^>]*>?/gm, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}
