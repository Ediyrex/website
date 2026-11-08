import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { CaseStudy } from '../types'

interface ProjectCardProps {
  project: CaseStudy
}

export function ProjectCard({ project }: ProjectCardProps) {
  const divisionRoute =
    project.division === 'media'
      ? '/media'
      : project.division === 'digital'
      ? '/web'
      : project.division === 'ai'
      ? '/agents-automation'
      : '/services'

  return (
    <article className="group flex flex-col justify-between rounded-xl bg-[#12141A] border border-white/[0.08] overflow-hidden hover:border-[#00E5FF]/40 transition-colors duration-200">
      {/* Header Bar */}
      <div className="p-6 md:p-8 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={divisionRoute}
            className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded bg-[#0B0C10] border border-[#00E5FF]/20 text-[#00E5FF] hover:border-[#00E5FF] transition-colors"
          >
            {project.divisionLabel} ↗
          </Link>
          <span className="font-mono text-xs text-[#666666]">
            {project.year}
          </span>
        </div>

        <Link
          href={`/work/${project.slug}`}
          className="w-8 h-8 rounded-md border border-white/[0.10] flex items-center justify-center text-[#999999] group-hover:text-[#39FF14] group-hover:border-[#39FF14]/40 transition-colors"
          aria-label={`View ${project.title}`}
        >
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#666666] mb-2">
            Client: <span className="text-[#EAEAEA]">{project.client}</span>
          </p>
          <Link href={`/work/${project.slug}`}>
            <h3 className="font-manrope font-semibold text-xl md:text-2xl text-[#EAEAEA] group-hover:text-[#00E5FF] transition-colors leading-tight mb-3">
              {project.title}
            </h3>
          </Link>
          <p className="font-inter text-sm text-[#999999] leading-relaxed mb-6">
            {project.overview}
          </p>

          {/* Results strip */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/[0.06] mb-6">
            {project.results.slice(0, 2).map((res, i) => (
              <div key={i}>
                <p className="font-mono text-lg font-semibold text-[#00E5FF]">
                  {res.metric}
                </p>
                <p className="font-inter text-xs text-[#666666] mt-0.5">
                  {res.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables / Tech & Direct Links */}
        <div>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-[#0B0C10] border border-[#00E5FF]/20 text-[#00E5FF] opacity-80"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex items-center gap-1.5 font-inter font-medium text-xs text-[#EAEAEA] hover:text-[#39FF14] transition-colors group/link"
            >
              <span>Explore Full Case Study</span>
              <ArrowUpRight size={13} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>

            <span className="font-mono text-[10px] text-[#666666] uppercase">
              STUDIO CASE ARCHIVE
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
