import React from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";

export const metadata: Metadata = {
  title: {
    absolute: "Ediyrex Studio — Branding, Media, Web Dev & AI Agents",
  },
  description:
    "Independent creative technology studio uniting branding & marketing, media editing & motion, web dev & DADV dashboards, and AI agents & n8n automation.",
  alternates: {
    canonical: "/",
  },
};
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
