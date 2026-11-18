import { NextRequest } from "next/server";
import { requireAdminRole } from "@/lib/server/session";
import { apiBadRequest, apiOk } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { sendDirectTestEmail } from "@/lib/server/notifications";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin"]);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await request.json().catch(() => ({}));
    const recipientEmail =
      typeof body.recipientEmail === "string" && body.recipientEmail.includes("@")
        ? body.recipientEmail.trim()
        : auth.session.email;

    if (!recipientEmail) {
      return apiBadRequest("Valid recipient email is required");
    }

    const result = await sendDirectTestEmail(recipientEmail);
    if (!result.success) {
      return apiBadRequest(result.error || "Failed to dispatch test email");
    }

    return apiOk({
      success: true,
      messageId: result.messageId,
      recipientEmail,
      isMocked: result.isMocked,
    });
  } catch (error) {
    return handleApiError(error, "POST /api/v1/admin/notifications/test");
  }
}
