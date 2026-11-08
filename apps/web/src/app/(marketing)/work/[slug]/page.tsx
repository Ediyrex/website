import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
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
    <article className="bg-[#0B0C10] min-h-screen text-[#EAEAEA] pt-28 pb-24">
      {/* Back Button & Header */}
      <section className="pt-8 pb-16 border-b border-white/[0.08]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#999999] hover:text-[#00E5FF] transition-colors duration-200 mb-8"
          >
            <ArrowLeft size={14} />
            <span>Back to All Work</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-xs text-[#00E5FF] px-2.5 py-0.5 rounded bg-[#12141A] border border-[#00E5FF]/20">
              {project.divisionLabel}
            </span>
            <span className="text-xs font-mono text-[#666666]">Year {project.year}</span>
            <span className="text-xs font-mono text-[#666666]">·</span>
            <span className="text-xs font-mono text-[#00E5FF]">{project.client}</span>
          </div>

          <h1 className="font-manrope font-semibold text-3xl md:text-5xl lg:text-6xl text-[#00E5FF] max-w-4xl tracking-tight leading-tight drop-shadow-[0_0_35px_rgba(0,229,255,0.15)]">
            {project.title}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-[#999999] max-w-2xl leading-relaxed">
            {project.heroTagline}
          </p>

          {/* Results Bar */}
          <div className="mt-14 pt-8 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-6">
            {project.results.map((res, i) => (
              <div key={i} className="p-6 rounded-xl bg-[#12141A] border border-white/[0.08]">
                <p className="font-mono text-3xl font-semibold text-[#00E5FF]">
                  {res.metric}
                </p>
                <p className="text-xs text-[#666666] font-mono mt-2">
                  {res.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Narrative Breakdown */}
      <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Story (Left Column - 8 Cols) */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <span className="font-mono text-[11px] text-[#00E5FF] uppercase tracking-wider mb-2 block">
                Context &amp; Background
              </span>
              <h2 className="font-manrope font-semibold text-2xl text-[#EAEAEA] mb-4">
                The Executive Overview
              </h2>
              <p className="text-[#999999] leading-relaxed text-base">
                {project.overview}
              </p>
            </div>

            <div className="p-8 rounded-xl bg-[#12141A] border border-white/[0.08]">
              <span className="font-mono text-[11px] text-[#00E5FF] uppercase tracking-wider mb-2 block">
                The Strategic Friction
              </span>
              <h2 className="font-manrope font-semibold text-2xl text-[#EAEAEA] mb-4">
                The Underlying Challenge
              </h2>
              <p className="text-[#999999] leading-relaxed text-sm md:text-base">
                {project.challenge}
              </p>
            </div>

            <div>
              <span className="font-mono text-[11px] text-[#00E5FF] uppercase tracking-wider mb-2 block">
                Engineering &amp; Craft
              </span>
              <h2 className="font-manrope font-semibold text-2xl text-[#EAEAEA] mb-4">
                Our Architectural Solution
              </h2>
              <p className="text-[#999999] leading-relaxed text-base">
                {project.solution}
              </p>
            </div>

            {/* Gallery Stills Showcase */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="pt-8 border-t border-white/[0.08]">
                <span className="font-mono text-[11px] text-[#00E5FF] uppercase tracking-wider mb-6 block">
                  Execution Artifacts &amp; Exhibition
                </span>
                <div className="space-y-6">
                  {project.gallery.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-[#12141A] border border-white/[0.08] overflow-hidden"
                    >
                      <div className="aspect-[16/9] w-full bg-[#0B0C10] flex items-center justify-center p-8 text-center relative">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#666666]">
                          Visual Asset #{i + 1} · {item.title}
                        </span>
                      </div>
                      <div className="p-5 bg-[#12141A]">
                        <p className="text-sm font-semibold text-[#EAEAEA]">{item.title}</p>
                        <p className="text-xs text-[#999999] mt-1">{item.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Specifications (Right Column - 4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Tech Stack */}
            <div className="p-6 rounded-xl bg-[#12141A] border border-white/[0.08]">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#00E5FF] mb-4">
                Technologies &amp; Architecture
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-3 py-1.5 rounded-md bg-[#0B0C10] text-[#00E5FF] border border-[#00E5FF]/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="p-6 rounded-xl bg-[#12141A] border border-white/[0.08]">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#00E5FF] mb-4">
                Scope of Deliverables
              </h3>
              <ul className="space-y-2.5">
                {project.deliverables.map((del, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#999999]">
                    <Check size={14} className="text-[#39FF14] shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct CTA (Neon Lime button) */}
            <div className="p-6 rounded-xl bg-[#12141A] border border-white/[0.08] text-center">
              <h3 className="font-manrope font-semibold text-lg text-[#00E5FF] mb-2">
                Have a comparable project?
              </h3>
              <p className="text-xs text-[#999999] mb-6">
                Let&apos;s evaluate your requirements and architect a verified solution.
              </p>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-md bg-[#39FF14] hover:bg-[#32e012] text-[#0B0C10] font-mono font-semibold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(57,255,20,0.25)] group"
              >
                <span>Start a Project</span>
                <ArrowUpRight size={14} className="text-[#0B0C10] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
