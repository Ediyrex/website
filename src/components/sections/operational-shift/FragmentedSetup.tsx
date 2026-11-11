import React from "react";
import { FRAGMENTED_CARDS } from "./operational.data";
import { FragmentedCard } from "./FragmentedCard";

export function FragmentedSetup() {
  return (
    <div className="relative flex flex-col items-center lg:items-start">
      {/* Before Pill Badge */}
      <div className="mb-6 lg:mb-7">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#DED6CE] bg-[#FBF8F4]/70 text-[11px] sm:text-[11.5px] font-bold uppercase tracking-[0.12em] text-[#333333]">
          BEFORE &middot; FRAGMENTED SETUP
        </span>
      </div>

      {/* Six Disconnected Floating Cards + Right-Converging SVG Connectors */}
      <div className="relative w-full">
        {/* Desktop Converging Light-Grey Curved Lines Toward Transition Node */}
        <svg
          aria-hidden="true"
          viewBox="0 0 480 340"
          fill="none"
          className="pointer-events-none hidden lg:block absolute -right-12 top-0 w-[135px] xl:w-[155px] h-full z-10 overflow-visible"
        >
          <path
            data-os-frag-line
            d="M -20 55 C 35 65, 65 140, 128 170"
            stroke="#BEB5AB"
            strokeOpacity="0.65"
            strokeWidth="1.2"
          />
          <path
            data-os-frag-line
            d="M -4 115 C 42 125, 68 152, 128 170"
            stroke="#BEB5AB"
            strokeOpacity="0.7"
            strokeWidth="1.2"
          />
          <path
            data-os-frag-line
            d="M -26 172 C 30 172, 72 170, 128 170"
            stroke="#BEB5AB"
            strokeOpacity="0.7"
            strokeWidth="1.2"
          />
          <path
            data-os-frag-line
            d="M -6 226 C 42 218, 72 188, 128 170"
            stroke="#BEB5AB"
            strokeOpacity="0.65"
            strokeWidth="1.2"
          />
          <path
            data-os-frag-line
            d="M -24 285 C 36 270, 74 202, 128 170"
            stroke="#BEB5AB"
            strokeOpacity="0.6"
            strokeWidth="1.2"
          />
        </svg>

        {/* 2-Column Staggered Scattered Card Layout */}
        <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-y-5 lg:gap-x-4 max-w-[430px] mx-auto lg:mx-0">
          {FRAGMENTED_CARDS.map((card) => (
            <FragmentedCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}

