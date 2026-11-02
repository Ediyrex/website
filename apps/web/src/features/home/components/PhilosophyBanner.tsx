import { Zap, Layers, TrendingUp } from 'lucide-react'

export function PhilosophyBanner() {
  return (
    <section className="py-12 bg-[#050507]">
      <div className="container-main">
        {/* Wide Dark Frosted Banner with Mountains visual background */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#0D0F14] via-[#10131B] to-[#0A0B0F] border border-[#1E222D] p-8 md:p-12 overflow-hidden shadow-2xl">
          {/* Subtle Mountain Contour / Gradient Texture Overlay */}
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 opacity-25 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 80% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)',
            }}
          />

          <div className="relative z-10 max-w-xl">
            {/* Kicker */}
            <p className="text-[11px] font-mono tracking-widest text-[#8C92A4] uppercase mb-3">
              WHY EDIYREX
            </p>

            {/* Headline */}
            <h3 className="font-sans font-extrabold text-2xl sm:text-4xl leading-tight text-white uppercase mb-8">
              ONE TEAM FOR <br />
              CREATIVE &amp; AUTOMATION.
            </h3>

            {/* Three Value Bullets */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4 border-t border-[#1C202B]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D1D5E0]">
                <Zap size={14} className="text-[#FF5E1E]" />
                <span>Creative + Technical</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#D1D5E0]">
                <Layers size={14} className="text-[#8C92A4]" />
                <span>End-to-End Execution</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#D1D5E0]">
                <TrendingUp size={14} className="text-[#8C92A4]" />
                <span>Built for Growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
