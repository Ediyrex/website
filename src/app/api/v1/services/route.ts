import { unstable_rethrow } from "next/navigation";
import { getPublishedServices } from "@/lib/server/catalog";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { logger } from "@/lib/server/logger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const division = searchParams.get("division") || undefined;

    const services = await getPublishedServices(division);

    return apiOk(services, {
      total: services.length,
      division: division || "all",
    });
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to load published services");
    return apiServerError("Unable to load services.");
  }
}
