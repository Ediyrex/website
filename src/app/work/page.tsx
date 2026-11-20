import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/server/catalog";
import { WorkHero } from "@/components/sections/WorkPage/WorkHero";
import { WorkShowcase } from "@/components/sections/WorkPage/WorkShowcase";
import { WorkCTA } from "@/components/sections/WorkPage/WorkCTA";

export const instant = false;

export const metadata: Metadata = {
  title: "Work & Case Studies",
  description:
    "An evolving collection of digital products, creative work, and intelligent systems by Ediyrex Studio.",
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
      <WorkCTA />
    </div>
  );
}
