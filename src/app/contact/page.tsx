import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ContactProjectIntakeHero } from "@/components/sections/ContactProjectIntakeHero";
import { EnquirySection } from "@/components/sections/EnquirySection";

export const metadata: Metadata = {
  title: "Contact & Project Intake",
  description:
    "Have something worth building? Let's start a conversation. Submit your project brief or contact Ediyrex Studio directly.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#08090B] min-h-screen">
      {/* Project Intake Hero */}
      <ContactProjectIntakeHero />

      {/* Enquiry Form */}
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
