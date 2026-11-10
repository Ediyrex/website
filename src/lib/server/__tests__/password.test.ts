import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../password";

describe("password hashing", () => {
  it("verifies a matching password against scrypt hash", async () => {
    const hash = await hashPassword("Ediyrex!2026Secure");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword("Ediyrex!2026Secure", hash)).toBe(true);
  });

  it("rejects wrong passwords and malformed hashes", async () => {
    const hash = await hashPassword("Ediyrex!2026Secure");
    expect(await verifyPassword("WrongPassword", hash)).toBe(false);
    expect(await verifyPassword("Ediyrex!2026Secure", "invalid-hash")).toBe(
      false
    );
  });
});

