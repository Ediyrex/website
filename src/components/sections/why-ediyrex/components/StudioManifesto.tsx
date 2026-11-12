import React from "react";
import { SectionLabel } from "./SectionLabel";

export function StudioManifesto() {
  return (
    <div className="space-y-6">
      <SectionLabel text="WHY EDIYREX" />

      <h2 className="m-0">
        <span
          data-we-manifesto-line
          className="block font-bold text-[#111111] text-[clamp(2.25rem,3.9vw,3.85rem)] leading-[1.03] tracking-[-0.035em]"
        >
          Creative thinking.
        </span>
        <span
          data-we-manifesto-line
          className="block font-bold text-[#111111] text-[clamp(2.25rem,3.9vw,3.85rem)] leading-[1.03] tracking-[-0.035em]"
        >
          Technical execution.
        </span>
        <span
          data-we-manifesto-line
          style={{ fontFamily: "var(--font-playfair)" }}
          className="block font-normal italic text-[#111111] text-[clamp(2.2rem,3.8vw,3.75rem)] leading-[1.08] tracking-[-0.02em] pt-0.5"
        >
          One connected process
          <span
            aria-hidden="true"
            className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF6500] ml-2 align-baseline"
          />
        </span>
      </h2>

      <p
        data-we-manifesto-copy
        className="pt-3 sm:pt-4 text-[17px] sm:text-[18.5px] lg:text-[19px] font-normal text-[#44403D] leading-[1.52] max-w-[520px]"
      >
        We bring strategy, creative direction, technology and intelligent
        systems together to transform ideas into meaningful outcomes.
      </p>

      <div data-we-manifesto-copy className="space-y-4 pt-1">
        <span aria-hidden="true" className="block w-11 h-[2px] bg-[#FF6500]" />
        <p className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.08em] text-[#FF6500]">
          THINK DIFFERENTLY. BUILD CONNECTEDLY.
        </p>
      </div>
    </div>
  );
}

