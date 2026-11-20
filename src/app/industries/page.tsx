import React from "react";
import type { Metadata } from "next";
import { IndustriesHero } from "@/components/sections/IndustriesPage/IndustriesHero";
import { SectorIntelligence } from "@/components/sections/IndustriesPage/SectorIntelligence";
import { IndustriesRegister } from "@/components/sections/IndustriesPage/IndustriesRegister";
import { RelevantBlueprints } from "@/components/sections/RelevantBlueprints";
import { IndustriesCTA } from "@/components/sections/IndustriesPage/IndustriesCTA";
import {
  getPublishedIndustries,
  getPublishedSectorArchitectures,
} from "@/lib/server/catalog";

export const metadata: Metadata = {
  title: "Industries We Serve — Sector Intelligence | EDYREX Studio",
  description:
    "Explore how EDYREX Studio deploys Branding, Media Production, Digital Engineering, and AI Systems across high-growth industries.",
  alternates: {
    canonical: "/industries",
  },
};

export default async function IndustriesPage() {
  const [sectors, sectorArchitectures] = await Promise.all([
    getPublishedIndustries(),
    getPublishedSectorArchitectures(),
  ]);

  return (
    <main className="w-full bg-[#08090B] text-[#F5F2EC] min-h-screen">
      {/* Section 01: Editorial Industry Index Hero */}
      <IndustriesHero sectors={sectors} />

      {/* Section 02: Sector Intelligence & Featured Sector Architectures */}
      <SectorIntelligence sectors={sectorArchitectures} />

      {/* Section 03: Full Industry Directory Register */}
      <IndustriesRegister sectors={sectors} />

      {/* Section 04: Relevant Sector Blueprints */}
      <RelevantBlueprints division="all" />

      {/* Section 05: Custom Domain Engagement CTA */}
      <IndustriesCTA />
    </main>
  );
}
