import Link from 'next/link'
import { ArrowUpRight, ArrowRight } from 'lucide-react'

export function HeroIntroduction() {
  return (
    <div className="flex flex-col items-start max-w-3xl">
      {/* Supporting Eyebrow */}
      <div className="inline-flex items-center gap-2.5 mb-6 md:mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#00E5FF]">
          INDEPENDENT CREATIVE × TECHNOLOGY STUDIO
        </span>
      </div>

      {/* Primary Headline: "Ideas, engineered to move." (Electric Cyan) */}
      <h1
        className="font-manrope font-semibold text-[#00E5FF] mb-6 md:mb-8 tracking-[-0.035em] drop-shadow-[0_0_35px_rgba(0,229,255,0.15)]"
        style={{
          fontSize: 'clamp(44px, 6.6vw, 88px)',
          lineHeight: 1.02,
        }}
      >
        Ideas,
        <br />
        engineered to move.
      </h1>

      {/* Supporting Description */}
      <p className="font-inter text-[#999999] text-sm md:text-base leading-relaxed max-w-md mb-8 md:mb-10">
        We shape visual identities, build digital products and engineer intelligent systems for ambitious brands.
      </p>

      {/* Restrained Calls to Action */}
      <div className="flex flex-wrap items-center gap-6 md:gap-8">
        {/* Primary CTA Button (Neon Lime strictly for buttons) */}
        <Link
          href="/work"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#39FF14] hover:bg-[#32e012] text-[#0B0C10] font-mono font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(57,255,20,0.25)] group"
        >
          <span>Discover Our Work</span>
          <ArrowUpRight
            size={14}
            className="text-[#0B0C10] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
          />
        </Link>

        {/* Secondary CTA */}
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#999999] hover:text-[#00E5FF] transition-colors duration-200 group py-2"
        >
          <span>Start a Conversation</span>
          <ArrowRight
            size={13}
            className="text-[#666666] group-hover:text-[#00E5FF] group-hover:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </div>
    </div>
  )
}

