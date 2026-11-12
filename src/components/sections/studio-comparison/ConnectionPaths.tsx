import { ArrowDown, ArrowRight } from "lucide-react";

export function ConnectionPaths() {
  return (
    <div className="relative flex items-center justify-center py-2 lg:py-0">
      {/* Desktop SVG converging & energizing paths behind the central arrow */}
      <svg
        aria-hidden="true"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none hidden lg:block absolute inset-x-[-72px] top-1/2 -translate-y-1/2 w-[calc(100%+144px)] h-[240px] z-0"
      >
        <defs>
          <linearGradient id="comp-path-in" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="rgba(160,152,143,0.16)" />
            <stop offset="65%" stopColor="rgba(255,138,36,0.45)" />
            <stop offset="100%" stopColor="#FF8A24" />
          </linearGradient>
          <linearGradient id="comp-path-out" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFB347" />
            <stop offset="65%" stopColor="#FF8A24" />
            <stop offset="100%" stopColor="rgba(255,138,36,0.15)" />
          </linearGradient>
        </defs>

        {/* Converging vendor lines from left */}
        <path
          data-comp-path
          d="M 4 58 C 52 58, 76 106, 118 118"
          stroke="url(#comp-path-in)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          data-comp-path
          d="M 2 92 C 50 92, 74 114, 118 120"
          stroke="url(#comp-path-in)"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          data-comp-path
          d="M 0 124 C 46 124, 78 122, 118 121"
          stroke="url(#comp-path-in)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          data-comp-path
          d="M 4 156 C 50 156, 76 130, 118 122"
          stroke="url(#comp-path-in)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          data-comp-path
          d="M 8 188 C 56 184, 80 136, 118 124"
          stroke="url(#comp-path-in)"
          strokeWidth="1.15"
          strokeLinecap="round"
        />

        {/* Energized unified pathways going right to EDIYREX architecture */}
        <path
          data-comp-path
          d="M 122 119 C 160 112, 192 92, 236 86"
          stroke="url(#comp-path-out)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          data-comp-path
          d="M 122 121 C 164 121, 194 121, 238 121"
          stroke="url(#comp-path-out)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          data-comp-path
          d="M 122 123 C 160 130, 192 150, 236 158"
          stroke="url(#comp-path-out)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Central circular transformation arrow indicator (60px) */}
      <div
        data-comp-connector-arrow
        aria-hidden="true"
        className="relative z-10 flex h-[56px] w-[56px] sm:h-[60px] sm:w-[60px] items-center justify-center rounded-full border border-[#FF8A24]/85 bg-[#120F0C]/95 text-[#FFB347] shadow-[0_0_28px_rgba(255,138,36,0.36),inset_0_0_14px_rgba(255,138,36,0.18)]"
      >
        <ArrowRight className="hidden lg:block h-5 w-5" />
        <ArrowDown className="lg:hidden h-5 w-5" />
      </div>
    </div>
  );
}
