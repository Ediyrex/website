"use client";

import type { EngagementId } from "../data/engagementModels";

interface EngagementRibbonProps {
  selectedId: EngagementId;
}

const RIBBON_SHIFT_BY_MODEL: Record<EngagementId, string> = {
  "project-based": "translateY(0px)",
  "ongoing-collaboration": "translateY(8px)",
  "custom-engagement": "translateY(-6px)",
};

export function EngagementRibbon({ selectedId }: EngagementRibbonProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-[-10%] inset-y-[-14%] z-0 overflow-visible flex items-center"
    >
      <svg
        viewBox="0 0 920 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-full transition-transform duration-700 ease-out"
        style={{ transform: RIBBON_SHIFT_BY_MODEL[selectedId] }}
      >
        <defs>
          <linearGradient id="engagement-ribbon-main" x1="0%" y1="50%" x2="100%" y2="40%">
            <stop offset="0%" stopColor="#E65100" />
            <stop offset="28%" stopColor="#FF6900" />
            <stop offset="56%" stopColor="#FF963F" />
            <stop offset="82%" stopColor="#FFB878" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#FFD8B6" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="engagement-ribbon-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE1C2" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFEAD6" stopOpacity="0.1" />
          </linearGradient>
          <filter id="engagement-ribbon-glow" x="-15%" y="-30%" width="130%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#FF6900" floodOpacity="0.28" />
          </filter>
        </defs>

        {/* Soft ambient shadow track */}
        <path
          d="M -20 232 C 88 118, 224 108, 360 198 C 482 280, 616 218, 738 158 C 804 126, 868 134, 940 162"
          stroke="#FF6900"
          strokeOpacity="0.16"
          strokeWidth="44"
          strokeLinecap="round"
        />

        {/* Primary sculpted flowing orange ribbon */}
        <path
          data-engagement-ribbon-path
          d="M -18 228 C 92 112, 228 106, 364 196 C 486 276, 618 214, 740 154 C 806 122, 870 132, 938 160"
          stroke="url(#engagement-ribbon-main)"
          strokeWidth="26"
          strokeLinecap="round"
          filter="url(#engagement-ribbon-glow)"
        />

        {/* Specular upper edge thread */}
        <path
          data-engagement-ribbon-path
          d="M -16 218 C 92 104, 228 98, 364 188 C 486 268, 618 206, 740 146 C 806 114, 870 124, 938 152"
          stroke="url(#engagement-ribbon-highlight)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

