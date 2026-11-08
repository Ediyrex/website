import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function AboutBriefSection() {
  return (
    <section className="bg-[#080808] py-20 border-t border-white/[0.08]">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left: Eyebrow + Manifesto Heading (7 cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#999999]">
                ABOUT EDIYREX STUDIO
              </span>
            </div>

            <h2 className="font-manrope font-semibold text-2xl sm:text-4xl lg:text-5xl tracking-tight text-[#EAEAEA] leading-tight">
              ONE INTEGRATED PARTNER FOR
              <br />
              CREATIVITY, TECHNOLOGY
              <br />
              <span className="text-[#666666]">&amp; AUTONOMOUS INTELLIGENCE.</span>
            </h2>
          </div>

          {/* Right: Narrative Brief + Studio Specs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between pt-2">
            <p className="font-inter text-[#999999] text-sm md:text-base leading-relaxed mb-8">
              We eliminate the friction and fragmentation of hiring disconnected video boutiques, web agencies, and AI consultancies. Ediyrex operates as an agile, full-stack studio delivering cinema-grade visuals, resilient digital products, and production-ready automated systems under one unified standard.
            </p>

            {/* Quick Studio Specs */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/[0.08] mb-8">
              <div>
                <p className="font-manrope font-semibold text-2xl text-[#EAEAEA]">03</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#666666] mt-1">Disciplines</p>
              </div>
              <div>
                <p className="font-manrope font-semibold text-2xl text-[#EAEAEA]">100%</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#666666] mt-1">In-House Craft</p>
              </div>
              <div>
                <p className="font-manrope font-semibold text-2xl text-[#EAEAEA]">34+</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#666666] mt-1">Deployments</p>
              </div>
            </div>

            <div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-inter font-medium text-xs text-[#EAEAEA] hover:text-white transition-colors uppercase tracking-wider group"
              >
                <span>Read Full Studio Story</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

