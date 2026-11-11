import React from "react";
import type { ConnectedDivisionId } from "./operational.data";

interface ArchitectureConnectionsProps {
  hoveredId: ConnectedDivisionId | null;
}

export function ArchitectureConnections({
  hoveredId,
}: ArchitectureConnectionsProps) {
  const getBranchClass = (id: ConnectedDivisionId) =>
    hoveredId === id
      ? "opacity-100 stroke-[2.2]"
      : hoveredId === null
      ? "opacity-80 stroke-[1.6]"
      : "opacity-35 stroke-[1.4]";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 640 420"
      fill="none"
      className="pointer-events-none hidden lg:block absolute inset-0 w-full h-full z-10 overflow-visible"
    >
      <defs>
        <linearGradient
          id="os-orbit-grad"
          x1="120"
          y1="80"
          x2="520"
          y2="340"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF9A52" />
          <stop offset="50%" stopColor="#F36B16" />
          <stop offset="100%" stopColor="#FF9A52" />
        </linearGradient>
      </defs>

      {/* Outgoing Orange Flow Lines From Central Transition Node Into Core */}
      <path
        data-os-connect-line
        d="M -46 210 C -8 210, 48 150, 145 128"
        stroke="#F36B16"
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
      <path
        data-os-connect-line
        d="M -46 210 C -4 210, 52 210, 210 210"
        stroke="#F36B16"
        strokeOpacity="0.55"
        strokeWidth="1.25"
      />
      <path
        data-os-connect-line
        d="M -46 210 C -8 210, 48 270, 145 292"
        stroke="#F36B16"
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />

      {/* Subtle Outer Dotted Secondary Orbit */}
      <circle
        cx="320"
        cy="210"
        r="198"
        stroke="#DED6CE"
        strokeWidth="1.15"
        strokeDasharray="3 6"
      />

      {/* Inner Architectural Glow Orbit Connecting Divisions */}
      <circle
        data-os-connect-line
        cx="320"
        cy="210"
        r="134"
        stroke="url(#os-orbit-grad)"
        strokeWidth="1.65"
        strokeOpacity="0.72"
      />

      {/* Four Curved Orange Branch Paths */}
      <path
        data-os-connect-line
        d="M 185 112 Q 255 128 272 162"
        stroke="#F36B16"
        strokeLinecap="round"
        className={`transition-all duration-300 ${getBranchClass("creative")}`}
      />
      <path
        data-os-connect-line
        d="M 455 112 Q 385 128 368 162"
        stroke="#F36B16"
        strokeLinecap="round"
        className={`transition-all duration-300 ${getBranchClass("digital")}`}
      />
      <path
        data-os-connect-line
        d="M 185 308 Q 255 292 272 258"
        stroke="#F36B16"
        strokeLinecap="round"
        className={`transition-all duration-300 ${getBranchClass("media")}`}
      />
      <path
        data-os-connect-line
        d="M 455 308 Q 385 292 368 258"
        stroke="#F36B16"
        strokeLinecap="round"
        className={`transition-all duration-300 ${getBranchClass("intelligence")}`}
      />

      {/* Small Technical Crosshair Markers at Orbit Poles */}
      <g stroke="#F36B16" strokeWidth="1.35">
        <line x1="320" y1="68" x2="320" y2="84" />
        <line x1="312" y1="76" x2="328" y2="76" />
      </g>
      <g stroke="#F36B16" strokeWidth="1.35">
        <line x1="320" y1="336" x2="320" y2="352" />
        <line x1="312" y1="344" x2="328" y2="344" />
      </g>

      {/* Four Orbit Junction Dots */}
      <circle cx="222" cy="128" r="3.5" fill="#FF9A52" />
      <circle cx="418" cy="128" r="3.5" fill="#FF9A52" />
      <circle cx="222" cy="292" r="3.5" fill="#FF9A52" />
      <circle cx="418" cy="292" r="3.5" fill="#FF9A52" />
    </svg>
  );
}

