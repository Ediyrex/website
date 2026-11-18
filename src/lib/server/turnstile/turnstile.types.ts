import type { TurnstileAction } from "./turnstile.constants";

export interface CloudflareVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

export interface VerifyTurnstileOptions {
  token: string | null | undefined;
  expectedAction?: TurnstileAction | string;
  expectedHostname?: string;
  remoteIp?: string;
  idempotencyKey?: string;
}

export interface TurnstileVerificationResult {
  success: boolean;
  error?: string;
  errorCodes?: string[];
  hostname?: string;
  action?: string;
  challengeTimestamp?: string;
  isMocked?: boolean;
}
