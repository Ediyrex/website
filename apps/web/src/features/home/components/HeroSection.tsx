import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#08090B]"
      style={{ paddingTop: '72px' /* header height offset */ }}
    >
      {/* ─── Full-bleed background via CSS (bypasses Next.js compression) ─── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none select-none"
        style={{
          backgroundImage: 'url(/images/hero-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: '68% center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Left-to-right dark gradient so headline stays legible */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, #08090B 28%, rgba(8,9,11,0.82) 46%, rgba(8,9,11,0.35) 62%, transparent 78%)',
        }}
      />
      {/* Bottom fade to section below */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-20 z-[2] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #08090B 0%, transparent 100%)',
        }}
      />

      {/* ─── Corner bracket decorations ─── */}
      <div
        aria-hidden="true"
        className="absolute top-[84px] left-5 sm:left-8 z-[3] pointer-events-none"
        style={{ width: 14, height: 14, borderTop: '1px solid #3A414B', borderLeft: '1px solid #3A414B' }}
      />
      <div
        aria-hidden="true"
        className="absolute top-[84px] right-5 sm:right-8 z-[3] pointer-events-none"
        style={{ width: 14, height: 14, borderTop: '1px solid #3A414B', borderRight: '1px solid #3A414B' }}
      />

      {/* ─── Content container ─── */}
      {/*
        px-5 sm:px-8 keeps content flush to real edges.
        max-w-[1360px] gives full use of wide monitors without over-stretching on ultrawide.
      */}
      <div className="relative z-[4] w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-12 min-h-[460px] lg:min-h-[510px] items-center">

          {/* ── Left: text column (6/12 cols on lg+) ── */}
          <div className="col-span-12 lg:col-span-6 flex flex-col items-start pt-10 pb-16 lg:pb-24">

            {/* Eyebrow */}
            <p className="font-inter font-medium text-[10.5px] tracking-[1.6px] uppercase text-[#F5F3EE]/75 mb-[18px]">
              A CREATIVE × TECHNOLOGY STUDIO
            </p>

            {/* Headline */}
            <h1
              className="font-manrope uppercase text-[#F5F3EE] mb-6"
              style={{
                fontWeight: 800,
                fontSize: 'clamp(38px, 4.8vw, 54px)',
                lineHeight: 0.95,
                letterSpacing: '-2.5px',
                maxWidth: 580,
              }}
            >
              CREATIVE
              <br />
              MEDIA.
              <br />
              POWERFUL WEB.
              <br />
              <span style={{ whiteSpace: 'nowrap' }}>INTELLIGENT AGENTS.</span>
            </h1>

            {/* Supporting copy */}
            <p
              className="font-inter font-normal text-[#D0CFCC] mb-8"
              style={{ fontSize: 13.5, lineHeight: 1.42, maxWidth: 450 }}
            >
              We create high-impact content, build modern web experiences,
              and automate real work with AI agents and intelligent workflows.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-[26px]">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold transition-colors duration-200"
                style={{ width: 142, height: 37, fontSize: 11.5 }}
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

          {/* ── Right: camera shows through, vertical label ── */}
          <div className="hidden lg:flex lg:col-span-6 relative min-h-[460px] lg:min-h-[510px] items-end justify-end pointer-events-none">
            {/* Vertical text label: MEDIA / WEB / AGENTS */}
            <div
              className="absolute right-0 bottom-20 z-20 flex flex-col items-end select-none"
              style={{ gap: 2 }}
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
                    color: bright ? '#F5F3EE' : '#555D69',
                    lineHeight: 1.3,
                  }}
                >
                  {label}
                </span>
              ))}
              {/* thin vertical rule */}
              <div
                style={{
                  marginTop: 5,
                  width: 1,
                  height: 32,
                  background: 'linear-gradient(to bottom, #3A414B, transparent)',
                  alignSelf: 'center',
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
