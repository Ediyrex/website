import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimitStore } from "../rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it("allows requests within quota and blocks once exceeded", () => {
    const key = "enquiries:test-ip";
    const windowMs = 60_000;

    expect(checkRateLimit(key, 2, windowMs, 1000).allowed).toBe(true);
    expect(checkRateLimit(key, 2, windowMs, 2000).allowed).toBe(true);

    const blocked = checkRateLimit(key, 2, windowMs, 3000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("allows requests again after the sliding window expires", () => {
    const key = "enquiries:window-reset";
    const windowMs = 10_000;

    expect(checkRateLimit(key, 1, windowMs, 1000).allowed).toBe(true);
    expect(checkRateLimit(key, 1, windowMs, 5000).allowed).toBe(false);
    expect(checkRateLimit(key, 1, windowMs, 12000).allowed).toBe(true);
  });
});

