import { NextResponse, type NextRequest } from "next/server";
import { PROJECTS_DATA } from "@/features/work/data";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/v1/projects/[slug]">
) {
  const { slug } = await ctx.params;
  const project = PROJECTS_DATA.find(
    (p) => p.slug === slug && p.isPublished
  );

  if (!project) {
    return NextResponse.json(
      {
        error: "Not Found",
        message: "Requested project case study was not found.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: project,
  });
}

