import React from "react";
import Image from "next/image";

export function FounderCard() {
  return (
    <article
      data-about-founder
      className="relative rounded-[18px] bg-[#F5F0E9] border border-[#D9D2C8] overflow-hidden flex flex-col md:block h-full"
    >
      {/* Complete Photographic Portrait (Full 16:9 on mobile, proportional left bleed on desktop) */}
      <div className="relative w-full aspect-video md:aspect-auto md:absolute md:inset-y-0 md:left-0 md:w-[68%] bg-[#11100F] overflow-hidden">
        <Image
          src="/images/about/founder.jpg"
          alt="Founder of EDIYREX studio looking upward in dark architectural light"
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 55vw, 100vw"
          className="object-cover object-[center_20%] md:object-[25%_22%]"
        />
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(245,240,233,0) 48%, rgba(245,240,233,0.88) 65%, #F5F0E9 76%, #F5F0E9 100%)",
          }}
        />
      </div>

      {/* Right Statement & Attribution */}
      <div className="relative z-10 md:ml-[46%] md:w-[54%] h-full p-5 sm:p-5 lg:p-6 flex flex-col justify-between gap-3.5">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#111111] shrink-0">
              BEHIND THE CODE
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-[#D9D2C8]" />
          </div>

          <div className="space-y-1">
            <span
              aria-hidden="true"
              style={{ fontFamily: "var(--font-playfair)" }}
              className="block text-[28px] leading-[0.8] text-[#FF6900] select-none pt-0.5"
            >
              &ldquo;
            </span>
            <blockquote
              style={{ fontFamily: "var(--font-playfair)" }}
              className="m-0 italic text-[14.5px] sm:text-[15.5px] lg:text-[14px] xl:text-[15.5px] text-[#111111] leading-[1.38]"
            >
              We built EDIYREX because we got tired of slow, fragmented
              workflows. We wanted to create a studio that brings creativity,
              technology and automation under one roof &mdash; and actually ships
              great work.
            </blockquote>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <span aria-hidden="true" className="block h-px w-full bg-[#D9D2C8]" />
          <p className="text-[10.5px] font-semibold uppercase tracking-[1.8px] text-[#454545]">
            FOUNDER <span className="text-[#FF6900]/80 mx-1">/</span> EDIYREX
          </p>
        </div>
      </div>
    </article>
  );
}
