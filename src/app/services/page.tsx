import type { Metadata } from "next";
import { ServicesHeroSection } from "@/components/sections/ServicesHeroSection";
import { ServicesDirectory } from "@/components/sections/ServicesDirectory/ServicesDirectory";
import { FAQSection } from "@/components/sections/FAQSection/FAQSection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Ediyrex Studio's 35 capabilities across four integrated divisions: Branding & Marketing, Media & Content Production, Web, Apps & Digital Products, and AI & Automation.",
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
