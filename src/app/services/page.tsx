import type { Metadata } from "next";
import { ServicesHeroSection } from "@/components/sections/ServicesHeroSection";
import { ServicesDirectory } from "@/components/sections/ServicesDirectory/ServicesDirectory";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Ediyrex Studio's four integrated divisions: Branding / Marketing, Media, Web Dev, and Agents & Automation.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <div className="bg-[#08090B]">
      <ServicesHeroSection />
      <ServicesDirectory />
      <FaqSection />
      <FinalCtaSection />
    </div>
  );
}
