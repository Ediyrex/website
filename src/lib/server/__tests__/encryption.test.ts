import { describe, it, expect } from "vitest";
import { encryptSecret, decryptSecret } from "../encryption";

describe("Token Encryption & Decryption (AES-256-GCM)", () => {
  it("encrypts and decrypts a refresh token accurately", () => {
    const rawToken = "1//04example_google_oauth_refresh_token_xyz_987654321";
    const encrypted = encryptSecret(rawToken);

    expect(encrypted).not.toBe(rawToken);
    expect(encrypted.split(":")).toHaveLength(3);

    const decrypted = decryptSecret(encrypted);
    expect(decrypted).toBe(rawToken);
  });

  it("produces non-deterministic ciphertexts for the same plaintext due to random IV", () => {
    const token = "secret_token_12345";
    const enc1 = encryptSecret(token);
    const enc2 = encryptSecret(token);

    expect(enc1).not.toBe(enc2);
    expect(decryptSecret(enc1)).toBe(token);
    expect(decryptSecret(enc2)).toBe(token);
  });

  it("throws on malformed encrypted payload", () => {
    expect(() => decryptSecret("invalid:payload")).toThrow(
      "Invalid encrypted payload format"
    );
  });
});
