import React from "react";

export function OperationalHeader() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[62fr_38fr] lg:items-end gap-7 lg:gap-14">
      {/* Left Column: Identifier + Mixed-Type Headline */}
      <div>
        <div data-os-label className="flex items-center gap-3.5">
          <span aria-hidden="true" className="w-8 h-px bg-[#111111] shrink-0" />
          <span className="text-[11.5px] sm:text-[12px] font-bold uppercase tracking-[0.14em] text-[#111111]">
            OPERATIONAL SHIFT
          </span>
        </div>

        <h2 className="mt-5 m-0">
          <span
            data-os-headline-line
            className="block font-extrabold text-[#111111] text-[clamp(2.35rem,4.5vw,4.35rem)] leading-[0.98] tracking-[-0.035em]"
          >
            From fragmented tools to
          </span>
          <span
            data-os-headline-line
            style={{ fontFamily: "var(--font-playfair)" }}
            className="block font-normal italic text-[#111111] text-[clamp(2.25rem,4.3vw,4.15rem)] leading-[1.03] tracking-[-0.02em] pt-1"
          >
            one connected architecture
            <span
              aria-hidden="true"
              className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F36B16] ml-2 align-baseline"
            />
          </span>
        </h2>
      </div>

      {/* Right Column: Vertical Divider + Supporting Copy + Orange Accent Underline */}
      <div
        data-os-intro
        className="relative pl-5 max-w-[430px] lg:justify-self-end"
      >
        <span
          aria-hidden="true"
          className="absolute left-0 top-1 bottom-1 w-px bg-[#DED6CE]"
        />
        <p className="text-[16px] sm:text-[18px] lg:text-[19px] font-normal text-[#333333] leading-[1.52]">
          Unify creative, technology, media and AI into a single, integrated
          system that moves faster, works smarter and scales with you.
        </p>
        <span
          aria-hidden="true"
          className="mt-4 block w-9 h-[2px] bg-[#F36B16]"
        />
      </div>
    </div>
  );
}
