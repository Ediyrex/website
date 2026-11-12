import React from "react";

export function WorkHeader() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[62fr_38fr] lg:items-end gap-8 lg:gap-14">
      {/* Left Column: Mixed Editorial Heading */}
      <div>
        <h2 className="m-0">
          <span
            data-sw-headline-line
            className="block font-extrabold text-[#111111] text-[clamp(2.65rem,4.8vw,4.5rem)] leading-[0.96] tracking-[-0.035em]"
          >
            Selected work
          </span>
          <span
            data-sw-headline-line
            style={{ fontFamily: "var(--font-playfair)" }}
            className="block font-normal italic text-[#111111] text-[clamp(2.35rem,4.5vw,4.25rem)] leading-[1.04] tracking-[-0.02em] pt-1"
          >
            that creates real impact
            <span
              aria-hidden="true"
              className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F36B16] ml-2 align-baseline"
            />
          </span>
        </h2>
      </div>

      {/* Right Column: Vertical Divider + Introduction + Orange Accent Bar */}
      <div
        data-sw-intro
        className="relative pl-5 max-w-[400px] lg:justify-self-end"
      >
        <span
          aria-hidden="true"
          className="absolute left-0 top-1 bottom-1 w-px bg-[#DED6CE]"
        />
        <p className="text-[16px] sm:text-[17px] lg:text-[18px] font-normal text-[#55514D] leading-[1.55]">
          A closer look at ideas, systems and products we&apos;ve built, from
          early concepts to real-world execution.
        </p>
        <span
          aria-hidden="true"
          className="mt-4 block w-9 h-[2px] bg-[#F36B16]"
        />
      </div>
    </div>
  );
}

