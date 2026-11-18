import { NextResponse, type NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { logger } from "@/lib/server/logger";
import type { ResendWebhookEvent } from "@/lib/server/notifications/email.types";

/**
 * Validates Svix HMAC-SHA256 signature used by Resend webhooks.
 */
function verifyWebhookSignature(
  rawBody: string,
  secret: string,
  svixId: string | null,
  svixTimestamp: string | null,
  svixSignature: string | null
): boolean {
  if (!svixId || !svixTimestamp || !svixSignature) {
    return false;
  }

  // Prevent replay attacks (allow 5 min tolerance)
  const timestampSec = parseInt(svixTimestamp, 10);
  const nowSec = Math.floor(Date.now() / 1000);
  if (isNaN(timestampSec) || Math.abs(nowSec - timestampSec) > 300) {
    return false;
  }

  // Svix secret can be formatted as "whsec_..."
  const cleanSecret = secret.startsWith("whsec_")
    ? Buffer.from(secret.slice(6), "base64")
    : Buffer.from(secret, "utf-8");

  const toSign = `${svixId}.${svixTimestamp}.${rawBody}`;
  const expectedHmac = createHmac("sha256", cleanSecret)
    .update(toSign)
    .digest("base64");

  // Signatures header may contain multiple space-delimited signatures like "v1,signature1 v1,signature2"
  const passedSignatures = svixSignature.split(" ");
  for (const sig of passedSignatures) {
    const [version, signature] = sig.split(",");
    if (version === "v1" && signature) {
      const sigBuf = Buffer.from(signature, "base64");
      const expBuf = Buffer.from(expectedHmac, "base64");
      if (sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf)) {
        return true;
      }
    }
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();

    if (webhookSecret) {
      const svixId = req.headers.get("svix-id");
      const svixTimestamp = req.headers.get("svix-timestamp");
      const svixSignature = req.headers.get("svix-signature");

      const isValid = verifyWebhookSignature(
        rawBody,
        webhookSecret,
        svixId,
        svixTimestamp,
        svixSignature
      );

      if (!isValid) {
        logger.warn({ svixId }, "Invalid Resend webhook signature");
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 401 }
        );
      }
    }

    let payload: ResendWebhookEvent;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { type, data } = payload;

    logger.info(
      {
        eventType: type,
        emailId: data?.email_id,
        to: data?.to,
        subject: data?.subject,
      },
      "Resend webhook event received"
    );

    switch (type) {
      case "email.delivered":
        logger.info(
          { emailId: data.email_id, to: data.to },
          "Email confirmed delivered by Resend"
        );
        break;

      case "email.bounced":
        logger.error(
          { emailId: data.email_id, to: data.to, subject: data.subject },
          "Resend delivery bounced"
        );
        break;

      case "email.complained":
        logger.warn(
          { emailId: data.email_id, to: data.to },
          "Recipient spam complaint reported via Resend"
        );
        break;

      case "email.delivery_delayed":
        logger.warn(
          { emailId: data.email_id, to: data.to },
          "Resend delivery delayed"
        );
        break;

      default:
        // Other events (opened, clicked, sent) logged for observability
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    logger.error({ error }, "Error processing Resend webhook");
    return NextResponse.json(
      { error: "Internal webhook processing error" },
      { status: 500 }
    );
  }
}
