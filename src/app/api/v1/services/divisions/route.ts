import { apiOk } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { getPublishedDivisions } from "@/lib/server/catalog";

export async function GET() {
  try {
    const divisions = await getPublishedDivisions();
    return apiOk(divisions);
  } catch (err) {
    return handleApiError(err, "GET /api/v1/services/divisions");
  }
}

