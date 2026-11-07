import { Zap, Layers, TrendingUp, Image as ImageIcon } from 'lucide-react'

export function PhilosophyBanner() {
  return (
    <section className="bg-[#000000] py-10">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        <div
          className="relative rounded-2xl overflow-hidden group hover:border-[#2C3480]/60 transition-all duration-300 flex flex-col md:flex-row items-center justify-between"
          style={{
            background: '#07090E',
            border: '1px solid #161A24',
            minHeight: 180,
          }}
        >
          {/* Subtle cobalt atmospheric glow */}
          <div
            aria-hidden="true"
            className="absolute -left-20 -top-20 w-72 h-72 rounded-full opacity-15 blur-[80px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #2C3480 0%, transparent 70%)',
            }}
          />

          {/* Left content */}
          <div
            className="relative z-10 flex flex-col justify-center"
            style={{ padding: '36px 44px', maxWidth: 540 }}
          >
            <p
              className="font-inter font-medium uppercase text-[#7E8597] mb-2"
              style={{ fontSize: 10, letterSpacing: '0.2em' }}
            >
              WHY EDIYREX
            </p>
            <h3
              className="font-manrope font-extrabold uppercase text-[#FFFFFF] mb-6"
              style={{ fontSize: 'clamp(20px, 2.4vw, 28px)', lineHeight: 1.08, letterSpacing: '-0.02em' }}
            >
              ONE TEAM FOR
              <br />
              CREATIVE &amp; AUTOMATION.
            </h3>

            {/* Three pillars */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 font-inter font-medium text-[#FFFFFF]" style={{ fontSize: 11.5 }}>
                <Zap size={14} strokeWidth={2} className="text-[#2C3480] fill-[#2C3480]/30" />
                <span>Creative + Technical</span>
              </div>
              <div className="flex items-center gap-2 font-inter font-medium text-[#D1D5DB]" style={{ fontSize: 11.5 }}>
                <Layers size={14} strokeWidth={2} className="text-[#7E8597]" />
                <span>End-to-End Execution</span>
              </div>
              <div className="flex items-center gap-2 font-inter font-medium text-[#D1D5DB]" style={{ fontSize: 11.5 }}>
                <TrendingUp size={14} strokeWidth={2} className="text-[#7E8597]" />
                <span>Built for Growth</span>
              </div>
            </div>
          </div>

          {/* Right Placeholder Visual Slot (No image files) */}
          <div className="hidden md:flex w-[40%] self-stretch items-center justify-center p-8 border-l border-[#161A24] bg-[#0C0F17]/50 relative">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#07090E] border border-[#161A24] flex items-center justify-center text-[#2C3480] mx-auto">
                <ImageIcon size={18} />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[1.5px] text-[#7E8597]">
                BANNER VISUAL PLACEHOLDER
              </p>
              <span className="text-[9px] font-mono text-[#4E5569] block">
                Awaiting landscape / studio asset
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
