import { NextRequest } from "next/server";
import {
  getCalendars,
  setCalendarSelection,
  syncCalendarsForAccount,
} from "@/lib/server/calendar/calendar-service";
import { getAuthenticatedSession } from "@/lib/server/session";
import { apiBadRequest, apiOk, apiServerError, apiUnauthorized } from "@/lib/server/api-response";

export async function GET(request: NextRequest) {
  const session = await getAuthenticatedSession();
  if (!session && process.env.NODE_ENV === "production") {
    return apiUnauthorized();
  }

  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("accountId") ?? undefined;

  try {
    const calendars = await getCalendars(accountId);
    return apiOk({ calendars });
  } catch (error) {
    return apiServerError(
      error instanceof Error ? error.message : "Failed to fetch calendars"
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getAuthenticatedSession();
  if (!session && process.env.NODE_ENV === "production") {
    return apiUnauthorized();
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { calendarId, isSelected, syncAccountId } = body;

    if (syncAccountId) {
      const refreshed = await syncCalendarsForAccount(syncAccountId);
      return apiOk({ calendars: refreshed });
    }

    if (!calendarId || typeof isSelected !== "boolean") {
      return apiBadRequest("calendarId and boolean isSelected are required");
    }

    await setCalendarSelection(calendarId, isSelected);
    return apiOk({ success: true });
  } catch (error) {
    return apiServerError(
      error instanceof Error ? error.message : "Failed to update calendar"
    );
  }
}
