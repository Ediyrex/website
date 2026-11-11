import React from "react";
import { IMPACT_STATISTICS } from "@/data/projects";

export function ImpactStats() {
  return (
    <div
      data-sw-stats
      className="relative w-full rounded-[20px] bg-[#FAF6F0] border border-[#E8DED4] px-6 sm:px-8 py-6 lg:py-7 min-h-[108px] overflow-hidden"
    >
      {/* Subtle Decorative Orange Flowing Contour SVG Lines on Right Side */}
      <svg
        aria-hidden="true"
        viewBox="0 0 600 140"
        fill="none"
        className="pointer-events-none absolute right-0 top-0 bottom-0 h-full w-[55%] opacity-60 z-0"
      >
        <path
          d="M 110 135 C 235 120, 325 35, 595 16"
          stroke="#F36B16"
          strokeWidth="1.15"
          strokeOpacity="0.35"
        />
        <path
          d="M 165 138 C 295 125, 390 52, 598 42"
          stroke="#FF9A52"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        <path
          d="M 220 138 C 350 130, 445 84, 598 76"
          stroke="#F36B16"
          strokeWidth="0.9"
          strokeOpacity="0.22"
        />
      </svg>

      {/* Five-Column Statistics Layout */}
      <dl className="relative z-10 grid grid-cols-2 lg:grid-cols-[1.25fr_repeat(4,1fr)] gap-y-6 gap-x-6 lg:gap-0 items-center lg:divide-x lg:divide-[#DED6CE]">
        {/* Column 01: Editorial Heading */}
        <div className="col-span-2 lg:col-span-1 lg:pr-6">
          <p className="text-[22px] sm:text-[24px] font-bold text-[#111111] leading-[1.08] tracking-[-0.025em]">
            The impact
            <span
              style={{ fontFamily: "var(--font-playfair)" }}
              className="block font-normal italic text-[24px] sm:text-[26px] leading-[1.1] pt-0.5"
            >
              in numbers
              <span
                aria-hidden="true"
                className="inline-block w-2 h-2 rounded-full bg-[#F36B16] ml-1.5 align-baseline"
              />
            </span>
          </p>
        </div>

        {/* Columns 02 - 05: Live Metrics */}
        {IMPACT_STATISTICS.map((stat) => (
          <div key={stat.id} className="lg:px-6">
            <dt className="sr-only">{stat.label}</dt>
            <dd
              data-sw-counter-target={stat.target}
              data-sw-counter-suffix={stat.suffix}
              className="text-[30px] sm:text-[34px] xl:text-[36px] font-extrabold text-[#111111] leading-none tracking-[-0.03em]"
            >
              {stat.target}
              {stat.suffix}
            </dd>
            <dd className="mt-1.5 text-[13.5px] sm:text-[14.5px] font-normal text-[#55514D]">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

