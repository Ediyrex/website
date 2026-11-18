import { NextResponse } from "next/server";
import { getConnectedAccounts } from "@/lib/server/calendar/calendar-service";
import { getAuthenticatedSession } from "@/lib/server/session";
import { apiOk, apiUnauthorized } from "@/lib/server/api-response";

export async function GET() {
  const session = await getAuthenticatedSession();
  if (!session && process.env.NODE_ENV === "production") {
    return apiUnauthorized();
  }

  try {
    const accounts = await getConnectedAccounts();
    return apiOk({ accounts });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}
