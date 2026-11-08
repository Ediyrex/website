import Link from 'next/link'
import { ArrowUpRight, Mail } from 'lucide-react'

export function ContactBriefSection() {
  return (
    <section className="bg-[#0B0C10] py-24 border-t border-white/[0.08]">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        <div className="rounded-xl bg-[#12141A] border border-white/[0.08] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          
          {/* Left Side: Headline & Studio Scope */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00E5FF]">
                START A CONVERSATION &middot; CONTACT EDIYREX
              </span>
            </div>

            <h2
              className="font-serif italic font-normal text-[#00E5FF] drop-shadow-[0_0_35px_rgba(0,229,255,0.15)]"
              style={{
                fontSize: 'clamp(40px, 5.5vw, 72px)',
                lineHeight: 0.96,
                letterSpacing: '-0.025em',
              }}
            >
              Let&apos;s build
              <br />
              something great.
            </h2>

            <p className="font-inter text-[#999999] text-sm md:text-base leading-relaxed mt-5 max-w-lg">
              Have a commercial film to direct, a web platform to engineer, or an autonomous AI agent to deploy? Tell us what you&apos;re planning.
            </p>
          </div>

          {/* Right Side: CTAs & Direct Contact */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-4 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#39FF14] hover:bg-[#32e012] text-[#0B0C10] font-mono font-bold text-xs px-6 py-3.5 transition-all uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.25)] group"
            >
              <span>Go to Contact Page</span>
              <ArrowUpRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <a
              href="mailto:hello@ediyrex.com"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#666666] hover:text-[#00E5FF] transition-colors py-2 px-1"
            >
              <Mail size={13} />
              <span>hello@ediyrex.com</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}

