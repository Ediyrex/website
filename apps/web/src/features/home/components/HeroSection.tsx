import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#000000] min-h-[calc(100vh-72px)] min-h-[calc(100dvh-72px)] flex flex-col justify-center"
      style={{ paddingTop: '72px' }}
    >
      {/* ── Background artwork layer: Full cinematic image without clashing artificial glows ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden"
      >
        <picture className="w-full h-full block">
          <source srcSet="/images/hero-camera-master.webp" type="image/webp" />
          <img
            src="/images/hero-camera-master.jpg"
            alt="Cinematic production camera and software interface"
            className="w-full h-full object-cover object-[78%_center] md:object-[80%_center] lg:object-[82%_center] 2xl:object-[85%_center]"
            style={{
              imageRendering: 'auto',
            }}
          />
        </picture>

        {/* Optical gradient overlay ensuring pure black contrast and pristine typography on the left */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #000000 0%, #000000 32%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.20) 72%, transparent 90%)',
          }}
        />

        {/* Soft bottom edge blend into pure #000000 */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
          }}
        />
      </div>

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

        <div className="grid grid-cols-12 items-center">
          {/* Left Column: Eyebrow, Stacked Headline, Description, CTAs */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-6 flex flex-col items-start py-6">
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
                fontSize: 'clamp(40px, 4.6vw, 56px)',
                lineHeight: 0.95,
                letterSpacing: '-2.2px',
                maxWidth: 590,
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
              style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 460 }}
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

          {/* Right Column: Camera bleeds through naturally + Minimal Vertical Label */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative min-h-[460px] lg:min-h-[520px] items-end justify-end pointer-events-none">
            {/* Vertical label: MEDIA / WEB / AGENTS */}
            <div
              className="absolute right-0 bottom-12 z-20 flex flex-col items-center select-none"
              style={{ gap: 4 }}
            >
              {[
                { label: 'MEDIA', active: true },
                { label: 'WEB', active: false },
                { label: 'AGENTS', active: false },
              ].map(({ label, active }) => (
                <span
                  key={label}
                  className="font-mono text-[9px] font-semibold tracking-widest"
                  style={{
                    color: active ? '#FFFFFF' : '#737373',
                    lineHeight: 1.4,
                  }}
                >
                  {label}
                </span>
              ))}
              <div
                style={{
                  marginTop: 6,
                  width: 1,
                  height: 36,
                  background: 'linear-gradient(to bottom, #525252, transparent)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
