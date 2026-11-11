import React from "react";
import Image from "next/image";

export function BackgroundTerrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
    >
      {/* Left Bottom: Monochromatic Stone Terrain */}
      <div
        data-os-terrain-left
        className="hidden md:block absolute left-0 bottom-[132px] lg:bottom-[120px] w-[200px] lg:w-[290px] xl:w-[340px] aspect-[1024/682] opacity-85"
      >
        <Image
          src="/images/operational-shift/terrain-left.png"
          alt=""
          fill
          loading="lazy"
          sizes="(min-width: 1280px) 340px, 260px"
          className="object-contain object-left-bottom"
        />
      </div>

      {/* Right Bottom: Orange-Illuminated Rocky Formation */}
      <div
        data-os-terrain-right
        className="hidden md:block absolute right-0 bottom-[132px] lg:bottom-[120px] w-[220px] lg:w-[310px] xl:w-[370px] aspect-[1024/682] opacity-95"
      >
        <Image
          src="/images/operational-shift/terrain-right.png"
          alt=""
          fill
          loading="lazy"
          sizes="(min-width: 1280px) 370px, 280px"
          className="object-contain object-right-bottom"
        />
      </div>
    </div>
  );
}
