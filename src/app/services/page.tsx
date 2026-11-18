import type { Metadata } from "next";
import { ServicesHeroSection } from "@/components/sections/ServicesHeroSection";
import { ServicesDirectory } from "@/components/sections/ServicesDirectory/ServicesDirectory";
import { FAQSection } from "@/components/sections/FAQSection/FAQSection";

export const metadata: Metadata = {
  title: "Services — 35 Capabilities Across 4 Integrated Divisions",
  description:
    "Explore EDYREX Studio's full spectrum of capabilities across Branding & Marketing, Media & Production, Web & Digital Products, and AI & Automation.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <div className="bg-[#08090B]">
      <ServicesHeroSection />
      <ServicesDirectory />
      <FAQSection />
    </div>
  );
}
