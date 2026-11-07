import Link from 'next/link'
import { Check, ArrowUpRight } from 'lucide-react'
import { ServiceDivision } from '../types'

interface DivisionBlockProps {
  division: ServiceDivision
  index: number
}

export function DivisionBlock({ division }: DivisionBlockProps) {
  const divisionRoute =
    division.id === 'media'
      ? '/media'
      : division.id === 'digital'
      ? '/web'
      : '/agents-automation'

  return (
    <article
      id={division.id}
      className="scroll-mt-28 py-16 border-b border-neutral-800 last:border-b-0"
    >
      {/* Division Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">
              DIVISION {division.id.toUpperCase()}
            </span>
          </div>
          <h2 className="font-manrope font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white">
            {division.headline}
          </h2>
          <p className="mt-3 text-neutral-400 text-sm md:text-base leading-relaxed">
            {division.lead}
          </p>
        </div>

        <Link
          href={divisionRoute}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-neutral-700 hover:border-white text-white hover:bg-white hover:text-black font-inter font-medium text-xs transition-colors shrink-0"
        >
          <span>Explore {division.title} Division</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {division.services.map((svc) => (
          <div
            key={svc.id}
            className="flex flex-col justify-between p-7 rounded-xl bg-[#080808] border border-neutral-800 hover:border-neutral-500 transition-colors duration-200"
          >
            <div>
              <h3 className="font-manrope font-bold text-lg text-white mb-2">
                {svc.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                {svc.description}
              </p>

              {/* Deliverables */}
              <div className="pt-4 border-t border-neutral-800">
                <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
                  Scope Deliverables
                </p>
                <ul className="space-y-2">
                  {svc.deliverables.map((del, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                      <Check size={13} className="text-white shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-800 mt-6 flex items-center justify-between">
              <span className="font-mono text-[10px] text-neutral-400">
                {svc.tools.slice(0, 2).join(' · ')}
              </span>
              <Link
                href={divisionRoute}
                className="font-inter text-xs text-white hover:underline flex items-center gap-1"
              >
                <span>Details</span>
                <ArrowUpRight size={11} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}
