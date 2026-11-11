import React from "react";

export function BottomWave() {
  return (
    <svg
      data-we-bottom-wave
      aria-hidden="true"
      viewBox="0 0 820 200"
      fill="none"
      className="pointer-events-none absolute right-0 bottom-0 w-[68%] max-w-[820px] h-36 sm:h-44 opacity-55 z-0"
    >
      <path
        d="M 40 198 C 210 185, 360 112, 825 46"
        stroke="#FF6500"
        strokeOpacity="0.28"
        strokeWidth="1.25"
      />
      <path
        d="M 110 198 C 285 182, 430 120, 825 68"
        stroke="#FF6500"
        strokeOpacity="0.24"
        strokeWidth="1.15"
      />
      <path
        d="M 185 198 C 350 180, 495 130, 825 90"
        stroke="#D94B00"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <path
        d="M 260 198 C 420 180, 560 142, 825 112"
        stroke="#FF6500"
        strokeOpacity="0.16"
        strokeWidth="1"
      />
    </svg>
  );
}

