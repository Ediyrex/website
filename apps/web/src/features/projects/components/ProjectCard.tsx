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
    <article className="group flex flex-col justify-between rounded-xl bg-[#080808] border border-neutral-800 overflow-hidden hover:border-neutral-500 transition-colors duration-200">
      {/* Header Bar */}
      <div className="p-6 md:p-8 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={divisionRoute}
            className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded bg-[#000000] border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
          >
            {project.divisionLabel} ↗
          </Link>
          <span className="font-mono text-xs text-neutral-500">
            {project.year}
          </span>
        </div>

        <Link
          href={`/work/${project.slug}`}
          className="w-8 h-8 rounded-md border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-white transition-colors"
          aria-label={`View ${project.title}`}
        >
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-2">
            Client: <span className="text-white">{project.client}</span>
          </p>
          <Link href={`/work/${project.slug}`}>
            <h3 className="font-manrope font-bold text-xl md:text-2xl text-white hover:text-neutral-300 transition-colors leading-tight mb-3">
              {project.title}
            </h3>
          </Link>
          <p className="font-inter text-sm text-neutral-400 leading-relaxed mb-6">
            {project.overview}
          </p>

          {/* Results strip */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-800/80 mb-6">
            {project.results.slice(0, 2).map((res, i) => (
              <div key={i}>
                <p className="font-mono text-lg font-bold text-white">
                  {res.metric}
                </p>
                <p className="font-inter text-xs text-neutral-400 mt-0.5">
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
                className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-[#000000] border border-neutral-800 text-neutral-400"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-xs">
            <Link
              href={`/work/${project.slug}`}
              className="font-inter font-medium text-white hover:underline flex items-center gap-1"
            >
              <span>Read Case Study</span>
              <ArrowUpRight size={12} />
            </Link>

            <Link
              href={divisionRoute}
              className="font-mono text-neutral-400 hover:text-white transition-colors"
            >
              View More in {project.division === 'media' ? 'Media' : project.division === 'digital' ? 'Web' : 'AI'} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
