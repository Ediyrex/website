import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/server/catalog";
import { WorkHero } from "@/components/sections/WorkPage/WorkHero";
import { WorkShowcase } from "@/components/sections/WorkPage/WorkShowcase";
import { StudioExplorations } from "@/components/sections/WorkPage/StudioExplorations";
import { WorkCTA } from "@/components/sections/WorkPage/WorkCTA";

export const instant = false;

export const metadata: Metadata = {
  title: "Selected Work — Commercial Media, Software & AI Systems",
  description:
    "Explore case studies and live projects delivered by EDYREX Studio across visual storytelling, digital platforms, and intelligent automation systems.",
  alternates: {
    canonical: "/work",
  },
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="bg-[#0C0D0F]">
      <WorkHero projects={projects} />
      <WorkShowcase projects={projects} />
      <StudioExplorations projects={projects} />
      <WorkCTA />
    </div>
  );
}
