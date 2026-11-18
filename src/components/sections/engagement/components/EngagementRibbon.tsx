"use client";

import { motion, type Transition } from "framer-motion";
import type { EngagementId } from "../data/engagementModels";

interface EngagementRibbonProps {
  selectedId: EngagementId;
}

const RIBBON_SHIFT_BY_MODEL: Record<EngagementId, string> = {
  "project-based": "translateY(0px)",
  "ongoing-collaboration": "translateY(8px)",
  "custom-engagement": "translateY(-6px)",
};

// Harmonic wave paths for silky undulating flow
const PATH_MAIN_A =
  "M -20 228 C 92 112, 228 106, 364 196 C 486 276, 618 214, 740 154 C 806 122, 870 132, 940 160";
const PATH_MAIN_B =
  "M -20 216 C 96 124, 232 116, 368 186 C 490 264, 622 224, 744 144 C 810 112, 874 138, 940 170";
const PATH_MAIN_C =
  "M -20 238 C 88 100, 224 96, 360 206 C 482 286, 614 204, 736 164 C 802 132, 866 124, 940 150";

// Ambient shadow track harmonic states
const PATH_SHADOW_A =
  "M -20 234 C 88 118, 224 110, 360 200 C 482 280, 616 218, 738 158 C 804 126, 868 134, 940 162";
const PATH_SHADOW_B =
  "M -20 222 C 92 130, 228 120, 364 190 C 486 268, 620 228, 742 148 C 808 116, 872 140, 940 172";
const PATH_SHADOW_C =
  "M -20 244 C 84 106, 220 100, 356 210 C 478 290, 612 208, 734 168 C 800 136, 864 126, 940 152";

// Specular upper highlight thread harmonic states
const PATH_SPECULAR_A =
  "M -18 218 C 92 104, 228 98, 364 188 C 486 268, 618 206, 740 146 C 806 114, 870 124, 938 152";
const PATH_SPECULAR_B =
  "M -18 206 C 96 116, 232 108, 368 178 C 490 256, 622 216, 744 136 C 810 104, 874 130, 938 162";
const PATH_SPECULAR_C =
  "M -18 228 C 88 92, 224 88, 360 198 C 482 278, 614 196, 736 156 C 802 124, 866 116, 938 142";

const WAVE_TRANSITION: Transition = {
  duration: 7,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
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
          {/* Main rich sculpted orange ribbon gradient */}
          <linearGradient id="engagement-ribbon-main" x1="0%" y1="50%" x2="100%" y2="40%">
            <stop offset="0%" stopColor="#E65100" />
            <stop offset="28%" stopColor="#FF6900" />
            <stop offset="56%" stopColor="#FF963F" />
            <stop offset="82%" stopColor="#FFB878" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFD8B6" stopOpacity="0.4" />
          </linearGradient>

          {/* Traveling photonic energy beam gradient */}
          <linearGradient id="engagement-ribbon-pulse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6900" stopOpacity="0" />
            <stop offset="35%" stopColor="#FFA459" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="65%" stopColor="#FFA459" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FF6900" stopOpacity="0" />
          </linearGradient>

          {/* Specular upper edge thread gradient */}
          <linearGradient id="engagement-ribbon-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE1C2" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFEAD6" stopOpacity="0.2" />
          </linearGradient>

          {/* Warm ambient drop shadow */}
          <filter id="engagement-ribbon-glow" x="-15%" y="-30%" width="130%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#FF6900" floodOpacity="0.32" />
          </filter>

          {/* High-intensity glow for the traveling light pulse */}
          <filter id="engagement-ribbon-bright-glow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComponentTransfer in="blur" result="boost">
              <feFuncA type="linear" slope="1.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="boost" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Soft ambient shadow track (Harmonically undulating) */}
        <motion.path
          d={PATH_SHADOW_A}
          animate={{
            d: [PATH_SHADOW_A, PATH_SHADOW_B, PATH_SHADOW_C],
          }}
          transition={WAVE_TRANSITION}
          stroke="#FF6900"
          strokeOpacity="0.16"
          strokeWidth="44"
          strokeLinecap="round"
        />

        {/* 2. Primary sculpted flowing orange ribbon */}
        <motion.path
          data-engagement-ribbon-path
          d={PATH_MAIN_A}
          animate={{
            d: [PATH_MAIN_A, PATH_MAIN_B, PATH_MAIN_C],
          }}
          transition={WAVE_TRANSITION}
          stroke="url(#engagement-ribbon-main)"
          strokeWidth="26"
          strokeLinecap="round"
          filter="url(#engagement-ribbon-glow)"
        />

        {/* 3. Primary traveling photonic pulse beam in continuous flow */}
        <motion.path
          data-engagement-ribbon-flow-pulse
          d={PATH_MAIN_A}
          animate={{
            d: [PATH_MAIN_A, PATH_MAIN_B, PATH_MAIN_C],
            strokeDashoffset: [1000, 0],
          }}
          transition={{
            d: WAVE_TRANSITION,
            strokeDashoffset: {
              duration: 3.8,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          stroke="url(#engagement-ribbon-pulse)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="140 860"
          filter="url(#engagement-ribbon-bright-glow)"
          className="opacity-90"
        />

        {/* 4. Specular upper edge thread */}
        <motion.path
          data-engagement-ribbon-path
          d={PATH_SPECULAR_A}
          animate={{
            d: [PATH_SPECULAR_A, PATH_SPECULAR_B, PATH_SPECULAR_C],
          }}
          transition={WAVE_TRANSITION}
          stroke="url(#engagement-ribbon-highlight)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* 5. Fast traveling shimmer highlight on the top edge */}
        <motion.path
          d={PATH_SPECULAR_A}
          animate={{
            d: [PATH_SPECULAR_A, PATH_SPECULAR_B, PATH_SPECULAR_C],
            strokeDashoffset: [1100, 0],
          }}
          transition={{
            d: WAVE_TRANSITION,
            strokeDashoffset: {
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="36 964"
          className="opacity-80"
        />
      </svg>
    </div>
  );
}
