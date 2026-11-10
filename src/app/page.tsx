import React from "react";
import { Hero } from "@/components/sections/Hero";
import { StudioPositioningBar } from "@/components/sections/StudioPositioningBar";
import { ThreeDivisionsSection } from "@/components/sections/ThreeDivisionsSection";
import { FeaturedWorkSection } from "@/components/sections/FeaturedWorkSection";
import { HybridModelSection } from "@/components/sections/HybridModelSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { EngagementSection } from "@/components/sections/EngagementSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StudioPositioningBar />
      <ThreeDivisionsSection />
      <FeaturedWorkSection />
      <HybridModelSection />
      <ProcessSection />
      <EngagementSection />
      <TrustSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
