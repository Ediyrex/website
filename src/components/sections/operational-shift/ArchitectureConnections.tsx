"use client";

import React from "react";
import type { ConnectedDivisionId } from "./operational.data";

interface ArchitectureConnectionsProps {
  hoveredId: ConnectedDivisionId | null;
}

export function ArchitectureConnections({
  hoveredId,
}: ArchitectureConnectionsProps) {
  const isCreativeActive = hoveredId === "creative";
  const isMediaActive = hoveredId === "media";
  const isDigitalActive = hoveredId === "digital";
  const isIntelActive = hoveredId === "intelligence";

  // Flow wire path definitions in 800x420 coordinate space
  // Transition node on the far left at (-45, 210)
  const pathTransCreative = "M -45 210 C 20 210, 70 114, 195 114";
  const pathTransCore = "M -45 210 C 60 210, 160 210, 262 210";
  const pathTransMedia = "M -45 210 C 20 210, 70 306, 195 306";

  // Connections between 4 divisions and the central EDIYREX orbit
  const pathCreativeCore = "M 195 114 C 235 114, 270 114, 302 114";
  const pathMediaCore = "M 195 306 C 235 306, 270 306, 302 306";
  const pathCoreDigital = "M 498 114 C 530 114, 565 114, 605 114";
  const pathCoreIntel = "M 498 306 C 530 306, 565 306, 605 306";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 420"
      preserveAspectRatio="none"
      fill="none"
      className="pointer-events-none hidden lg:block absolute inset-0 w-full h-full z-10 overflow-visible"
    >
      <defs>
        <linearGradient
          id="os-wire-grad"
          x1="0"
          y1="210"
          x2="800"
          y2="210"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFA86B" />
          <stop offset="50%" stopColor="#F36B16" />
          <stop offset="100%" stopColor="#FFA86B" />
        </linearGradient>

        <filter
          id="os-wire-glow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <style>{`
          @keyframes osFlow {
            from { stroke-dashoffset: 40; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes osFlowReverse {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: 40; }
          }
          .animate-os-flow {
            animation: osFlow 2.2s linear infinite;
          }
          .animate-os-flow-reverse {
            animation: osFlowReverse 2.2s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-os-flow, .animate-os-flow-reverse {
              animation: none !important;
            }
          }
        `}</style>
      </defs>

      {/* ─────────────────────────────────────────────────────────────
          1. TRANSITION NODE INCOMING STREAMS (Left -> System)
      ───────────────────────────────────────────────────────────── */}
      {/* 1A. Transition -> Creative */}
      <g>
        <path
          data-os-connect-line
          d={pathTransCreative}
          stroke="#F36B16"
          strokeOpacity={isCreativeActive ? "0.8" : "0.3"}
          strokeWidth={isCreativeActive ? "2" : "1.4"}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={pathTransCreative}
          stroke="#FFA86B"
          strokeOpacity={isCreativeActive ? "1" : "0.75"}
          strokeWidth={isCreativeActive ? "2.2" : "1.5"}
          strokeLinecap="round"
          strokeDasharray="6 14"
          vectorEffect="non-scaling-stroke"
          className="animate-os-flow"
        />
        <circle r="3.5" fill="#FFA86B" filter="url(#os-wire-glow)">
          <animateMotion
            dur="2.4s"
            repeatCount="indefinite"
            path={pathTransCreative}
          />
        </circle>
        <circle r="2" fill="#FFFFFF" opacity="0.9">
          <animateMotion
            dur="2.4s"
            begin="1.2s"
            repeatCount="indefinite"
            path={pathTransCreative}
          />
        </circle>
      </g>

      {/* 1B. Transition -> EDIYREX Center Port */}
      <g>
        <path
          data-os-connect-line
          d={pathTransCore}
          stroke="#F36B16"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={pathTransCore}
          stroke="#FFA86B"
          strokeOpacity="0.85"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="6 14"
          vectorEffect="non-scaling-stroke"
          className="animate-os-flow"
        />
        <circle r="3.8" fill="#FFA86B" filter="url(#os-wire-glow)">
          <animateMotion
            dur="2.0s"
            repeatCount="indefinite"
            path={pathTransCore}
          />
        </circle>
        <circle r="2.2" fill="#FFFFFF" opacity="0.95">
          <animateMotion
            dur="2.0s"
            begin="1.0s"
            repeatCount="indefinite"
            path={pathTransCore}
          />
        </circle>
      </g>

      {/* 1C. Transition -> Media */}
      <g>
        <path
          data-os-connect-line
          d={pathTransMedia}
          stroke="#F36B16"
          strokeOpacity={isMediaActive ? "0.8" : "0.3"}
          strokeWidth={isMediaActive ? "2" : "1.4"}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={pathTransMedia}
          stroke="#FFA86B"
          strokeOpacity={isMediaActive ? "1" : "0.75"}
          strokeWidth={isMediaActive ? "2.2" : "1.5"}
          strokeLinecap="round"
          strokeDasharray="6 14"
          vectorEffect="non-scaling-stroke"
          className="animate-os-flow"
        />
        <circle r="3.5" fill="#FFA86B" filter="url(#os-wire-glow)">
          <animateMotion
            dur="2.4s"
            repeatCount="indefinite"
            path={pathTransMedia}
          />
        </circle>
        <circle r="2" fill="#FFFFFF" opacity="0.9">
          <animateMotion
            dur="2.4s"
            begin="1.2s"
            repeatCount="indefinite"
            path={pathTransMedia}
          />
        </circle>
      </g>

      {/* ─────────────────────────────────────────────────────────────
          2. DIVISION CONNECTORS (Creative, Media <-> EDIYREX <-> Digital, Intel)
      ───────────────────────────────────────────────────────────── */}
      {/* 2A. Creative -> EDIYREX Orbit */}
      <g>
        <path
          data-os-connect-line
          d={pathCreativeCore}
          stroke="#F36B16"
          strokeOpacity={isCreativeActive ? "0.9" : "0.35"}
          strokeWidth={isCreativeActive ? "2.2" : "1.5"}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={pathCreativeCore}
          stroke="#FFA86B"
          strokeOpacity={isCreativeActive ? "1" : "0.8"}
          strokeWidth={isCreativeActive ? "2.4" : "1.7"}
          strokeLinecap="round"
          strokeDasharray="6 12"
          vectorEffect="non-scaling-stroke"
          className="animate-os-flow"
        />
        <circle r="3.5" fill="#FFA86B" filter="url(#os-wire-glow)">
          <animateMotion
            dur="2.0s"
            repeatCount="indefinite"
            path={pathCreativeCore}
          />
        </circle>
      </g>

      {/* 2B. Media -> EDIYREX Orbit */}
      <g>
        <path
          data-os-connect-line
          d={pathMediaCore}
          stroke="#F36B16"
          strokeOpacity={isMediaActive ? "0.9" : "0.35"}
          strokeWidth={isMediaActive ? "2.2" : "1.5"}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={pathMediaCore}
          stroke="#FFA86B"
          strokeOpacity={isMediaActive ? "1" : "0.8"}
          strokeWidth={isMediaActive ? "2.4" : "1.7"}
          strokeLinecap="round"
          strokeDasharray="6 12"
          vectorEffect="non-scaling-stroke"
          className="animate-os-flow"
        />
        <circle r="3.5" fill="#FFA86B" filter="url(#os-wire-glow)">
          <animateMotion
            dur="2.0s"
            repeatCount="indefinite"
            path={pathMediaCore}
          />
        </circle>
      </g>

      {/* 2C. EDIYREX Orbit -> Digital */}
      <g>
        <path
          data-os-connect-line
          d={pathCoreDigital}
          stroke="#F36B16"
          strokeOpacity={isDigitalActive ? "0.9" : "0.35"}
          strokeWidth={isDigitalActive ? "2.2" : "1.5"}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={pathCoreDigital}
          stroke="#FFA86B"
          strokeOpacity={isDigitalActive ? "1" : "0.8"}
          strokeWidth={isDigitalActive ? "2.4" : "1.7"}
          strokeLinecap="round"
          strokeDasharray="6 12"
          vectorEffect="non-scaling-stroke"
          className="animate-os-flow"
        />
        <circle r="3.5" fill="#FFA86B" filter="url(#os-wire-glow)">
          <animateMotion
            dur="2.0s"
            repeatCount="indefinite"
            path={pathCoreDigital}
          />
        </circle>
      </g>

      {/* 2D. EDIYREX Orbit -> Intelligence */}
      <g>
        <path
          data-os-connect-line
          d={pathCoreIntel}
          stroke="#F36B16"
          strokeOpacity={isIntelActive ? "0.9" : "0.35"}
          strokeWidth={isIntelActive ? "2.2" : "1.5"}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={pathCoreIntel}
          stroke="#FFA86B"
          strokeOpacity={isIntelActive ? "1" : "0.8"}
          strokeWidth={isIntelActive ? "2.4" : "1.7"}
          strokeLinecap="round"
          strokeDasharray="6 12"
          vectorEffect="non-scaling-stroke"
          className="animate-os-flow"
        />
        <circle r="3.5" fill="#FFA86B" filter="url(#os-wire-glow)">
          <animateMotion
            dur="2.0s"
            repeatCount="indefinite"
            path={pathCoreIntel}
          />
        </circle>
      </g>

      {/* ─────────────────────────────────────────────────────────────
          3. JUNCTION PORTS ON EDIYREX ORBIT PERIMETER
      ───────────────────────────────────────────────────────────── */}
      {/* Center Left Port (Incoming transition stream) */}
      <circle cx="262" cy="210" r="4" fill="#FFA86B" />
      <circle
        cx="262"
        cy="210"
        r="7"
        stroke="#F36B16"
        strokeWidth="1.2"
        strokeOpacity="0.5"
      />

      {/* Top-Left Port (Creative) */}
      <circle
        cx="302"
        cy="114"
        r={isCreativeActive ? "4.5" : "3.5"}
        fill={isCreativeActive ? "#FF9A52" : "#FFA86B"}
      />

      {/* Bottom-Left Port (Media) */}
      <circle
        cx="302"
        cy="306"
        r={isMediaActive ? "4.5" : "3.5"}
        fill={isMediaActive ? "#FF9A52" : "#FFA86B"}
      />

      {/* Top-Right Port (Digital) */}
      <circle
        cx="498"
        cy="114"
        r={isDigitalActive ? "4.5" : "3.5"}
        fill={isDigitalActive ? "#FF9A52" : "#FFA86B"}
      />

      {/* Bottom-Right Port (Intelligence) */}
      <circle
        cx="498"
        cy="306"
        r={isIntelActive ? "4.5" : "3.5"}
        fill={isIntelActive ? "#FF9A52" : "#FFA86B"}
      />
    </svg>
  );
}
