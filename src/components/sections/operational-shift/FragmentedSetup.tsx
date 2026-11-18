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
          viewBox="0 0 140 340"
          preserveAspectRatio="none"
          fill="none"
          className="pointer-events-none hidden lg:block absolute left-full -ml-3 top-0 w-[68px] xl:w-[88px] h-full z-10 overflow-visible"
        >
          <defs>
            <style>{`
              @keyframes fragFlow {
                from { stroke-dashoffset: 24; }
                to { stroke-dashoffset: 0; }
              }
              .animate-frag-flow {
                animation: fragFlow 3s linear infinite;
              }
              @media (prefers-reduced-motion: reduce) {
                .animate-frag-flow {
                  animation: none !important;
                }
              }
            `}</style>
          </defs>
          <g>
            <path
              data-os-frag-line
              d="M 0 48 C 46 58, 72 136, 134 170"
              stroke="#BEB5AB"
              strokeOpacity="0.5"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 0 48 C 46 58, 72 136, 134 170"
              stroke="#A89E93"
              strokeOpacity="0.75"
              strokeWidth="1.3"
              strokeDasharray="4 10"
              vectorEffect="non-scaling-stroke"
              className="animate-frag-flow"
            />
          </g>
          <g>
            <path
              data-os-frag-line
              d="M 10 112 C 52 122, 76 150, 134 170"
              stroke="#BEB5AB"
              strokeOpacity="0.5"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 10 112 C 52 122, 76 150, 134 170"
              stroke="#A89E93"
              strokeOpacity="0.75"
              strokeWidth="1.3"
              strokeDasharray="4 10"
              vectorEffect="non-scaling-stroke"
              className="animate-frag-flow"
            />
          </g>
          <g>
            <path
              data-os-frag-line
              d="M 0 172 C 44 172, 80 170, 134 170"
              stroke="#BEB5AB"
              strokeOpacity="0.5"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 0 172 C 44 172, 80 170, 134 170"
              stroke="#A89E93"
              strokeOpacity="0.75"
              strokeWidth="1.3"
              strokeDasharray="4 10"
              vectorEffect="non-scaling-stroke"
              className="animate-frag-flow"
            />
          </g>
          <g>
            <path
              data-os-frag-line
              d="M 10 228 C 52 218, 76 188, 134 170"
              stroke="#BEB5AB"
              strokeOpacity="0.5"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 10 228 C 52 218, 76 188, 134 170"
              stroke="#A89E93"
              strokeOpacity="0.75"
              strokeWidth="1.3"
              strokeDasharray="4 10"
              vectorEffect="non-scaling-stroke"
              className="animate-frag-flow"
            />
          </g>
          <g>
            <path
              data-os-frag-line
              d="M 0 288 C 46 274, 72 204, 134 170"
              stroke="#BEB5AB"
              strokeOpacity="0.5"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 0 288 C 46 274, 72 204, 134 170"
              stroke="#A89E93"
              strokeOpacity="0.75"
              strokeWidth="1.3"
              strokeDasharray="4 10"
              vectorEffect="non-scaling-stroke"
              className="animate-frag-flow"
            />
          </g>
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

