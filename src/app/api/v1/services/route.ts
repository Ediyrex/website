import { getPublishedServices } from "@/lib/server/catalog";
import { apiBadRequest, apiOk } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { servicesQuerySchema } from "@/lib/validations/query";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = servicesQuerySchema.safeParse(
      Object.fromEntries(searchParams.entries())
    );

    if (!parsed.success) {
      return apiBadRequest(
        "Invalid services query parameters.",
        parsed.error.flatten().fieldErrors
      );
    }

    const { division, page, limit } = parsed.data;
    const services = await getPublishedServices(division);
    const total = services.length;
    const offset = (page - 1) * limit;
    const items = services.slice(offset, offset + limit);

    return apiOk(items, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      division: division || "all",
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/services");
  }
}
