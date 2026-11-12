import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { STANDARDS_PRINCIPLES } from "../standards.data";

export function TransparencyCard() {
  const data = STANDARDS_PRINCIPLES.transparency;

  return (
    <div data-brutal-card className="h-full min-w-0">
      <article className="group relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-[24px] border border-[#29241E] bg-[#121110] p-6 sm:p-8 text-[#FFFDFC] shadow-[0_24px_56px_-28px_rgba(17,17,17,0.38)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[#FF6900]/65">
        {/* Warm subtle orange corner illumination */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#FF6900]/18 blur-2xl"
        />

        {/* Isolated Brutalist Concrete Architecture Photo blended into right corner */}
        <div
          data-brutal-photo
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 z-0 w-[56%] sm:w-[50%] max-w-[300px] select-none opacity-80 transition-transform duration-500 group-hover:translate-x-[-4px]"
        >
          <Image
            src="/images/standards/brutalist-concrete.png"
            alt=""
            width={1024}
            height={520}
            className="h-auto w-full object-contain object-right-bottom grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121110] via-[#121110]/45 to-transparent" />
        </div>

        {/* Top content */}
        <div className="relative z-10 max-w-[340px] space-y-3.5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[22px] font-semibold leading-none text-[#FF6900]">
              {data.number}
            </span>
            <Layers3 className="h-5 w-5 text-[#FF6900]" aria-hidden="true" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#B8B0A7]">
              {data.label}
            </span>
          </div>

          <h3 className="font-heading text-[24px] sm:text-[28px] font-bold tracking-[-0.025em] leading-[1.12] text-[#FFFDFC]">
            Nothing to hide.
          </h3>

          <p className="text-[14.5px] sm:text-[15px] leading-[1.58] text-[#C8C0B6]">
            {data.description}
          </p>
        </div>

        {/* Footer row */}
        <div className="relative z-10 mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#D8D0C6]">
            Editorial Standard · {data.annotation}
          </span>

          <Link
            href={data.href}
            aria-label={`Explore ${data.label} at EDIYREX`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#FF6900]/70 bg-transparent text-[#FFFDFC] transition-colors duration-250 hover:bg-[#FF6900] hover:border-[#FF6900] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6900]"
          >
            <ArrowRight
              className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </article>
    </div>
  );
}
