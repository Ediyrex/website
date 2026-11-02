import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { Badge, Button } from '@/shared/components/ui'
import { PROJECTS_DATA } from '@/features/projects/data/projectsData'

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return PROJECTS_DATA.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = PROJECTS_DATA.find((p) => p.slug === slug)
  if (!project) return { title: 'Project Not Found' }

  return {
    title: `${project.title} · Case Study`,
    description: project.overview,
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const project = PROJECTS_DATA.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <article className="pt-28 pb-24">
      {/* Back Button & Header */}
      <section className="section-gap pt-8 pb-16 border-b border-[#1C2028]">
        <div className="container-main">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9AA0AB] hover:text-[#D6B77A] transition-colors duration-200 mb-8"
          >
            <ArrowLeft size={14} />
            <span>Back to All Work</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="accent">{project.divisionLabel}</Badge>
            <span className="text-xs font-mono text-[#5C6370]">Year {project.year}</span>
            <span className="text-xs font-mono text-[#5C6370]">·</span>
            <span className="text-xs font-mono text-[#D6B77A]">{project.client}</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl md:text-5xl lg:text-6xl text-[#F0EDE8] max-w-4xl tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-[#D6B77A]/90 font-heading max-w-2xl leading-relaxed">
            {project.heroTagline}
          </p>

          {/* Results Bar */}
          <div className="mt-14 pt-8 border-t border-[#1C2028] grid grid-cols-1 sm:grid-cols-3 gap-6">
            {project.results.map((res, i) => (
              <div key={i} className="p-6 rounded-xl bg-[#12151A] border border-[#252A33]">
                <p className="font-mono text-3xl font-extrabold text-gradient-accent">
                  {res.metric}
                </p>
                <p className="text-xs text-[#9AA0AB] font-mono mt-2">
                  {res.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Narrative Breakdown */}
      <section className="container-main py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Story (Left Column - 8 Cols) */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <span className="label-mono mb-2 block">Context &amp; Background</span>
              <h2 className="font-heading font-bold text-2xl text-[#F0EDE8] mb-4">
                The Executive Overview
              </h2>
              <p className="text-[#9AA0AB] leading-relaxed text-base">
                {project.overview}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#12151A] border border-[#252A33]">
              <span className="label-mono text-[#E05252] mb-2 block">The Strategic Friction</span>
              <h2 className="font-heading font-bold text-2xl text-[#F0EDE8] mb-4">
                The Underlying Challenge
              </h2>
              <p className="text-[#9AA0AB] leading-relaxed text-sm md:text-base">
                {project.challenge}
              </p>
            </div>

            <div>
              <span className="label-mono text-[#4CAF8A] mb-2 block">Engineering &amp; Craft</span>
              <h2 className="font-heading font-bold text-2xl text-[#F0EDE8] mb-4">
                Our Architectural Solution
              </h2>
              <p className="text-[#9AA0AB] leading-relaxed text-base">
                {project.solution}
              </p>
            </div>

            {/* Gallery Stills Showcase */}
            <div className="pt-8 border-t border-[#1C2028]">
              <span className="label-mono mb-6 block">Execution Artifacts &amp; Exhibition</span>
              <div className="space-y-6">
                {project.gallery.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-[#12151A] border border-[#252A33] overflow-hidden"
                  >
                    <div className="aspect-[16/9] w-full bg-[#1C2028] flex items-center justify-center p-8 text-center relative">
                      <span className="font-mono text-xs uppercase tracking-widest text-[#5C6370]">
                        Visual Asset #{i + 1} · {item.title}
                      </span>
                    </div>
                    <div className="p-5 bg-[#08090B]">
                      <p className="text-sm font-semibold text-[#F0EDE8]">{item.title}</p>
                      <p className="text-xs text-[#9AA0AB] mt-1">{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Specifications (Right Column - 4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Tech Stack */}
            <div className="p-6 rounded-2xl bg-[#12151A] border border-[#252A33]">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#D6B77A] mb-4">
                Technologies &amp; Architecture
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#08090B] text-[#F0EDE8] border border-[#252A33]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="p-6 rounded-2xl bg-[#12151A] border border-[#252A33]">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#D6B77A] mb-4">
                Scope of Deliverables
              </h3>
              <ul className="space-y-2.5">
                {project.deliverables.map((del, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#9AA0AB]">
                    <Check size={14} className="text-[#D6B77A] shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#12151A] to-[#1C2028] border border-[#D6B77A]/30 text-center">
              <h3 className="font-heading font-bold text-lg text-[#F0EDE8] mb-2">
                Have a comparable project?
              </h3>
              <p className="text-xs text-[#9AA0AB] mb-6">
                Let&apos;s evaluate your requirements and architect a verified solution.
              </p>
              <Link href="/contact" className="w-full block">
                <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowUpRight size={14} />}>
                  Start a Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}

