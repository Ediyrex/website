import { NextResponse } from "next/server";
import { PROJECTS_DATA } from "@/features/work/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  let projects = PROJECTS_DATA.filter((p) => p.isPublished);

  if (category && ["media", "digital", "ai", "hybrid"].includes(category)) {
    projects = projects.filter((p) => p.category === category);
  }

  if (featured === "true") {
    projects = projects.filter((p) => p.featured);
  }

  return NextResponse.json({
    data: projects,
    meta: {
      total: projects.length,
      category: category || "all",
    },
  });
}

