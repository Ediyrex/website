import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { WorkGallery } from "@/components/sections/WorkGallery";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

export const metadata: Metadata = {
  title: "Work & Case Studies",
  description:
    "Selected blueprints, explorations, and case studies across Media, Digital, and AI by Ediyrex Studio.",
  alternates: {
    canonical: "/work",
  },
};

export default function WorkPage() {
  return (
    <div className="bg-[#08090B] min-h-screen">
      <section className="pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-5">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Work & Case Studies" },
              ]}
            />
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="accent">Portfolio &amp; Case Studies</Badge>
              <Badge variant="concept">
                <AlertCircle className="w-3 h-3" />
                <span>Concept work clearly labeled</span>
              </Badge>
            </div>
            <h1 className="font-heading font-bold tracking-tight text-[#F5F3EE] text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.06]">
              Selected work &amp; studio explorations
            </h1>
            <p className="text-sm sm:text-base text-[#B2B4BA] leading-relaxed">
              Every case study breaks down the architectural challenge, execution approach, and tangible deliverables. Independent R&amp;D explorations are explicitly labeled as{" "}
              <span className="text-[#E9B86A] font-medium">Concept project</span>{" "}
              to maintain complete transparency.
            </p>
          </div>

          <WorkGallery />
        </div>
      </section>

      <FinalCtaSection />
    </div>
  );
}
