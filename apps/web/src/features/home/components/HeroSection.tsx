import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#000000] min-h-[calc(100vh-72px)] min-h-[calc(100dvh-72px)] flex flex-col justify-center"
      style={{ paddingTop: '72px' }}
    >
      {/* ── Background artwork layer: Cinematic Camera & UI Windows ── */}
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

        {/* Atmospheric Cobalt Blue Deep ambient glow behind the camera & windows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 82% 40%, rgba(44, 52, 128, 0.22) 0%, rgba(44, 52, 128, 0.04) 50%, transparent 75%)',
          }}
        />

        {/* Optical gradient overlay guaranteeing pure black contrast and pristine typography on the left */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #000000 0%, #000000 28%, rgba(0,0,0,0.88) 46%, rgba(0,0,0,0.20) 68%, transparent 88%)',
          }}
        />

        {/* Soft bottom edge blend to the next section */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Main Hero Content Container ── */}
      <div className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-12 lg:py-20 my-auto flex-1 flex flex-col justify-center">
        {/* Open corner brackets framed in restrained Cobalt Blue / White */}
        <div
          aria-hidden="true"
          className="absolute top-4 left-6 sm:left-10 lg:left-14 xl:px-16 pointer-events-none"
          style={{
            width: 14,
            height: 14,
            borderTop: '1.5px solid rgba(255, 255, 255, 0.2)',
            borderLeft: '1.5px solid rgba(255, 255, 255, 0.2)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-4 right-6 sm:right-10 lg:right-14 xl:px-16 pointer-events-none"
          style={{
            width: 14,
            height: 14,
            borderTop: '1.5px solid rgba(255, 255, 255, 0.2)',
            borderRight: '1.5px solid rgba(255, 255, 255, 0.2)',
          }}
        />

        <div className="grid grid-cols-12 items-center">
          {/* Left Column: Eyebrow, Stacked Headline, Description, CTAs */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-6 flex flex-col items-start py-6">
            {/* Eyebrow */}
            <p
              className="font-inter font-medium uppercase text-[#FFFFFF]/75 mb-[18px] flex items-center gap-2"
              style={{ fontSize: 10.5, letterSpacing: '1.6px' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480] shadow-[0_0_8px_#2C3480]" />
              <span>A CREATIVE × TECHNOLOGY STUDIO</span>
            </p>

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
              className="font-inter font-normal text-[#D4D4D8] mb-8"
              style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 460 }}
            >
              We create high-impact content, build modern web experiences,
              and automate real work with AI agents and intelligent workflows.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-6">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-[#FFFFFF] hover:bg-[#F4F4F5] text-[#000000] font-inter font-semibold transition-all duration-200 shadow-[0_0_24px_rgba(255,255,255,0.18)] hover:shadow-[0_0_32px_rgba(255,255,255,0.28)]"
                style={{ width: 144, height: 38, fontSize: 12 }}
              >
                <span>Start a Project</span>
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>

              <Link
                href="/work"
                className="inline-flex items-center gap-2 font-inter font-medium text-[#FFFFFF] hover:text-[#D4D4D8] transition-colors duration-200 group"
                style={{ fontSize: 12 }}
              >
                <span>Explore Our Work</span>
                <div className="w-5 h-5 rounded-full border border-white/20 group-hover:border-white/50 flex items-center justify-center transition-colors">
                  <Play size={8} className="fill-[#FFFFFF] stroke-[#FFFFFF] translate-x-[0.5px]" />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: Camera bleeds through + Minimal Vertical Label */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative min-h-[460px] lg:min-h-[520px] items-end justify-end pointer-events-none">
            {/* Vertical label: MEDIA / WEB / AGENTS */}
            <div
              className="absolute right-0 bottom-12 z-20 flex flex-col items-center select-none"
              style={{ gap: 4 }}
            >
              {[
                { label: 'MEDIA', bright: true },
                { label: 'WEB', bright: false },
                { label: 'AGENTS', bright: false },
              ].map(({ label, bright }) => (
                <span
                  key={label}
                  className="font-inter font-semibold tracking-widest"
                  style={{
                    fontSize: 9,
                    color: bright ? '#FFFFFF' : '#71717A',
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
                  height: 36,
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
