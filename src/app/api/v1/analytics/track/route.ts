import { NextRequest } from "next/server";
import { recordRealtimeVisit } from "@/lib/server/realtime-analytics";
import { apiOk, apiBadRequest } from "@/lib/server/api-response";

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json") || contentType.includes("text/plain")) {
      try {
        const text = await req.text();
        if (text) {
          body = JSON.parse(text);
        }
      } catch {
        // quiet
      }
    }

    const path = typeof body.path === "string" ? body.path : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer : req.headers.get("referer") || null;
    const userAgent = req.headers.get("user-agent") || "";

    let device: "Desktop" | "Mobile" | "Tablet" = "Desktop";
    if (/mobile/i.test(userAgent)) device = "Mobile";
    else if (/tablet|ipad/i.test(userAgent)) device = "Tablet";
    else if (body.device === "Mobile" || body.device === "Tablet") device = body.device;

    const country =
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-vercel-ip-country") ||
      "Direct Visitor";

    const { activeUsersNow } = await recordRealtimeVisit({
      path,
      referrer,
      device,
      country,
      sessionId: typeof body.sessionId === "string" ? body.sessionId : undefined,
    });

    return apiOk({
      tracked: true,
      path,
      activeUsersNow,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return apiOk({ tracked: false, error: "Tracking error handled safely" });
  }
}

export async function GET() {
  return apiOk({ status: "Realtime analytics listener online" });
}
