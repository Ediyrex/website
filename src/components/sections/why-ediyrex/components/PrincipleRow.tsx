import React from "react";
import type { OperatingPrinciple } from "../data/studioProducts";

export function PrincipleRow({ principle }: { principle: OperatingPrinciple }) {
  return (
    <div
      data-we-principle
      className="group py-5 sm:py-6 border-b border-[#D8CEC3] flex items-start gap-5 sm:gap-6 transition-colors duration-300"
    >
      {/* Large Italic Serif Orange Number */}
      <span
        style={{ fontFamily: "var(--font-playfair)" }}
        className="w-14 sm:w-16 shrink-0 text-[38px] sm:text-[44px] italic font-normal leading-[0.9] text-[#FF6500] transition-all duration-300 ease-out group-hover:translate-x-1.5 group-hover:text-[#D94B00]"
      >
        {principle.number}
      </span>

      {/* Vertical Separator Extending Subtly on Hover */}
      <span
        aria-hidden="true"
        className="w-px h-11 sm:h-12 bg-[#D8CEC3] shrink-0 mt-1 transition-all duration-300 ease-out group-hover:h-14 group-hover:bg-[#FF6500]/55"
      />

      {/* Principle Heading & Supporting Text */}
      <div className="min-w-0 space-y-1">
        <h3 className="text-[22px] sm:text-[25px] lg:text-[26px] font-bold text-[#111111] leading-[1.15] tracking-[-0.02em] transition-colors duration-300 group-hover:text-black">
          {principle.title}
        </h3>
        <p className="text-[14.5px] sm:text-[15.5px] text-[#44403D] leading-[1.48]">
          {principle.description}
        </p>
      </div>
    </div>
  );
}

