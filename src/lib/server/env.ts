export function getRequiredSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === "production") {
    if (!secret || secret.length < 32) {
      throw new Error(
        "SESSION_SECRET must be configured with at least 32 characters in production."
      );
    }
    return secret;
  }

  return (
    secret || "local-dev-fallback-secret-change-in-env-before-production"
  );
}

export function getAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}
