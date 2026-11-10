import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { EnquirySection } from "@/components/sections/EnquirySection";

export const metadata: Metadata = {
  title: "Contact & Discovery Call",
  description:
    "Book a discovery call or submit a project enquiry to Ediyrex Studio for Media, Digital, or AI work.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#08090B] min-h-screen">
      {/* Compact Hero */}
      <section
        className="pt-36 pb-12 border-b border-[#252A32]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 65% 55% at 50% 20%, #29241B 0%, #08090B 72%)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-4">
          <Badge variant="accent">Contact</Badge>
          <h1 className="font-heading font-bold tracking-tight text-[#F5F3EE] text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.06]">
            Book a discovery call
          </h1>
          <p className="text-sm sm:text-base text-[#B2B4BA] max-w-2xl leading-relaxed">
            Share your project overview, timeline, and service focus below. Every submission is reviewed directly by our studio leads.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="py-24 text-center text-[#777D87] font-mono text-xs">
            Loading enquiry interface...
          </div>
        }
      >
        <EnquirySection />
      </Suspense>
    </div>
  );
}
