import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ProjectBriefDesk } from "@/components/sections/ContactPage/ProjectBriefDesk";

export const metadata: Metadata = {
  title: "Contact & Project Intake — Start a Project",
  description:
    "Have something worth building? Submit your project brief or book a 30-min discovery consultation with EDYREX studio leads.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#0C0D0F] min-h-screen text-[#F5F2EC]">
      <Suspense
        fallback={
          <div className="py-36 text-center text-[#898D94] font-mono text-xs">
            Loading Project Brief Desk...
          </div>
        }
      >
        <ProjectBriefDesk />
      </Suspense>
    </div>
  );
}
