import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading, Button } from '@/shared/components/ui'
import { SERVICES_DATA } from '@/features/services/data/servicesData'
import { DivisionBlock } from '@/features/services/components'

export const metadata: Metadata = {
  title: 'Services & Capabilities · Ediyrex Studio',
  description:
    'Detailed service catalogue across Media Production, Digital Experiences & Software Engineering, and Artificial Intelligence Automation.',
}

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Top Hero Banner */}
      <section className="section-gap pt-8 pb-14 border-b border-[#1C2028]">
        <div className="container-main">
          <SectionHeading
            label="Service Catalogue"
            title="Precision Execution Across Three Integrated Disciplines"
            titleHighlight="Three Integrated Disciplines"
            description="Explore our complete scope of services across film production, web platform engineering, and custom artificial intelligence pipelines."
            align="left"
          />

          {/* Anchor Navigation Pills */}
          <div className="mt-8 flex flex-wrap gap-3">
            {SERVICES_DATA.map((div) => (
              <a
                key={div.id}
                href={`#${div.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12151A] border border-[#252A33] text-xs font-mono uppercase tracking-wider text-[#9AA0AB] hover:text-[#D6B77A] hover:border-[#D6B77A]/50 transition-colors duration-200"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: div.accentColor }}
                />
                <span>{div.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Divisions Content */}
      <section className="container-main">
        {SERVICES_DATA.map((division, index) => (
          <DivisionBlock key={division.id} division={division} index={index} />
        ))}
      </section>

      {/* Conversion Banner */}
      <section className="container-main mt-20">
        <div className="p-10 md:p-14 rounded-3xl bg-[#12151A] border border-[#252A33] text-center relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-radial from-[#D6B77A]/10 via-transparent to-transparent"
          />
          <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-[#F0EDE8] max-w-xl mx-auto">
            Need a tailored cross-disciplinary engagement?
          </h3>
          <p className="mt-3 text-sm text-[#9AA0AB] max-w-md mx-auto">
            Most of our highest-impact work combines two or all three studio capabilities under a unified scope.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/contact">
              <Button variant="primary" size="lg" rightIcon={<ArrowUpRight size={16} />}>
                Discuss Your Scope
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
