import React from "react";
import { Hero } from "@/components/sections/Hero";
import { StudioPositioningBar } from "@/components/sections/StudioPositioningBar";
import { CountUpStatsSection } from "@/components/sections/CountUpStatsSection";
import { ThreeDivisionsSection } from "@/components/sections/ThreeDivisionsSection";
import { BentoBuildSection } from "@/components/sections/BentoBuildSection";
import { FeaturedWorkSection } from "@/components/sections/FeaturedWorkSection";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { HybridModelSection } from "@/components/sections/HybridModelSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { EngagementSection } from "@/components/sections/EngagementSection";
import { UsVsThemSection } from "@/components/sections/UsVsThemSection";
import { ReviewShuffleSection } from "@/components/sections/ReviewShuffleSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { ActivityPings } from "@/components/sections/ActivityPings";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StudioPositioningBar />
      <CountUpStatsSection />
      <ThreeDivisionsSection />
      <BentoBuildSection />
      <FeaturedWorkSection />
      <BeforeAfterSection />
      <HybridModelSection />
      <ProcessSection />
      <EngagementSection />
      <UsVsThemSection />
      <ReviewShuffleSection />
      <FaqSection />
      <FinalCtaSection />
      <ActivityPings />
    </>
  );
}
