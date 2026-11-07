import Image from 'next/image'
import { Zap, Layers, TrendingUp } from 'lucide-react'

export function PhilosophyBanner() {
  return (
    <section className="bg-[#000000] py-10">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        <div
          className="relative rounded-2xl overflow-hidden group hover:border-[#2C3480]/60 transition-all duration-300"
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
            style={{ padding: '36px 44px', maxWidth: 520 }}
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

          {/* Right mountain image — absolutely positioned */}
          <div className="absolute inset-y-0 right-0 w-[48%] md:w-[45%] hidden md:block">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, #07090E, transparent)' }}
            />
            <Image
              src="/images/banner-mountains.png"
              alt="Dramatic monochrome mountain peak"
              fill
              className="object-cover object-center"
              sizes="45vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
