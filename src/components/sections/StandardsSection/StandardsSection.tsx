"use client";

import { useEffect, useRef } from "react";
import { initStandardsAnimations } from "./animations/standardsAnimations";
import { IntegrationCard } from "./cards/IntegrationCard";
import { OwnershipCard } from "./cards/OwnershipCard";
import { PracticalAICard } from "./cards/PracticalAICard";
import { TransparencyCard } from "./cards/TransparencyCard";
import { StandardsHeader } from "./StandardsHeader";
import "./styles/standards.css";

export function StandardsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    return initStandardsAnimations(sectionRef.current);
  }, []);

  return (
    <section
      id="studio-standards"
      ref={sectionRef}
      aria-label="Standards & Collaboration"
      className="standards-canvas relative overflow-hidden border-t border-[#E5DED5] py-20 sm:py-24 lg:py-[104px]"
    >
      {/* Subtle warm radial light matching rest of EDIYREX homepage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_18%,rgba(255,140,66,0.09),transparent_44%),radial-gradient(circle_at_12%_82%,rgba(255,180,120,0.08),transparent_40%)]"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16 space-y-12 lg:space-y-14">
        <StandardsHeader />

        {/* Unified 2x2 Rounded Editorial Principles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          <TransparencyCard />
          <IntegrationCard />
          <OwnershipCard />
          <PracticalAICard />
        </div>
      </div>
    </section>
  );
}
