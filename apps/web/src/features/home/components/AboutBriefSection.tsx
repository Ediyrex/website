import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function AboutBriefSection() {
  return (
    <section className="bg-[#000000] py-20 border-t border-neutral-800">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left: Eyebrow + Manifesto Heading (7 cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                ABOUT EDIYREX STUDIO
              </span>
            </div>

            <h2
              className="font-manrope font-extrabold uppercase text-2xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight"
            >
              ONE INTEGRATED PARTNER FOR
              <br />
              CREATIVITY, TECHNOLOGY
              <br />
              <span className="text-neutral-500">&amp; AUTONOMOUS INTELLIGENCE.</span>
            </h2>
          </div>

          {/* Right: Narrative Brief + Studio Specs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between pt-2">
            <p className="font-inter text-neutral-400 text-sm md:text-base leading-relaxed mb-8">
              We eliminate the friction and fragmentation of hiring disconnected video boutiques, web agencies, and AI consultancies. Ediyrex operates as an agile, full-stack studio delivering cinema-grade visuals, resilient digital products, and production-ready automated systems under one unified standard.
            </p>

            {/* Quick Studio Specs */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-neutral-800 mb-8">
              <div>
                <p className="font-manrope font-extrabold text-2xl text-white">03</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 mt-1">Disciplines</p>
              </div>
              <div>
                <p className="font-manrope font-extrabold text-2xl text-white">100%</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 mt-1">In-House Craft</p>
              </div>
              <div>
                <p className="font-manrope font-extrabold text-2xl text-white">34+</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 mt-1">Deployments</p>
              </div>
            </div>

            <div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-inter font-medium text-xs text-white hover:text-neutral-300 transition-colors uppercase tracking-wider"
              >
                <span>Read Full Studio Story</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

