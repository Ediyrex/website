import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function EditorialCtaSection() {
  return (
    <section id="contact" className="py-24 bg-[#050507] border-t border-[#12141A] relative overflow-hidden">
      {/* Subtle bottom-right amber glow as in image */}
      <div
        aria-hidden="true"
        className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full opacity-20 blur-[80px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FF5E1E 0%, transparent 70%)',
        }}
      />

      <div className="container-main relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          {/* Serif Master Headline */}
          <div>
            <h2 className="font-editorial-italic font-normal text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-white max-w-xl">
              Let&apos;s build <br />
              <span className="font-editorial-italic">something great.</span>
            </h2>
          </div>

          {/* Right Narrative & Action Button */}
          <div className="flex flex-col items-start gap-5 max-w-md">
            <p className="text-sm text-[#8C92A4] leading-relaxed">
              A video, a website, an AI agent — or a bigger idea. <br />
              Tell us what you&apos;re planning, and we&apos;ll help you bring it to life.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#E5E5E5] transition-colors duration-200"
            >
              <span>Start a Conversation</span>
              <ArrowUpRight size={14} className="stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
