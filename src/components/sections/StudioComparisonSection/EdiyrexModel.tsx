"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { CapabilityCard } from "./CapabilityCard";
import { EDIYREX_CAPABILITIES } from "./comparison.data";

interface EdiyrexModelProps {
  mobileHighlighted?: boolean;
}

export const EdiyrexModel = forwardRef<HTMLDivElement, EdiyrexModelProps>(
  function EdiyrexModel({ mobileHighlighted = false }, ref) {
    return (
      <div
        ref={ref}
        data-sc-right-panel
        className={cn(
          "relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-[#FF9A48] bg-[#FFFAF5] p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_-28px_rgba(255,121,0,0.18)] transition-shadow duration-300",
          mobileHighlighted && "ring-2 ring-[#FF7900]/45"
        )}
      >
        {/* Subtle faint warm corner radial wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_12%,rgba(255,121,0,0.06),transparent_56%)]"
        />

        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center rounded-full bg-[#FF7900] px-3.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white">
            THE EDIYREX WAY
          </span>

          <div className="space-y-2">
            <h3 className="font-heading text-[26px] sm:text-[30px] font-bold tracking-[-0.025em] leading-[1.12] text-[#111111]">
              EDIYREX Studio
            </h3>
            <p className="text-[15px] leading-[1.55] text-[#48433F] max-w-[400px]">
              A single, integrated team across Media, Digital and AI.
            </p>
          </div>
        </div>

        {/* Connected row of 3 capability tiles */}
        <div className="relative z-10 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 items-stretch">
            {EDIYREX_CAPABILITIES.map((cap) => (
              <CapabilityCard key={cap.id} capability={cap} />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

