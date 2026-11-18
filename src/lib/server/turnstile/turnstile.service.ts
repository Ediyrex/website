import {
  TURNSTILE_VERIFY_ENDPOINT,
  TURNSTILE_TIMEOUT_MS,
  TURNSTILE_TEST_KEYS,
} from "./turnstile.constants";
import type {
  CloudflareVerifyResponse,
  VerifyTurnstileOptions,
  TurnstileVerificationResult,
} from "./turnstile.types";
import { isValidTokenFormat } from "./turnstile.validation";
import { logger } from "@/lib/server/logger";

/**
 * Returns the configured Turnstile secret key, or test secret key if in test env.
 */
export function getTurnstileSecretKey(): string {
  const envSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (envSecret) return envSecret;

  if (process.env.NODE_ENV === "test") {
    return TURNSTILE_TEST_KEYS.PASSING_SECRET;
  }

  return "";
}

/**
 * Reusable server-side Turnstile verification service.
 * Verifies the token against Cloudflare's Siteverify endpoint.
 */
export async function verifyTurnstileToken(
  options: VerifyTurnstileOptions
): Promise<TurnstileVerificationResult> {
  const { token, expectedAction, expectedHostname, remoteIp, idempotencyKey } =
    options;

  // 1. Check for token presence
  if (!token || typeof token !== "string" || !token.trim()) {
    return {
      success: false,
      error: "Bot protection verification token is required.",
    };
  }

  const trimmedToken = token.trim();

  // 2. Automated test / simulated bypass support for unit tests
  if (process.env.NODE_ENV === "test") {
    if (trimmedToken === "test-bypass-pass") {
      return {
        success: true,
        action: expectedAction,
        hostname: expectedHostname || "localhost",
        isMocked: true,
      };
    }
    if (trimmedToken === "test-bypass-fail") {
      return {
        success: false,
        error: "Verification failed (simulated test rejection).",
        errorCodes: ["invalid-input-response"],
      };
    }
    if (trimmedToken === "test-bypass-action-mismatch") {
      return {
        success: false,
        error: "Verification failed: security action mismatch.",
        action: "wrong_action",
      };
    }
    if (trimmedToken === "test-bypass-hostname-mismatch") {
      return {
        success: false,
        error: "Verification failed: security hostname mismatch.",
        hostname: "unauthorized-domain.com",
      };
    }
  }

  // 3. Validate token format
  if (!isValidTokenFormat(trimmedToken)) {
    logger.warn("Turnstile token failed format validation");
    return {
      success: false,
      error: "Invalid bot protection token format. Please retry.",
    };
  }

  // 4. Retrieve secret key
  const secretKey = getTurnstileSecretKey();
  if (!secretKey) {
    if (process.env.NODE_ENV === "development") {
      logger.warn(
        "TURNSTILE_SECRET_KEY is not configured. Allowing development bypass."
      );
      return {
        success: true,
        isMocked: true,
        action: expectedAction,
        hostname: "localhost",
      };
    }

    logger.error("TURNSTILE_SECRET_KEY is missing on production server");
    return {
      success: false,
      error: "Bot protection configuration is incomplete.",
    };
  }

  // 5. Send verification request to Cloudflare
  const formData = new URLSearchParams();
  formData.append("secret", secretKey);
  formData.append("response", trimmedToken);
  if (remoteIp && remoteIp !== "local") {
    formData.append("remoteip", remoteIp);
  }
  if (idempotencyKey) {
    formData.append("idempotency_key", idempotencyKey);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS);

  try {
    const response = await fetch(TURNSTILE_VERIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.error(
        { status: response.status, statusText: response.statusText },
        "Cloudflare Turnstile verify endpoint responded with non-200"
      );
      return {
        success: false,
        error: "Unable to verify bot challenge. Please refresh and retry.",
      };
    }

    const data = (await response.json()) as CloudflareVerifyResponse;

    if (!data.success) {
      const errorCodes = data["error-codes"] || [];
      logger.warn(
        { errorCodes, action: data.action, hostname: data.hostname },
        "Turnstile token verification rejected by Cloudflare"
      );

      let userError = "Verification challenge failed. Please try again.";
      if (errorCodes.includes("timeout-or-duplicate")) {
        userError = "Verification token expired or already used. Please refresh.";
      } else if (errorCodes.includes("invalid-input-response")) {
        userError = "Verification response invalid. Please complete the challenge.";
      }

      return {
        success: false,
        error: userError,
        errorCodes,
      };
    }

    // 6. Action-based validation (Section 7)
    if (expectedAction && data.action && data.action !== expectedAction) {
      logger.warn(
        { expected: expectedAction, received: data.action },
        "Turnstile action mismatch detected"
      );
      return {
        success: false,
        error: "Verification failed: security action mismatch.",
        action: data.action,
      };
    }

    // 7. Hostname validation (if specified and not localhost in development)
    if (
      expectedHostname &&
      data.hostname &&
      data.hostname !== expectedHostname &&
      data.hostname !== "localhost" &&
      data.hostname !== "127.0.0.1"
    ) {
      logger.warn(
        { expected: expectedHostname, received: data.hostname },
        "Turnstile hostname mismatch detected"
      );
      return {
        success: false,
        error: "Verification failed: unauthorized origin.",
        hostname: data.hostname,
      };
    }

    return {
      success: true,
      hostname: data.hostname,
      action: data.action,
      challengeTimestamp: data.challenge_ts,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      logger.error("Turnstile verification request timed out");
      return {
        success: false,
        error: "Bot protection verification timed out. Please try again.",
      };
    }

    logger.error({ error }, "Exception during Turnstile token verification");
    return {
      success: false,
      error: "An unexpected error occurred during security verification.",
    };
  }
}
