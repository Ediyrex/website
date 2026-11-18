import { NextRequest } from "next/server";
import { getCalendarEvents } from "@/lib/server/calendar/calendar-service";
import { getAuthenticatedSession } from "@/lib/server/session";
import { apiOk, apiServerError, apiUnauthorized } from "@/lib/server/api-response";

export async function GET(request: NextRequest) {
  const session = await getAuthenticatedSession();
  if (!session && process.env.NODE_ENV === "production") {
    return apiUnauthorized();
  }

  const { searchParams } = new URL(request.url);
  const startStr = searchParams.get("start");
  const endStr = searchParams.get("end");
  const category = searchParams.get("category") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const accountId = searchParams.get("accountId") ?? undefined;

  const start = startStr ? new Date(startStr) : undefined;
  const end = endStr ? new Date(endStr) : undefined;

  try {
    const events = await getCalendarEvents({
      start,
      end,
      category,
      search,
      accountId,
    });
    return apiOk({ events });
  } catch (error) {
    return apiServerError(
      error instanceof Error ? error.message : "Failed to fetch calendar events"
    );
  }
}
