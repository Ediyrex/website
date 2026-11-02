import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { SITE, SERVICE_DIVISIONS } from '@/shared/constants'
import { Button } from '@/shared/components/ui'

export const metadata: Metadata = {
  title: 'Home',
  description: SITE.description,
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        id="hero"
        className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden"
        aria-label="Hero"
      >
        {/* Ambient gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(214,183,122,0.07) 0%, transparent 70%)',
          }}
        />

        <div className="container-main flex flex-col items-center text-center gap-8 pt-32 pb-20 relative z-10">
          {/* Label */}
          <span className="label-mono inline-flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-[#D6B77A]/50" aria-hidden="true" />
            Creative Technology Studio
            <span className="inline-block h-px w-8 bg-[#D6B77A]/50" aria-hidden="true" />
          </span>

          {/* Headline */}
          <h1 className="max-w-4xl font-heading font-bold tracking-tight text-[#F0EDE8]">
            One studio for{' '}
            <span className="text-gradient-accent">Media, Digital</span>
            {' '}and{' '}
            <span className="text-gradient-accent">AI</span>
          </h1>

          {/* Description */}
          <p className="max-w-xl text-lg text-[#9AA0AB] leading-relaxed">
            {SITE.tagline}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
              See Our Work
            </Button>
            <Button variant="ghost" size="lg">
              Start a Project
            </Button>
          </div>

          {/* Division pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            {SERVICE_DIVISIONS.map((div) => (
              <span
                key={div.id}
                className="text-xs font-mono uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#1C2028] text-[#5C6370] hover:border-[#252A33] hover:text-[#9AA0AB] transition-colors duration-200 cursor-default"
              >
                {div.label}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5C6370]">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-[#D6B77A]/30 to-transparent" />
        </div>
      </section>

      {/* Contact section anchor (for header CTA) */}
      <section id="contact" className="section-gap">
        <div className="container-main text-center">
          <p className="label-mono mb-4">Get in touch</p>
          <h2 className="font-heading font-bold text-[#F0EDE8] mb-4">
            Ready to build something great?
          </h2>
          <p className="text-[#9AA0AB] mb-8 max-w-md mx-auto">
            Tell us about your project and we&apos;ll get back to you within 24 hours.
          </p>
          <Button variant="primary" size="lg">
            Start a Conversation
          </Button>
        </div>
      </section>
    </>
  )
}
