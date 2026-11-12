import React from "react";

export function ArchitectureHeader() {
  return (
    <div className="max-w-[660px] space-y-4">
      {/* Mixed-Type Editorial Headline */}
      <h2 className="m-0">
        <span
          data-arch-headline-line
          className="block font-extrabold text-[#111111] text-[34px] sm:text-[44px] md:text-[48px] lg:text-[46px] xl:text-[54px] 2xl:text-[60px] leading-[0.95] tracking-[-0.04em]"
        >
          Built as one connected
        </span>
        <span
          data-arch-headline-line
          style={{ fontFamily: "var(--font-playfair)" }}
          className="block font-normal italic text-[#111111] text-[38px] sm:text-[48px] md:text-[52px] lg:text-[50px] xl:text-[58px] 2xl:text-[64px] leading-[0.9] tracking-[-0.02em] pt-0.5"
        >
          system
          <span
            aria-hidden="true"
            className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF6900] ml-1.5 align-baseline"
          />
        </span>
      </h2>

      {/* Supporting Paragraph */}
      <p
        data-arch-intro-copy
        className="text-[14.5px] sm:text-[15.5px] xl:text-[16.5px] font-normal text-[#333333] leading-[1.48] max-w-[540px] pt-2"
      >
        Explore how our divisions interlock&mdash;from interactive workflow
        planning to production launch.
      </p>
    </div>
  );
}

