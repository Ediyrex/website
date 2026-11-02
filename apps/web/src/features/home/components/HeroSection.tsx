import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#08090B] min-h-[calc(100vh-86px)] min-h-[calc(100dvh-86px)] flex flex-col justify-center"
      style={{ paddingTop: '72px' }}
    >
      {/* ── Background artwork layer: Full-bleed edge to edge ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden"
      >
        <picture className="w-full h-full block">
          <source srcSet="/images/hero-camera-master.webp" type="image/webp" />
          <img
            src="/images/hero-camera-master.jpg"
            alt="Cinematic production camera and software interface"
            className="w-full h-full object-cover object-[76%_center] md:object-[80%_center] lg:object-[82%_center] 2xl:object-[85%_center]"
            style={{
              imageRendering: 'auto',
            }}
          />
        </picture>

        {/* Left shade gradient guaranteeing headline legibility while letting artwork & light streaks shine */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #08090B 0%, #08090B 28%, rgba(8,9,11,0.85) 46%, rgba(8,9,11,0.2) 66%, transparent 85%)',
          }}
        />

        {/* Soft bottom edge blend to the tools strip below */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #08090B 0%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Main Hero Content Container ── */}
      <div className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-10 lg:py-16 my-auto flex-1 flex flex-col justify-center">
        {/* Open corner brackets aligned with content grid */}
        <div
          aria-hidden="true"
          className="absolute top-4 left-6 sm:left-10 lg:left-14 xl:left-16 pointer-events-none"
          style={{
            width: 14,
            height: 14,
            borderTop: '1px solid #3A414B',
            borderLeft: '1px solid #3A414B',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-4 right-6 sm:right-10 lg:right-14 xl:right-16 pointer-events-none"
          style={{
            width: 14,
            height: 14,
            borderTop: '1px solid #3A414B',
            borderRight: '1px solid #3A414B',
          }}
        />

        <div className="grid grid-cols-12 items-center">
          {/* Left Column: Eyebrow, Stacked Headline, Description, CTAs */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-6 flex flex-col items-start py-6">
            {/* Eyebrow: Inter Medium, 10.5px, letter spacing 1.6px */}
            <p
              className="font-inter font-medium uppercase text-[#F5F3EE]/80 mb-[18px]"
              style={{ fontSize: 10.5, letterSpacing: '1.6px' }}
            >
              A CREATIVE × TECHNOLOGY STUDIO
            </p>

            {/* Headline: Manrope 800, tight tracking, exact line breaks */}
            <h1
              className="font-manrope uppercase text-[#F5F3EE] mb-6"
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

            {/* Supporting Copy: Inter Regular 13.5px, line-height 1.4 */}
            <p
              className="font-inter font-normal text-[#D0CFCC] mb-8"
              style={{ fontSize: 13.5, lineHeight: 1.45, maxWidth: 450 }}
            >
              We create high-impact content, build modern web experiences,
              and automate real work with AI agents and intelligent workflows.
            </p>

            {/* CTAs: 140x37px primary ivory button + secondary link */}
            <div className="flex items-center gap-[26px]">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold transition-colors duration-200"
                style={{ width: 140, height: 37, fontSize: 11.5 }}
              >
                <span>Start a Project</span>
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </Link>

              <Link
                href="/work"
                className="inline-flex items-center gap-[9px] font-inter font-medium text-[#F5F3EE] hover:text-[#D0CFCC] transition-colors duration-200"
                style={{ fontSize: 11.5 }}
              >
                <span>Explore Our Work</span>
                <Play size={10} className="fill-[#F5F3EE] stroke-[#F5F3EE]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Spacer that allows camera & windows to shine, with vertical label */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative min-h-[380px] xl:min-h-[440px] items-end justify-end pointer-events-none">
            {/* Vertical label: MEDIA / WEB / AGENTS */}
            <div
              className="absolute right-0 bottom-8 z-20 flex flex-col items-center select-none"
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
                    color: bright ? '#F5F3EE' : '#68707C',
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
                  height: 32,
                  background: 'linear-gradient(to bottom, #3A414B, transparent)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
