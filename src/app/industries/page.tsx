import React from "react";
import type { Metadata } from "next";
import { IndustriesHero } from "@/components/sections/IndustriesPage/IndustriesHero";
import { IndustriesRegister } from "@/components/sections/IndustriesPage/IndustriesRegister";
import { RelevantBlueprints } from "@/components/sections/RelevantBlueprints";
import { IndustriesCTA } from "@/components/sections/IndustriesPage/IndustriesCTA";

export const metadata: Metadata = {
  title: "Industries We Serve — Sector Intelligence | EDYREX Studio",
  description:
    "Explore how EDYREX Studio deploys Branding, Media Production, Digital Engineering, and AI Systems across high-growth industries.",
  alternates: {
    canonical: "/industries",
  },
};

export default function IndustriesPage() {
  return (
    <main className="w-full bg-[#08090B] text-[#F5F2EC] min-h-screen">
      {/* 01. Editorial Manifesto Hero */}
      <IndustriesHero />

      {/* 02. Six-Sector Editorial Register */}
      <IndustriesRegister />

      {/* 03. Relevant Sector Blueprints */}
      <RelevantBlueprints division="all" />

      {/* 04. Custom Domain Engagement CTA */}
      <IndustriesCTA />
    </main>
  );
}
