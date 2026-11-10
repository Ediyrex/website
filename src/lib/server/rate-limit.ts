interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Sliding-window in-memory rate limiter for local & single-instance routes.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
  nowMs = Date.now()
): RateLimitResult {
  const windowStart = nowMs - windowMs;
  const existing = store.get(key);
  const active = existing
    ? existing.timestamps.filter((ts) => ts > windowStart)
    : [];

  if (active.length >= maxRequests) {
    const oldest = active[0];
    const retryAfterMs = Math.max(1000, oldest + windowMs - nowMs);
    store.set(key, { timestamps: active });
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  active.push(nowMs);
  store.set(key, { timestamps: active });

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - active.length),
    retryAfterSeconds: 0,
  };
}

export function resetRateLimitStore(): void {
  store.clear();
}

