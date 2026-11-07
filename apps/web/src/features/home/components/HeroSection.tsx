import Link from 'next/link'
import { ArrowUpRight, Play, Film, Code, Bot } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#000000] min-h-[calc(100vh-72px)] min-h-[calc(100dvh-72px)] flex flex-col justify-center"
      style={{ paddingTop: '72px' }}
    >
      {/* ── Main Hero Content Container ── */}
      <div className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-12 lg:py-20 my-auto flex-1 flex flex-col justify-center">
        {/* Architectural corner brackets */}
        <div
          aria-hidden="true"
          className="absolute top-4 left-6 sm:left-10 lg:left-14 xl:px-16 pointer-events-none"
          style={{
            width: 14,
            height: 14,
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-4 right-6 sm:right-10 lg:right-14 xl:px-16 pointer-events-none"
          style={{
            width: 14,
            height: 14,
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            borderRight: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        />

        <div className="grid grid-cols-12 items-center gap-10 lg:gap-14">
          {/* Left Column: Eyebrow, Stacked Headline, Description, CTAs */}
          <div className="col-span-12 lg:col-span-7 flex flex-col items-start py-6">
            {/* Eyebrow with subtle Cobalt Flavour dot */}
            <div className="inline-flex items-center gap-2.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                A CREATIVE × TECHNOLOGY STUDIO
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-manrope uppercase text-[#FFFFFF] mb-6"
              style={{
                fontWeight: 800,
                fontSize: 'clamp(40px, 4.6vw, 58px)',
                lineHeight: 0.95,
                letterSpacing: '-2.2px',
                maxWidth: 600,
              }}
            >
              CREATIVE
              <br />
              MEDIA.
              <br />
              POWERFUL WEB.
              <br />
              <span className="whitespace-nowrap">INTELLIGENT AGENTS.</span>
            </h1>

            {/* Supporting Copy */}
            <p
              className="font-inter font-normal text-neutral-400 mb-8"
              style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 480 }}
            >
              We create high-impact content, build modern web experiences,
              and automate real work with AI agents and intelligent workflows.
            </p>

            {/* Stark Black & White CTAs */}
            <div className="flex items-center gap-5">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FFFFFF] hover:bg-neutral-200 text-[#000000] font-inter font-semibold transition-colors duration-200"
                style={{ width: 144, height: 40, fontSize: 12 }}
              >
                <span>Start a Project</span>
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>

              <Link
                href="/work"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-700 hover:border-white text-[#FFFFFF] font-inter font-medium transition-colors duration-200 group"
                style={{ height: 40, paddingLeft: 18, paddingRight: 18, fontSize: 12 }}
              >
                <span>Explore Work</span>
                <Play size={10} className="fill-[#FFFFFF] stroke-[#FFFFFF] opacity-80 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Discipline Matrix (Pure Code & Typography, No Raster Images) */}
          <div className="col-span-12 lg:col-span-5 relative w-full flex flex-col justify-center">
            <div className="w-full rounded-xl bg-[#080808] border border-neutral-800 p-7 lg:p-8 relative">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2C3480]" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                    STUDIO DISCIPLINES &amp; ARCHITECTURE
                  </span>
                </div>
                <span className="font-mono text-[10px] text-neutral-400">
                  SYSTEM ACTIVE
                </span>
              </div>

              {/* Three Structured Discipline Rows */}
              <div className="space-y-4">
                {/* 01: Media */}
                <Link
                  href="/media"
                  className="group block p-4 rounded-lg bg-[#000000] border border-neutral-850 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Film size={14} className="text-neutral-400 group-hover:text-white transition-colors" />
                      <span className="font-manrope font-bold text-xs text-white uppercase tracking-wider">
                        01 / Media Production
                      </span>
                    </div>
                    <ArrowUpRight size={12} className="text-neutral-400 group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-inter text-[11.5px] text-neutral-400 leading-relaxed">
                    Commercial films, brand documentaries, photography &amp; social systems.
                  </p>
                </Link>

                {/* 02: Web */}
                <Link
                  href="/web"
                  className="group block p-4 rounded-lg bg-[#000000] border border-neutral-850 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Code size={14} className="text-neutral-400 group-hover:text-white transition-colors" />
                      <span className="font-manrope font-bold text-xs text-white uppercase tracking-wider">
                        02 / Web &amp; Digital
                      </span>
                    </div>
                    <ArrowUpRight size={12} className="text-neutral-400 group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-inter text-[11.5px] text-neutral-400 leading-relaxed">
                    High-performance Next.js apps, SaaS platforms &amp; bespoke UI/UX.
                  </p>
                </Link>

                {/* 03: Agents */}
                <Link
                  href="/agents-automation"
                  className="group block p-4 rounded-lg bg-[#000000] border border-neutral-850 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Bot size={14} className="text-neutral-400 group-hover:text-white transition-colors" />
                      <span className="font-manrope font-bold text-xs text-white uppercase tracking-wider">
                        03 / Agents &amp; Automation
                      </span>
                    </div>
                    <ArrowUpRight size={12} className="text-neutral-400 group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-inter text-[11.5px] text-neutral-400 leading-relaxed">
                    Autonomous AI agents, conversational voice bots &amp; enterprise workflows.
                  </p>
                </Link>
              </div>

              {/* Bottom Telemetry Strip */}
              <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between font-mono text-[9.5px] text-neutral-400">
                <span>STACK: NEXT.JS / REACT / TS</span>
                <span className="text-neutral-400">GLOBAL CDN READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
