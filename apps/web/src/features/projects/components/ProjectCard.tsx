import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/shared/components/ui'
import { CaseStudy } from '../types'

interface ProjectCardProps {
  project: CaseStudy
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative flex flex-col justify-between rounded-2xl bg-[#12151A] border border-[#252A33] overflow-hidden hover:border-[#D6B77A]/40 transition-all duration-300">
      {/* Visual Header / Canvas preview */}
      <div className="relative aspect-[16/10] w-full bg-[#1C2028] flex items-center justify-center p-6 border-b border-[#252A33] overflow-hidden">
        {/* Ambient subtle gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#12151A] via-transparent to-transparent opacity-80"
        />

        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Badge variant="accent">{project.divisionLabel}</Badge>
        </div>

        <span className="absolute top-4 right-4 z-10 text-xs font-mono text-[#5C6370]">
          {project.year}
        </span>

        {/* Center Canvas Text */}
        <div className="z-10 text-center px-4">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#D6B77A]/80">
            {project.client}
          </span>
          <p className="font-heading text-base md:text-lg text-[#F0EDE8] font-bold mt-1 line-clamp-2">
            {project.title}
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 md:p-8 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-xs font-mono text-[#D6B77A] mb-2">
            {project.heroTagline}
          </p>
          <p className="text-sm text-[#9AA0AB] leading-relaxed line-clamp-3">
            {project.overview}
          </p>

          {/* Key Metrics Grid */}
          <div className="mt-6 pt-4 border-t border-[#1C2028] grid grid-cols-2 gap-4">
            {project.results.slice(0, 2).map((res, i) => (
              <div key={i}>
                <p className="font-mono text-base font-bold text-[#F0EDE8]">
                  {res.metric}
                </p>
                <p className="text-[11px] text-[#5C6370] leading-tight mt-0.5">
                  {res.label}
                </p>
              </div>
            ))}
          </div>

          {/* Tech Tags */}
          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#08090B] text-[#9AA0AB] border border-[#1C2028]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Case Study Link */}
        <div className="mt-8 pt-5 border-t border-[#1C2028] flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F0EDE8] group-hover:text-[#D6B77A] transition-colors duration-200">
            Read Full Case Study
          </span>
          <Link
            href={`/work/${project.slug}`}
            aria-label={`Read case study for ${project.title}`}
            className="p-2 rounded-full bg-[#1C2028] text-[#9AA0AB] group-hover:text-[#D6B77A] group-hover:bg-[#D6B77A]/10 transition-all duration-200"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}

