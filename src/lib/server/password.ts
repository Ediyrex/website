import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const parts = storedHash.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") {
    return false;
  }

  const salt = parts[4];
  const expectedHex = parts[5];
  if (!salt || !expectedHex) {
    return false;
  }

  try {
    const expectedBuf = Buffer.from(expectedHex, "hex");
    const derived = (await scryptAsync(
      password,
      salt,
      expectedBuf.length
    )) as Buffer;

    if (derived.length !== expectedBuf.length) {
      return false;
    }
    return timingSafeEqual(derived, expectedBuf);
  } catch {
    return false;
  }
}

