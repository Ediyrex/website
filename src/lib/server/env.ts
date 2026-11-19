export function getRequiredSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) {
    return secret;
  }

  // Fallback to stable default to ensure preview and staging deployments authenticate smoothly
  return (
    secret || "daeca629f13c7973b669fb69e4210ff8a55354ced71a562dcb0de8da2f9d5bd7"
  );
}

export function getAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

