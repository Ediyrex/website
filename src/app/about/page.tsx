import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/AboutPage/AboutHero";
import { WhyEdiyrexSection } from "@/components/sections/AboutPage/WhyEdiyrexSection";
import { PhilosophySection } from "@/components/sections/AboutPage/PhilosophySection/PhilosophySection";
import { BrandStorySection } from "@/components/sections/AboutPage/BrandStorySection";
import { WhoWeServeSection } from "@/components/sections/AboutPage/WhoWeServeSection";
import { HumanElementSection } from "@/components/sections/AboutPage/HumanElementSection";
import { StudioCommitmentsSection } from "@/components/sections/AboutPage/StudioCommitmentsSection";
import { AboutNextStep } from "@/components/sections/AboutPage/AboutNextStep";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Ediyrex Studio: an independent creative technology studio uniting Media, Digital, and Artificial Intelligence.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#08090B]">
      <AboutHero />
      <WhyEdiyrexSection />
      <PhilosophySection />
      <BrandStorySection />
      <WhoWeServeSection />
      <HumanElementSection />
      <StudioCommitmentsSection />
      <AboutNextStep />
    </div>
  );
}
