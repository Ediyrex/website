import React from "react";
import Image from "next/image";

export function PurposeCard() {
  return (
    <article
      data-about-purpose
      className="relative overflow-hidden rounded-[18px] bg-[#11100F] text-white min-h-[175px] lg:min-h-[168px] xl:min-h-[185px] flex flex-col justify-center p-5 sm:p-6 xl:p-7"
    >
      {/* Background Architectural Light Photography */}
      <Image
        src="/images/about/purpose.png"
        alt="Warm architectural beam of light across dark minimalist concrete corridor"
        fill
        sizes="(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 100vw"
        className="object-cover object-center"
      />

      {/* Left-focused Dark Scrim for High Text Contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#11100F]/92 via-[#11100F]/65 to-transparent"
      />

      {/* Minimal White Corner Brackets */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3.5 left-3.5 w-2.5 h-2.5 border-t border-l border-white/55"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3.5 left-3.5 w-2.5 h-2.5 border-b border-l border-white/55"
      />

      {/* Left-Aligned Copy */}
      <div className="relative z-10 max-w-[330px] space-y-2.5">
        <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/90">
          OUR PURPOSE
        </span>

        <p
          style={{ fontFamily: "var(--font-playfair)" }}
          className="italic font-normal text-[23px] sm:text-[25px] lg:text-[24px] xl:text-[27px] leading-[1.16] text-white"
        >
          Build brands, products and systems that create{" "}
          <span className="text-[#FF6900]">real impact.</span>
        </p>
      </div>
    </article>
  );
}
