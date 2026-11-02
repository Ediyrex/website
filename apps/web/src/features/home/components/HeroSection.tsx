import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden bg-[#050507]">
      {/* Editorial Viewport Framing Brackets */}
      <div className="container-main relative">
        <div className="border-t border-l border-[#232733] w-6 h-6 absolute -top-4 -left-2 pointer-events-none" />
        <div className="border-t border-r border-[#232733] w-6 h-6 absolute -top-4 -right-2 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[580px]">
          {/* Left Column: Headlines & Copy */}
          <div className="lg:col-span-7 flex flex-col items-start z-10 pr-0 lg:pr-6">
            {/* Kicker Tag */}
            <div className="text-[11px] font-mono tracking-[0.22em] text-[#8C92A4] uppercase mb-6 flex items-center gap-2">
              <span>A CREATIVE × TECHNOLOGY STUDIO</span>
            </div>

            {/* Giant Punchy Typography */}
            <h1 className="font-sans font-extrabold text-4xl sm:text-6xl md:text-7xl leading-[0.98] tracking-tight text-white uppercase mb-7">
              CREATIVE <br />
              MEDIA. <br />
              POWERFUL WEB. <br />
              INTELLIGENT{' '}
              <span className="font-editorial-italic font-normal tracking-normal lowercase text-white">
                agents.
              </span>
            </h1>

            {/* Sub-description */}
            <p className="text-sm md:text-base text-[#8C92A4] max-w-lg leading-relaxed mb-9">
              We create high-impact content, build modern web experiences, and automate real work with AI agents and intelligent workflows.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#E5E5E5] transition-colors duration-200"
              >
                <span>Start a Project</span>
                <ArrowUpRight size={14} className="stroke-[2.5]" />
              </Link>

              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-xs tracking-wider text-white hover:text-[#8C92A4] transition-colors duration-200"
              >
                <span>Explore Our Work</span>
                <Play size={12} className="fill-white stroke-none ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Composite Visual Artifact */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Warm Cinema Glow */}
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-10 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-[90px]"
              style={{
                background: 'radial-gradient(circle, #FF5E1E 0%, #D44000 40%, transparent 70%)',
              }}
            />

            {/* The Visual Cluster Mockup Container */}
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#090A0E] border border-[#1B1E28] p-4 flex flex-col justify-between overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              {/* Fake UI Browser Window in Background */}
              <div className="w-[85%] rounded-lg bg-[#12141A] border border-[#232734] p-3 shadow-xl">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#353945]" />
                  <div className="w-2 h-2 rounded-full bg-[#353945]" />
                  <div className="w-2 h-2 rounded-full bg-[#353945]" />
                </div>
                <div className="h-24 rounded bg-[#181B22] flex items-center justify-center">
                  <span className="text-[10px] font-mono text-[#5C6370]">Next.js Platform Engine</span>
                </div>
              </div>

              {/* Cinema Camera & Studio Hardware Representation */}
              <div className="absolute right-2 -bottom-2 w-[72%] rounded-xl bg-gradient-to-tr from-[#0F1117] to-[#1C1F2B] border border-[#2D3242] p-5 shadow-2xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#FF5E1E] uppercase tracking-wider">
                    ● Cinema 6K Raw
                  </span>
                  <span className="text-[9px] font-mono text-[#5C6370]">REC 24fps</span>
                </div>
                <div className="h-20 rounded bg-[#0A0B0E] border border-[#1E212D] flex items-center justify-center overflow-hidden relative">
                  <div className="w-16 h-16 rounded-full border-2 border-[#FF5E1E]/40 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#FF5E1E]/20" />
                  </div>
                </div>
              </div>

              {/* Vertical Division Text Pillar (as seen in image) */}
              <div className="absolute right-4 bottom-4 z-20 flex flex-col items-end text-[10px] font-mono tracking-widest text-[#5C6370]">
                <span className="text-white font-bold">MEDIA</span>
                <span className="text-[#8C92A4]">WEB</span>
                <span>AGENTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
