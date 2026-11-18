import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { getRequiredSessionSecret } from "./env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 12 bytes standard for GCM

/**
 * Derives a 32-byte key from the session secret using SHA-256.
 */
function deriveKey(): Buffer {
  const secret = getRequiredSessionSecret();
  return createHash("sha256").update(secret).digest();
}

/**
 * Encrypts a plaintext string (e.g. OAuth refresh token) using AES-256-GCM.
 * Output format: `ivHex:authTagHex:ciphertextHex`
 */
export function encryptSecret(plaintext: string): string {
  if (!plaintext) return "";

  const key = deriveKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts a previously encrypted secret.
 */
export function decryptSecret(encryptedPayload: string): string {
  if (!encryptedPayload) return "";

  const parts = encryptedPayload.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted payload format");
  }

  const [ivHex, authTagHex, ciphertextHex] = parts;
  const key = deriveKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export const encryptToken = encryptSecret;
export const decryptToken = decryptSecret;
