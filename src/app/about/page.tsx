import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/AboutPage/AboutHero";
import { PhilosophySection } from "@/components/sections/AboutPage/PhilosophySection/PhilosophySection";
import { HybridModelSection } from "@/components/sections/HybridModelSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

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
      <PhilosophySection />
      <HybridModelSection />
      <TrustSection />
      <FinalCtaSection />
    </div>
  );
}
