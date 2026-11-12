"use client";

import { TRADITIONAL_VENDORS } from "./comparison.data";
import { VendorCard } from "./VendorCard";

export function TraditionalModel() {
  return (
    <div
      data-sc-left-panel
      className="flex h-full flex-col justify-between rounded-[24px] border border-[#E5DED5] bg-[#F5F1EC] p-6 sm:p-8 lg:p-10"
    >
      <div className="space-y-4">
        <span className="inline-flex items-center rounded-full bg-[#E5DED5] px-3.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[#48433F]">
          THE TRADITIONAL WAY
        </span>

        <div className="space-y-2">
          <h3 className="font-heading text-[26px] sm:text-[30px] font-bold tracking-[-0.025em] leading-[1.12] text-[#111111]">
            Fragmented agencies
          </h3>
          <p className="text-[15px] leading-[1.55] text-[#48433F] max-w-[400px]">
            Separate vendors, more handoffs and a disjointed outcome.
          </p>
        </div>
      </div>

      {/* Horizontal row of 5 vendor cards with subtle fragmented SVG line behind */}
      <div className="relative pt-8">
        {/* Interrupted horizontal grey SVG line across gaps */}
        <svg
          aria-hidden="true"
          viewBox="0 0 600 12"
          fill="none"
          preserveAspectRatio="none"
          className="pointer-events-none hidden xl:block absolute inset-x-4 top-[calc(50%+16px)] -translate-y-1/2 h-3 w-[calc(100%-32px)] z-0"
        >
          <path
            d="M 20 6 L 118 6 M 140 6 L 235 6 M 252 6 L 348 6 M 372 6 L 462 6 M 484 6 L 580 6"
            stroke="#C9C0B5"
            strokeWidth="1.25"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3">
          {TRADITIONAL_VENDORS.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </div>
    </div>
  );
}

