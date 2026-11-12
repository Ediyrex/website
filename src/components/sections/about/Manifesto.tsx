import React from "react";

export function Manifesto() {
  return (
    <div className="flex flex-col justify-center h-full lg:pr-4">
      <div className="space-y-3.5 lg:space-y-4">
        {/* Editorial Headline */}
        <h2 className="m-0 space-y-0.5">
          <span
            data-about-manifesto-line
            className="block font-extrabold text-[#111111] text-[34px] sm:text-[38px] lg:text-[38px] xl:text-[44px] 2xl:text-[50px] leading-[1.01] tracking-[-0.035em]"
          >
            We don&apos;t believe in isolated disciplines.
          </span>
          <span
            data-about-manifesto-line
            style={{ fontFamily: "var(--font-playfair)" }}
            className="block font-normal italic text-[#111111] text-[34px] sm:text-[38px] lg:text-[38px] xl:text-[44px] 2xl:text-[50px] leading-[1.04] tracking-[-0.02em] pt-0.5"
          >
            We believe in connected thinking
            <span
              aria-hidden="true"
              className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF6900] ml-1.5 align-baseline"
            />
          </span>
        </h2>

        {/* Supporting Statement */}
        <p
          data-about-manifesto-line
          className="pt-2.5 sm:pt-3 text-[14px] sm:text-[15px] xl:text-[16px] text-[#454545] leading-[1.45] max-w-[420px]"
        >
          A creative technology studio bringing strategy, design, media and
          intelligent systems together to build meaningful experiences.
        </p>

        {/* Short Orange Accent Rule */}
        <div data-about-manifesto-line className="pt-0.5">
          <span
            aria-hidden="true"
            className="block w-9 h-[2px] bg-[#FF6900]"
          />
        </div>
      </div>
    </div>
  );
}
