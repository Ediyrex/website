import Image from 'next/image'
import { Zap, Layers, TrendingUp } from 'lucide-react'

export function PhilosophyBanner() {
  return (
    <section className="py-10 bg-[#08090b]">
      <div className="container-main">
        {/* Horizontal Rounded Banner with Right Mountain Photograph */}
        <div className="relative rounded-2xl bg-[#0d0f12] border border-[#252a32] overflow-hidden min-h-[170px] flex flex-col md:flex-row items-center justify-between">
          {/* Left Content Area */}
          <div className="relative z-10 p-7 md:p-9 max-w-lg">
            <p className="text-[10px] font-mono tracking-[0.2em] text-[#777d87] uppercase mb-2">
              WHY EDIYREX
            </p>

            <h3 className="font-sans font-extrabold text-[22px] sm:text-[28px] leading-[1.08] text-[#f5f3ee] uppercase tracking-[-0.02em] mb-6">
              ONE TEAM FOR <br />
              CREATIVE &amp; AUTOMATION.
            </h3>

            {/* Three Points with Line Icons */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-7">
              <div className="flex items-center gap-2 text-[11px] font-medium text-[#f5f3ee]">
                <Zap size={13} className="text-[#f5f3ee] stroke-[2]" />
                <span>Creative + Technical</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-medium text-[#b2b4ba]">
                <Layers size={13} className="text-[#8c92a4] stroke-[2]" />
                <span>End-to-End Execution</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-medium text-[#b2b4ba]">
                <TrendingUp size={13} className="text-[#8c92a4] stroke-[2]" />
                <span>Built for Growth</span>
              </div>
            </div>
          </div>

          {/* Right Monochrome Mountain Image fading into background */}
          <div className="relative w-full md:w-[48%] h-48 md:h-[220px] self-stretch">
            {/* Dark gradient mask from left to blend with background */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#0d0f12] via-transparent to-transparent z-10 pointer-events-none hidden md:block"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-transparent to-transparent z-10 pointer-events-none md:hidden"
            />
            <Image
              src="/images/banner-mountains.png"
              alt="Dramatic monochrome mountain peak in fog"
              fill
              className="object-cover object-right"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
