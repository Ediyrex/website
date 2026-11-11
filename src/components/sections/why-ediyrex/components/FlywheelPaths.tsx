import React from "react";

export function FlywheelPaths() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 760 400"
      fill="none"
      className="pointer-events-none hidden md:block w-full h-full overflow-visible"
    >
      <defs>
        {/* Translucent Glass Loop Ring Gradient */}
        <linearGradient
          id="we-glass-loop"
          x1="70"
          y1="65"
          x2="690"
          y2="335"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
          <stop offset="35%" stopColor="#FFE2C5" stopOpacity="0.62" />
          <stop offset="65%" stopColor="#FF6500" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.82" />
        </linearGradient>

        {/* Orange Illuminated Rim Gradient */}
        <linearGradient
          id="we-orange-rim"
          x1="60"
          y1="320"
          x2="700"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF6500" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#FF9A52" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#D94B00" stopOpacity="0.95" />
        </linearGradient>

        {/* Top & Bottom Text Arcs */}
        <path
          id="we-top-text-arc"
          d="M 275 68 A 145 78 0 0 1 490 68"
          fill="none"
        />
        <path
          id="we-bottom-text-arc"
          d="M 275 344 A 145 76 0 0 0 490 344"
          fill="none"
        />

        <filter id="we-loop-shadow" x="-10%" y="-15%" width="120%" height="135%">
          <feDropShadow
            dx="0"
            dy="18"
            stdDeviation="14"
            floodColor="#D94B00"
            floodOpacity="0.16"
          />
        </filter>
      </defs>

      {/* Infinity Loop Base Glass Tube */}
      <g filter="url(#we-loop-shadow)">
        <path
          data-we-loop-base
          d="M 380 200 C 315 85, 82 55, 82 200 C 82 345, 315 315, 380 200 C 445 85, 678 55, 678 200 C 678 345, 445 315, 380 200 Z"
          stroke="url(#we-glass-loop)"
          strokeWidth="36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Crisp Specular White Glass Highlight */}
        <path
          data-we-loop-highlight
          d="M 380 200 C 315 85, 82 55, 82 200 C 82 345, 315 315, 380 200 C 445 85, 678 55, 678 200 C 678 345, 445 315, 380 200 Z"
          stroke="#FFFFFF"
          strokeOpacity="0.72"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Primary Continuous Illuminated Orange Edge Trace */}
      <path
        data-we-loop-draw
        d="M 380 200 C 315 85, 82 55, 82 200 C 82 345, 315 315, 380 200 C 445 85, 678 55, 678 200 C 678 345, 445 315, 380 200 Z"
        stroke="url(#we-orange-rim)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Travelling Orange Energy Pulse Along Infinity Loop */}
      <path
        data-we-loop-pulse
        d="M 380 200 C 315 85, 82 55, 82 200 C 82 345, 315 315, 380 200 C 445 85, 678 55, 678 200 C 678 345, 445 315, 380 200 Z"
        stroke="#FF6500"
        strokeWidth="4"
        strokeOpacity="0.85"
        strokeLinecap="round"
        strokeDasharray="115 1620"
      />

      {/* Upper Curved Feedback Arc + Arrow + Label */}
      <path
        data-we-arc-arrow
        d="M 272 78 Q 380 26 488 78"
        stroke="#D94B00"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        data-we-arc-arrow
        d="M 476 70 L 490 79 L 474 83"
        stroke="#D94B00"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        fill="#111111"
        fontSize="10.5"
        fontWeight="600"
        letterSpacing="0.14em"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <textPath href="#we-top-text-arc" startOffset="50%" textAnchor="middle">
          REAL-WORLD INSIGHTS
        </textPath>
      </text>

      {/* Lower Curved Feedback Arc + Arrow + Label */}
      <path
        data-we-arc-arrow
        d="M 488 326 Q 380 378 272 326"
        stroke="#D94B00"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        data-we-arc-arrow
        d="M 284 334 L 270 325 L 286 321"
        stroke="#D94B00"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        fill="#111111"
        fontSize="10.5"
        fontWeight="600"
        letterSpacing="0.14em"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <textPath
          href="#we-bottom-text-arc"
          startOffset="50%"
          textAnchor="middle"
        >
          PRODUCTS &amp; CAPABILITIES
        </textPath>
      </text>
    </svg>
  );
}

