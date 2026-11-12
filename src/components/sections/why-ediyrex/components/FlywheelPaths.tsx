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
        <path
          id="we-top-text-arc"
          d="M 275 56 A 145 76 0 0 1 490 56"
          fill="none"
        />
        <path
          id="we-bottom-text-arc"
          d="M 275 352 A 145 76 0 0 0 490 352"
          fill="none"
        />
      </defs>

      {/* Upper Curved Feedback Arc + Arrow + Label */}
      <path
        data-we-arc-arrow
        d="M 272 68 Q 380 18 488 68"
        stroke="#D94B00"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        data-we-arc-arrow
        d="M 476 60 L 490 69 L 474 73"
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
        d="M 488 334 Q 380 384 272 334"
        stroke="#D94B00"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        data-we-arc-arrow
        d="M 284 342 L 270 333 L 286 329"
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
