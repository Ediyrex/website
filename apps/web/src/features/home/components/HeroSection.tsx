import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-12 overflow-hidden bg-[#08090b]">
      <div className="container-main relative">
        {/* Subtle Decorative Corner Brackets */}
        <div className="border-t border-l border-[#2a2f3a] w-5 h-5 absolute -top-1 -left-1 pointer-events-none" />
        <div className="border-t border-r border-[#2a2f3a] w-5 h-5 absolute -top-1 -right-1 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[480px]">
          {/* Left Content (approx 58%) */}
          <div className="lg:col-span-7 flex flex-col items-start z-10 pr-0 lg:pr-4">
            {/* Eyebrow */}
            <p className="text-[11px] font-mono tracking-[0.24em] text-[#8c92a4] uppercase mb-5">
              A CREATIVE × TECHNOLOGY STUDIO
            </p>

            {/* Main Headline */}
            <h1 className="font-sans font-extrabold text-[42px] sm:text-[56px] lg:text-[62px] leading-[0.98] tracking-[-0.03em] text-[#f5f3ee] uppercase mb-6">
              CREATIVE <br />
              MEDIA. <br />
              POWERFUL WEB. <br />
              INTELLIGENT{' '}
              <span className="font-editorial-italic font-normal tracking-normal lowercase text-[#f5f3ee]">
                agents.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-[13px] sm:text-[14px] text-[#8c92a4] max-w-[460px] leading-relaxed mb-8">
              We create high-impact content, build modern web experiences, and automate real work with AI agents and intelligent workflows.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[6px] bg-[#f5f3ee] text-[#17130b] font-semibold text-[12px] tracking-wide uppercase hover:bg-white transition-colors duration-200"
              >
                <span>Start a Project</span>
                <ArrowUpRight size={13} className="stroke-[2.5]" />
              </Link>

              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-4 py-3 text-[12px] font-medium tracking-wide text-[#f5f3ee] hover:text-[#8c92a4] transition-colors duration-200"
              >
                <span>Explore Our Work</span>
                <Play size={11} className="fill-[#f5f3ee] stroke-none ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Hero Image (Cinema Camera + Terminal Windows) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Restrained warm orange lighting from the hero */}
            <div
              aria-hidden="true"
              className="absolute -right-10 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none opacity-30 blur-[70px]"
              style={{
                background: 'radial-gradient(circle, #ff5e1e 0%, transparent 70%)',
              }}
            />

            <div className="relative w-full aspect-[16/12] rounded-xl overflow-hidden shadow-2xl border border-[#1d222b]">
              <Image
                src="/images/hero-camera.png"
                alt="Cinema camera and software terminal interface representation"
                fill
                priority
                className="object-cover object-right"
              />

              {/* Vertical Service Label on right edge */}
              <div className="absolute right-3 bottom-3 z-20 flex flex-col items-end text-[9px] font-mono tracking-widest text-[#777d87] leading-tight">
                <span className="text-[#f5f3ee] font-bold">MEDIA</span>
                <span className="text-[#8c92a4]">WEB</span>
                <span>AGENTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
