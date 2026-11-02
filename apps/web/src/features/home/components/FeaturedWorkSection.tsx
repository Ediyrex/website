import Link from 'next/link'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { SectionHeading, Badge, Button } from '@/shared/components/ui'

const FEATURED_PROJECTS = [
  {
    id: 'aegis-platform',
    title: 'Aegis Intelligent Operations Platform',
    category: 'Digital + AI',
    client: 'Global Logistics Brand',
    overview:
      'Autonomous logistics intelligence dashboard delivering predictive dispatching and real-time fleet telematics.',
    tags: ['Next.js 15', 'Custom RAG', 'Voice Agents', 'Tailwind CSS'],
    stats: 'Real-time telemetry across 14,000+ endpoints',
    link: '/work/aegis-platform',
  },
  {
    id: 'lumina-cinematic',
    title: 'Lumina Origin: Brand Visual Universe',
    category: 'Media Production',
    client: 'Luxury Architectural Studio',
    overview:
      '35mm film direction, sound architecture, and bespoke editorial visual language for global retail spaces.',
    tags: ['Cinematography', 'Sound Design', 'Motion Direction', 'Editorial'],
    stats: 'International theatrical & digital release',
    link: '/work/lumina-origin',
  },
  {
    id: 'synthesis-agentic',
    title: 'Synthesis Autonomous Client Concierge',
    category: 'AI Automation',
    client: 'Fintech Advisory Group',
    overview:
      'Voice-enabled multi-lingual AI concierge handling high-touch onboarding, identity verification, and calendar triage.',
    tags: ['Voice LLM', 'Secure Integrations', 'Multi-tenant', 'CRM Bridge'],
    stats: 'Zero human latency on front-desk enquiries',
    link: '/work/synthesis-concierge',
  },
] as const

export function FeaturedWorkSection() {
  return (
    <section id="work" className="section-gap relative bg-[#12151A]/40 border-y border-[#1C2028]">
      <div className="container-main">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeading
            label="Selected Work"
            title="Evidence of High-Standard Execution"
            titleHighlight="High-Standard"
            description="A curated preview of cross-disciplinary systems, media narratives, and software built with obsessive craft."
            align="left"
          />
          <Link href="/work" className="shrink-0">
            <Button variant="secondary" size="md" rightIcon={<ArrowRight size={14} />}>
              View All Archive
            </Button>
          </Link>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PROJECTS.map((proj) => (
            <div
              key={proj.id}
              className="group relative flex flex-col justify-between rounded-xl bg-[#08090B] border border-[#252A33] overflow-hidden hover:border-[#D6B77A]/50 transition-all duration-300"
            >
              {/* Visual Card Header / Placeholder Canvas */}
              <div className="relative aspect-[16/10] w-full bg-[#1C2028] flex items-center justify-center p-6 border-b border-[#252A33]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-transparent to-transparent opacity-80"
                />
                <Badge variant="accent" className="absolute top-4 left-4 z-10">
                  {proj.category}
                </Badge>
                <div className="z-10 text-center px-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#5C6370]">
                    Case Study Preview
                  </span>
                  <p className="font-heading text-sm text-[#F0EDE8]/90 font-medium mt-1">
                    {proj.client}
                  </p>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-heading font-bold text-[#F0EDE8] group-hover:text-[#D6B77A] transition-colors duration-200">
                    {proj.title}
                  </h3>
                  <p className="mt-3 text-xs text-[#9AA0AB] leading-relaxed">
                    {proj.overview}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#12151A] text-[#9AA0AB] border border-[#1C2028]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Link */}
                <div className="mt-6 pt-4 border-t border-[#1C2028] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#5C6370]">
                    {proj.stats}
                  </span>
                  <Link
                    href={proj.link}
                    aria-label={`View case study: ${proj.title}`}
                    className="p-1 rounded-full text-[#9AA0AB] hover:text-[#D6B77A] transition-colors duration-200"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
