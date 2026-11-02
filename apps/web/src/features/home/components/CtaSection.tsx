import Link from 'next/link'
import { ArrowUpRight, Mail } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { SITE } from '@/shared/constants'

export function CtaSection() {
  return (
    <section id="contact" className="section-gap relative overflow-hidden bg-[#12151A]/80 border-t border-[#1C2028]">
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(214,183,122,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="container-main relative z-10 text-center">
        <span className="label-mono mb-4 inline-block">Direct Collaboration</span>
        
        <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-[#F0EDE8] max-w-3xl mx-auto leading-tight text-balance">
          Have an ambitious project in mind? Let&apos;s build something{' '}
          <span className="text-gradient-accent">extraordinary</span> together.
        </h2>

        <p className="mt-6 text-[#9AA0AB] text-base md:text-lg max-w-xl mx-auto leading-relaxed text-balance">
          Whether you need a full-scale digital product, cinema-grade brand media, or custom AI agent automation, our studio delivers turnkey excellence.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/contact">
            <Button variant="primary" size="lg" rightIcon={<ArrowUpRight size={16} />}>
              Start a Project Enquiry
            </Button>
          </Link>
          <a href={`mailto:${SITE.email}`}>
            <Button variant="secondary" size="lg" leftIcon={<Mail size={16} />}>
              {SITE.email}
            </Button>
          </a>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 text-xs text-[#5C6370] font-mono">
          <span>Response time: &lt; 24 Hours</span>
          <span>·</span>
          <span>India &amp; International Projects</span>
        </div>
      </div>
    </section>
  )
}

