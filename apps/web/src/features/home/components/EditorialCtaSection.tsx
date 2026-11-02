import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function EditorialCtaSection() {
  return (
    <section id="contact" className="pt-16 pb-24 bg-[#08090b] relative overflow-hidden">
      {/* Subtle warm orange ambient light flare in bottom-right corner */}
      <div
        aria-hidden="true"
        className="absolute -right-20 -bottom-24 w-72 h-72 rounded-full opacity-25 blur-[90px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #ff5e1e 0%, transparent 70%)',
        }}
      />

      <div className="container-main relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          {/* Left Large Serif Headline */}
          <div>
            <h2 className="font-editorial-italic font-normal text-[48px] sm:text-[64px] md:text-[76px] leading-[0.98] tracking-[-0.02em] text-[#f5f3ee]">
              Let’s build <br />
              <span className="font-editorial-italic">something great.</span>
            </h2>
          </div>

          {/* Right Supporting Paragraph & Action Button */}
          <div className="flex flex-col items-start gap-5 max-w-[380px] pb-2">
            <p className="text-[13px] text-[#b2b4ba] leading-relaxed">
              A video, a website, an AI agent — or a bigger idea. <br />
              Tell us what you’re planning, and we’ll help you bring it to life.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[6px] bg-[#f5f3ee] text-[#17130b] font-semibold text-[12px] tracking-wide uppercase hover:bg-white transition-colors duration-200"
            >
              <span>Start a Conversation</span>
              <ArrowUpRight size={13} className="stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
