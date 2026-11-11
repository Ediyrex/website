import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";

export function LocationCard() {
  return (
    <Link
      href="/contact"
      data-about-location
      aria-label="Based in India — Start a conversation with EDIYREX"
      className="group relative overflow-hidden rounded-[18px] bg-[#11100F] text-white p-4 sm:p-5 min-h-[82px] lg:min-h-[88px] flex-1 flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6900]"
    >
      {/* Flowing Orange Light Background */}
      <Image
        src="/images/about/based-india.png"
        alt="Dark charcoal background with glowing warm orange light waves"
        fill
        sizes="(min-width: 1024px) 29vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover object-center transition-all duration-300 ease-out group-hover:brightness-125 group-hover:scale-[1.02]"
      />

      {/* Subtle Scrim for Crisp White Foreground */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#11100F]/80 via-[#11100F]/35 to-transparent"
      />

      <div className="relative z-10 flex items-center gap-2">
        <MapPin
          strokeWidth={1.75}
          className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6900] shrink-0"
        />
        <span className="text-[14px] sm:text-[15px] font-medium text-white tracking-[-0.01em]">
          Based in India.
        </span>
      </div>

      <ArrowUpRight
        strokeWidth={1.75}
        className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 text-white/90 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white"
      />
    </Link>
  );
}
