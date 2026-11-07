import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#000000] min-h-[calc(100vh-86px)] min-h-[calc(100dvh-86px)] flex flex-col justify-center"
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

        {/* Subtle atmospheric Cobalt Blue glow behind camera & windows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 82% 40%, rgba(44, 52, 128, 0.22) 0%, rgba(44, 52, 128, 0.05) 45%, transparent 70%)',
          }}
        />

        {/* Left shade gradient guaranteeing headline legibility against pure #000000 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #000000 0%, #000000 28%, rgba(0,0,0,0.88) 46%, rgba(0,0,0,0.25) 66%, transparent 85%)',
          }}
        />

        {/* Soft bottom edge blend to the tools strip below */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Main Hero Content Container ── */}
      <div className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-10 lg:py-16 my-auto flex-1 flex flex-col justify-center">
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

        <div className="grid grid-cols-12 items-center">
          {/* Left Column: Eyebrow, Stacked Headline, Description, CTAs */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-6 flex flex-col items-start py-6">
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

          {/* Right Column: Vertical label MEDIA / WEB / AGENTS */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative min-h-[380px] xl:min-h-[440px] items-end justify-end pointer-events-none">
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
