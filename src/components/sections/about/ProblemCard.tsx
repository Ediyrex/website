import React from "react";
import Image from "next/image";

export function ProblemCard() {
  return (
    <article
      data-about-problem
      className="relative overflow-hidden rounded-[18px] bg-[#F5F0E9] border border-[#D9D2C8] p-5 sm:p-6 xl:p-6 flex flex-col justify-between min-h-[160px] lg:min-h-[168px] xl:min-h-[185px]"
    >
      {/* Textured Off-White & Subtle Orange Arc Background */}
      <Image
        src="/images/about/problem-bg.jpg"
        alt="Warm off-white textured background with subtle orange arc"
        fill
        sizes="(min-width: 1024px) 22vw, (min-width: 768px) 35vw, 100vw"
        className="object-cover object-center"
      />

      <span className="relative z-10 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#111111]">
        THE BIG PROBLEM
      </span>

      <div className="relative z-10 space-y-3 mt-3">
        <p className="text-[15px] sm:text-[16px] lg:text-[15.5px] xl:text-[17px] font-normal text-[#171717] leading-[1.38]">
          Great ideas often fail because creative, technology and execution work
          in silos.
        </p>
        <span
          aria-hidden="true"
          className="block w-8 h-[2px] bg-[#FF6900]"
        />
      </div>
    </article>
  );
}
