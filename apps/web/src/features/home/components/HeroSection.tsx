import Link from 'next/link'
import { ArrowUpRight, Play, Image as ImageIcon } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#000000] min-h-[calc(100vh-86px)] min-h-[calc(100dvh-86px)] flex flex-col justify-center"
      style={{ paddingTop: '72px' }}
    >
      {/* ── Background atmospheric Cobalt glow (Pure CSS, no raster images) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden"
      >
        {/* Cobalt Blue Deep atmospheric ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 78% 45%, rgba(44, 52, 128, 0.20) 0%, rgba(44, 52, 128, 0.04) 50%, transparent 75%)',
          }}
        />

        {/* Soft bottom edge blend */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Main Hero Content Container ── */}
      <div className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-12 lg:py-16 my-auto flex-1 flex flex-col justify-center">
        {/* Open corner brackets framed in Cobalt Blue */}
        <div
          aria-hidden="true"
          className="absolute top-4 left-6 sm:left-10 lg:left-14 xl:left-16 pointer-events-none"
          style={{
            width: 14,
            height: 14,
            borderTop: '1.5px solid #2C3480',
            borderLeft: '1.5px solid #2C3480',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-4 right-6 sm:right-10 lg:right-14 xl:right-16 pointer-events-none"
          style={{
            width: 14,
            height: 14,
            borderTop: '1.5px solid #2C3480',
            borderRight: '1.5px solid #2C3480',
          }}
        />

        <div className="grid grid-cols-12 items-center gap-10">
          {/* Left Column: Eyebrow, Stacked Headline, Description, CTAs */}
          <div className="col-span-12 lg:col-span-6 flex flex-col items-start py-6">
            {/* Eyebrow */}
            <p
              className="font-inter font-medium uppercase text-[#FFFFFF]/85 mb-[18px]"
              style={{ fontSize: 10.5, letterSpacing: '1.6px' }}
            >
              A CREATIVE × TECHNOLOGY STUDIO
            </p>

            {/* Headline */}
            <h1
              className="font-manrope uppercase text-[#FFFFFF] mb-6"
              style={{
                fontWeight: 800,
                fontSize: 'clamp(38px, 4.4vw, 54px)',
                lineHeight: 0.96,
                letterSpacing: '-2.2px',
                maxWidth: 580,
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
              className="font-inter font-normal text-[#D1D5DB] mb-8"
              style={{ fontSize: 13.5, lineHeight: 1.45, maxWidth: 450 }}
            >
              We create high-impact content, build modern web experiences,
              and automate real work with AI agents and intelligent workflows.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-[26px]">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-[#FFFFFF] hover:bg-[#F2F4F8] text-[#000000] font-inter font-semibold transition-colors duration-200 shadow-[0_0_24px_rgba(255,255,255,0.15)]"
                style={{ width: 140, height: 37, fontSize: 11.5 }}
              >
                <span>Start a Project</span>
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </Link>

              <Link
                href="/work"
                className="inline-flex items-center gap-[9px] font-inter font-medium text-[#FFFFFF] hover:text-[#D1D5DB] transition-colors duration-200"
                style={{ fontSize: 11.5 }}
              >
                <span>Explore Our Work</span>
                <Play size={10} className="fill-[#FFFFFF] stroke-[#FFFFFF]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual Artwork Placeholder Frame */}
          <div className="hidden lg:flex lg:col-span-6 relative w-full items-center justify-end">
            <div className="w-full aspect-[16/10] max-w-[580px] rounded-2xl border border-[#161A24] bg-[#07090E]/60 flex flex-col items-center justify-center p-8 relative overflow-hidden group hover:border-[#2C3480]/50 transition-all duration-300">
              {/* Corner crosshairs */}
              <div className="absolute top-3 left-3 text-[#2C3480] text-[10px] font-mono">+</div>
              <div className="absolute top-3 right-3 text-[#2C3480] text-[10px] font-mono">+</div>
              <div className="absolute bottom-3 left-3 text-[#2C3480] text-[10px] font-mono">+</div>
              <div className="absolute bottom-3 right-3 text-[#2C3480] text-[10px] font-mono">+</div>

              {/* Placeholder Content */}
              <div className="w-12 h-12 rounded-xl bg-[#0C0F17] border border-[#1C2230] flex items-center justify-center text-[#2C3480] mb-3 group-hover:scale-105 transition-transform">
                <ImageIcon size={22} />
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[2px] text-[#FFFFFF] font-medium">
                HERO ARTWORK PLACEHOLDER
              </p>
              <p className="font-inter text-[12px] text-[#7E8597] mt-1 text-center max-w-xs">
                Awaiting final visual asset upload
              </p>
              <div className="mt-4 px-3 py-1 rounded-full bg-[#0C0F17] border border-[#161A24] text-[10px] font-mono text-[#7E8597]">
                16:9 &bull; Cinematic Artwork Slot
              </div>
            </div>

            {/* Vertical label: MEDIA / WEB / AGENTS */}
            <div
              className="absolute -right-8 bottom-4 z-20 flex flex-col items-center select-none"
              style={{ gap: 3 }}
            >
              {[
                { label: 'MEDIA', bright: true },
                { label: 'WEB', bright: false },
                { label: 'AGENTS', bright: false },
              ].map(({ label, bright }) => (
                <span
                  key={label}
                  className="font-inter font-medium tracking-widest"
                  style={{
                    fontSize: 9,
                    color: bright ? '#FFFFFF' : '#7E8597',
                    lineHeight: 1.4,
                  }}
                >
                  {label}
                </span>
              ))}
              <div
                style={{
                  marginTop: 6,
                  width: 1.5,
                  height: 32,
                  background: 'linear-gradient(to bottom, #2C3480, transparent)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
