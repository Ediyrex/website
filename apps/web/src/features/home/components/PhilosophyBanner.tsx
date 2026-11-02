import Image from 'next/image'
import { Zap, Layers, TrendingUp } from 'lucide-react'

export function PhilosophyBanner() {
  return (
    <section className="bg-[#08090B] py-8">
      <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: '#0D0F12',
            border: '1px solid #252A32',
            minHeight: 180,
          }}
        >
          {/* Left content */}
          <div
            className="relative z-10 flex flex-col justify-center"
            style={{ padding: '32px 40px', maxWidth: 480 }}
          >
            <p
              className="font-inter font-medium uppercase text-[#777D87] mb-2"
              style={{ fontSize: 10, letterSpacing: '0.2em' }}
            >
              WHY EDIYREX
            </p>
            <h3
              className="font-manrope font-extrabold uppercase text-[#F5F3EE] mb-6"
              style={{ fontSize: 'clamp(20px, 2.4vw, 28px)', lineHeight: 1.08, letterSpacing: '-0.02em' }}
            >
              ONE TEAM FOR
              <br />
              CREATIVE &amp; AUTOMATION.
            </h3>

            {/* Three pillars */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 font-inter font-medium text-[#F5F3EE]" style={{ fontSize: 11 }}>
                <Zap size={13} strokeWidth={2} />
                <span>Creative + Technical</span>
              </div>
              <div className="flex items-center gap-2 font-inter font-medium text-[#B2B4BA]" style={{ fontSize: 11 }}>
                <Layers size={13} strokeWidth={2} className="text-[#8C92A4]" />
                <span>End-to-End Execution</span>
              </div>
              <div className="flex items-center gap-2 font-inter font-medium text-[#B2B4BA]" style={{ fontSize: 11 }}>
                <TrendingUp size={13} strokeWidth={2} className="text-[#8C92A4]" />
                <span>Built for Growth</span>
              </div>
            </div>
          </div>

          {/* Right mountain image — absolutely positioned, fills right half */}
          <div className="absolute inset-y-0 right-0 w-[48%] md:w-[45%] hidden md:block">
            {/* Left-edge gradient mask blending into card background */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-28 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, #0D0F12, transparent)' }}
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
