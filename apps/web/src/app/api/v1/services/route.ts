import { NextResponse } from "next/server";
import { SERVICES_DATA } from "@/features/services/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const division = searchParams.get("division");

  let services = SERVICES_DATA.filter((s) => s.isPublished);

  if (division && ["media", "digital", "ai"].includes(division)) {
    services = services.filter((s) => s.division === division);
  }

  return NextResponse.json({
    data: services,
    meta: {
      total: services.length,
      division: division || "all",
    },
  });
}
