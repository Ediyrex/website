"use client";

import React from "react";

interface CoreOrbitRingsProps {
  compact?: boolean;
}

export function CoreOrbitRings({ compact = false }: CoreOrbitRingsProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-10 ${
        compact ? "scale-75 sm:scale-90" : ""
      }`}
    >
      {/* Soft Center Ambient Bloom */}
      <div
        className="pointer-events-none absolute w-[300px] h-[300px] xl:w-[330px] xl:h-[330px] rounded-full blur-3xl opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(243,107,22,0.45) 0%, rgba(255,154,82,0.16) 48%, transparent 72%)",
        }}
      />

      <svg
        viewBox="0 0 400 400"
        fill="none"
        className="w-[360px] h-[360px] xl:w-[390px] xl:h-[390px] overflow-visible shrink-0"
      >
        <defs>
          <linearGradient
            id="os-core-orbit-grad"
            x1="60"
            y1="60"
            x2="340"
            y2="340"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFA86B" />
            <stop offset="50%" stopColor="#F36B16" />
            <stop offset="100%" stopColor="#FFA86B" />
          </linearGradient>

          <filter
            id="os-core-pulse-glow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle Outer Dotted Secondary Orbit (Gentle slow counter-rotation) */}
        <circle
          cx="200"
          cy="200"
          r="185"
          stroke="#DED6CE"
          strokeWidth="1.2"
          strokeDasharray="4 8"
          className="animate-[spin_70s_linear_infinite_reverse] origin-center"
        />

        {/* Inner Luminous Architectural Orbit Ring */}
        <circle
          cx="200"
          cy="200"
          r="138"
          stroke="url(#os-core-orbit-grad)"
          strokeWidth="1.75"
          strokeOpacity="0.8"
        />

        {/* Fine Rotating Dashed Accent Ring */}
        <circle
          cx="200"
          cy="200"
          r="138"
          stroke="#F36B16"
          strokeWidth="1.2"
          strokeDasharray="3 9"
          strokeOpacity="0.55"
          className="animate-[spin_40s_linear_infinite] origin-center"
        />

        {/* Technical Crosshair Markers at 12, 3, 6, 9 o'clock */}
        <g stroke="#F36B16" strokeWidth="1.35">
          {/* Top Crosshair (12 o'clock) */}
          <line x1="200" y1="52" x2="200" y2="70" />
          <line x1="191" y1="61" x2="209" y2="61" />

          {/* Bottom Crosshair (6 o'clock) */}
          <line x1="200" y1="330" x2="200" y2="348" />
          <line x1="191" y1="339" x2="209" y2="339" />

          {/* Left Crosshair (9 o'clock) */}
          <line x1="52" y1="200" x2="70" y2="200" />
          <line x1="61" y1="191" x2="61" y2="209" />

          {/* Right Crosshair (3 o'clock) */}
          <line x1="330" y1="200" x2="348" y2="200" />
          <line x1="339" y1="191" x2="339" y2="209" />
        </g>

        {/* Four Diagonal Orbit Junction Dots with Subtle Breathing Pulse */}
        <g>
          {/* Top-Right (45°) */}
          <circle cx="298" cy="102" r="3.8" fill="#FFA86B">
            <animate
              attributeName="r"
              values="3.2;4.6;3.2"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Bottom-Right (135°) */}
          <circle cx="298" cy="298" r="3.8" fill="#FFA86B">
            <animate
              attributeName="r"
              values="3.2;4.6;3.2"
              dur="3s"
              begin="0.75s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Bottom-Left (225°) */}
          <circle cx="102" cy="298" r="3.8" fill="#FFA86B">
            <animate
              attributeName="r"
              values="3.2;4.6;3.2"
              dur="3s"
              begin="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Top-Left (315°) */}
          <circle cx="102" cy="102" r="3.8" fill="#FFA86B">
            <animate
              attributeName="r"
              values="3.2;4.6;3.2"
              dur="3s"
              begin="2.25s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Traveling Luminous Data Pulses Circling Orbit Track */}
        <circle r="4" fill="#FFA86B" filter="url(#os-core-pulse-glow)">
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            path="M 200 62 A 138 138 0 1 1 199.9 62"
          />
        </circle>
        <circle r="2.5" fill="#FFFFFF" opacity="0.95">
          <animateMotion
            dur="6s"
            begin="3s"
            repeatCount="indefinite"
            path="M 200 62 A 138 138 0 1 1 199.9 62"
          />
        </circle>
      </svg>
    </div>
  );
}
