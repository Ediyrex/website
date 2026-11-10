import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ThreeDivisionsSection } from "@/components/sections/ThreeDivisionsSection";
import { ServiceDivisionTabs } from "@/components/sections/ServiceDivisionTabs";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Ediyrex Studio's integrated capabilities across Media, Digital, and Artificial Intelligence.",
};

export default function ServicesPage() {
  return (
    <div className="bg-[#08090B]">
      {/* Page Hero */}
      <section
        className="pt-36 pb-20 border-b border-[#252A32]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 65% 55% at 50% 20%, #29241B 0%, #08090B 72%)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-6">
            <Badge variant="accent">Capabilities</Badge>
            <h1 className="font-heading font-bold tracking-tight text-[#F5F3EE] text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.06]">
              Three Disciplines. One Integrated Studio.
            </h1>
            <p className="text-base sm:text-lg text-[#B2B4BA] leading-relaxed">
              Great software stalls without compelling visual storytelling, and strong creative campaigns bottleneck without automated systems. Ediyrex unites Media, Digital, and AI under one roof.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button href="/contact" variant="primary" size="lg">
                <span>Book a discovery call</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
              <Button href="/work" variant="secondary" size="lg">
                <span>Explore selected work</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ThreeDivisionsSection />
      <ServiceDivisionTabs />
      <ProcessSection />
      <FaqSection />
      <FinalCtaSection />
    </div>
  );
}
