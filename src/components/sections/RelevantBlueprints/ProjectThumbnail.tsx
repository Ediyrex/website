"use client";

import React from "react";
import type { ProjectPreviewVariant } from "./blueprints.data";

interface ProjectThumbnailProps {
  variant: ProjectPreviewVariant;
  title: string;
}

export function ProjectThumbnail({ variant, title }: ProjectThumbnailProps) {
  if (variant === "lumora") {
    return (
      <div
        aria-label={`${title} preview`}
        className="relative w-full h-full min-h-[110px] sm:min-h-[120px] rounded-[10px] sm:rounded-[12px] bg-[#141210] border border-[#2E2722] overflow-hidden flex items-center justify-center shadow-inner group-hover:border-[#F06419] group-hover:shadow-[0_0_25px_rgba(240,100,25,0.30)] transition-all"
      >
        {/* Subtle Orange Underglow / Rim Light along the left edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 w-36 h-36 bg-[radial-gradient(circle_at_bottom_left,_rgba(240,100,25,0.85)_0%,_rgba(240,100,25,0.25)_45%,_transparent_75%)] blur-md"
        />

        {/* Matte Charcoal Box / Packaging Visual Container */}
        <div className="relative z-10 w-[84%] h-[68%] rounded-lg bg-[#1B1917] border border-[#3A332B] flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.8)] group-hover:scale-[1.03] transition-transform duration-300">
          <div className="text-center">
            <span className="font-heading font-black text-lg sm:text-xl text-[#F5F2EC] tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              Lumora<sup className="text-[9px] font-normal text-[#D9B875] ml-0.5">®</sup>
            </span>
            <span className="block h-[1.5px] w-8 mx-auto mt-0.5 bg-gradient-to-r from-transparent via-[#F06419] to-transparent shadow-[0_0_6px_#F06419]" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "atlas") {
    return (
      <div
        aria-label={`${title} preview`}
        className="relative w-full h-full min-h-[110px] sm:min-h-[120px] rounded-[10px] sm:rounded-[12px] bg-[#0E1015] border border-[#232733] overflow-hidden flex items-center justify-between p-3.5 shadow-inner group-hover:border-[#68A9FF] group-hover:shadow-[0_0_25px_rgba(104,169,255,0.30)] transition-all"
      >
        {/* Purple Glowing Fluid Wave Flare */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 w-36 h-36 bg-[radial-gradient(circle,_rgba(185,147,242,0.55)_0%,_rgba(104,169,255,0.25)_50%,_transparent_75%)] blur-lg"
        />

        {/* Left Side: Miniature Product Typography */}
        <div className="relative z-10 space-y-1.5 max-w-[55%]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#68A9FF]" />
            <span className="font-heading font-bold text-[11px] text-[#F5F2EC] tracking-tight">
              Atlas
            </span>
          </div>
          <p className="font-heading font-extrabold text-[10px] sm:text-[11px] text-[#F5F2EC] leading-tight line-clamp-2">
            Operational clarity for modern teams.
          </p>
        </div>

        {/* Right Side: Fluid Neon Purple Curved Graphic Ribbon */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 80"
          className="relative z-10 w-20 h-16 shrink-0 overflow-visible"
        >
          <path
            d="M 5 65 Q 40 10, 70 45 T 100 20"
            fill="none"
            stroke="#B993F2"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_8px_rgba(185,147,242,0.8)]"
          />
          <path
            d="M 10 70 Q 45 25, 75 55 T 100 35"
            fill="none"
            stroke="#68A9FF"
            strokeWidth="2"
            strokeOpacity="0.75"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // Fallback / Generic High-Craft Preview (for Nexus, Strata, Lumina)
  return (
    <div
      aria-label={`${title} preview`}
      className="relative w-full h-full min-h-[110px] sm:min-h-[120px] rounded-[10px] sm:rounded-[12px] bg-[#101214] border border-[#292E35] overflow-hidden flex items-center justify-center p-3 shadow-inner group-hover:border-[#F06419]/50 transition-colors"
    >
      <div className="text-center space-y-1">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#D9B875] block">
          SYSTEM PREVIEW
        </span>
        <span className="font-heading font-bold text-xs text-[#F5F2EC] block">
          {title}
        </span>
      </div>
    </div>
  );
}
