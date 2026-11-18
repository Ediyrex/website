import React from "react";
import Link from "next/link";
import Image from "next/image";

export function EdiYrexCore() {
  return (
    <Link
      href="/services"
      aria-label="Explore all EDIYREX studio services and capabilities"
      data-os-core
      className="group relative z-20 w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] xl:w-[196px] xl:h-[196px] rounded-[28px] p-5 flex flex-col items-center justify-center gap-2.5 border border-[#FFB36B]/70 shadow-[0_24px_56px_-10px_rgba(243,107,22,0.48),inset_0_1.5px_2px_rgba(255,235,215,0.65)] transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_28px_64px_-8px_rgba(243,107,22,0.65)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      style={{
        background:
          "radial-gradient(circle at 68% 36%, rgba(255,154,82,0.92) 0%, rgba(243,107,22,0.95) 38%, rgba(36,24,16,0.98) 88%)",
      }}
    >
      {/* Glass Rim Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/20 via-transparent to-black/30"
      />

      {/* Official 3D Crystalline Faceted Emblem */}
      <Image
        src="/images/logo/ediyrex-emblem.png"
        alt=""
        width={64}
        height={64}
        className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
      />

      {/* Official Metallic Wordmark */}
      <Image
        src="/images/logo/ediyrex-wordmark.png"
        alt="EDIYREX"
        width={130}
        height={24}
        className="relative z-10 h-4 sm:h-5 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] brightness-110"
      />
    </Link>
  );
}

