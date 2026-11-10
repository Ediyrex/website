import React from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";

export const metadata: Metadata = {
  title: "Ediyrex Studio — Creative Technology, Media, Digital & AI",
  description:
    "Independent creative technology studio uniting commercial media production, digital experiences, and intelligent AI systems. Book a discovery call.",
};
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
