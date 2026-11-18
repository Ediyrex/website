import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  verifyTurnstileToken,
  getTurnstileSecretKey,
} from "../turnstile.service";
import { isValidTokenFormat } from "../turnstile.validation";
import { TURNSTILE_ACTIONS, TURNSTILE_TEST_KEYS } from "../turnstile.constants";

describe("Turnstile Token Format Validation", () => {
  it("accepts valid alphanumeric tokens", () => {
    expect(isValidTokenFormat("0.abcdef1234567890ABCDEF")).toBe(true);
    expect(isValidTokenFormat("0x4AAAAAAAGGcSEQqQMP0s0kfi6auSqqqSxM")).toBe(true);
    expect(isValidTokenFormat("1x0000000000000000000000000000000AA")).toBe(true);
  });

  it("rejects empty, short, or invalid tokens", () => {
    expect(isValidTokenFormat("")).toBe(false);
    expect(isValidTokenFormat("   ")).toBe(false);
    expect(isValidTokenFormat("short")).toBe(false);
    expect(isValidTokenFormat("invalid token with spaces")).toBe(false);
    expect(isValidTokenFormat(null)).toBe(false);
    expect(isValidTokenFormat(undefined)).toBe(false);
  });
});

describe("Turnstile Secret Key Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns configured secret key from environment", () => {
    process.env.TURNSTILE_SECRET_KEY = "test-custom-secret";
    expect(getTurnstileSecretKey()).toBe("test-custom-secret");
  });

  it("falls back to official test secret in test environment", () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    expect(getTurnstileSecretKey()).toBe(TURNSTILE_TEST_KEYS.PASSING_SECRET);
  });
});

describe("Turnstile Verification Service", () => {
  it("rejects requests with missing or empty token", async () => {
    const resEmpty = await verifyTurnstileToken({ token: "" });
    expect(resEmpty.success).toBe(false);
    expect(resEmpty.error).toMatch(/required/i);

    const resNull = await verifyTurnstileToken({ token: null });
    expect(resNull.success).toBe(false);
    expect(resNull.error).toMatch(/required/i);
  });

  it("rejects tokens with invalid format", async () => {
    const res = await verifyTurnstileToken({ token: "not a token!" });
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/format/i);
  });

  it("accepts valid simulated test pass token", async () => {
    const res = await verifyTurnstileToken({
      token: "test-bypass-pass",
      expectedAction: TURNSTILE_ACTIONS.PROJECT_ENQUIRY,
      expectedHostname: "localhost",
    });

    expect(res.success).toBe(true);
    expect(res.action).toBe(TURNSTILE_ACTIONS.PROJECT_ENQUIRY);
    expect(res.hostname).toBe("localhost");
  });

  it("rejects simulated test fail token", async () => {
    const res = await verifyTurnstileToken({
      token: "test-bypass-fail",
      expectedAction: TURNSTILE_ACTIONS.CONTACT_SUBMIT,
    });

    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });

  it("detects and flags action mismatch", async () => {
    const res = await verifyTurnstileToken({
      token: "test-bypass-action-mismatch",
      expectedAction: TURNSTILE_ACTIONS.ADMIN_LOGIN,
    });

    expect(res.success).toBe(false);
    expect(res.error).toMatch(/action mismatch/i);
  });

  it("detects and flags hostname mismatch", async () => {
    const res = await verifyTurnstileToken({
      token: "test-bypass-hostname-mismatch",
      expectedHostname: "ediyrex.com",
    });

    expect(res.success).toBe(false);
    expect(res.error).toMatch(/hostname mismatch/i);
  });
});
