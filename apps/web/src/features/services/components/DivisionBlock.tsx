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
      className="scroll-mt-28 py-16 border-b border-white/[0.08] last:border-b-0"
    >
      {/* Division Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00E5FF]">
              DIVISION {division.id.toUpperCase()}
            </span>
          </div>
          <h2 className="font-manrope font-semibold text-2xl sm:text-3xl lg:text-4xl text-[#00E5FF]">
            {division.headline}
          </h2>
          <p className="mt-3 text-[#999999] text-sm md:text-base leading-relaxed">
            {division.lead}
          </p>
        </div>

        <Link
          href={divisionRoute}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-white/[0.15] hover:border-[#39FF14] text-[#EAEAEA] hover:text-[#39FF14] font-mono text-xs uppercase tracking-wider transition-colors shrink-0 group"
        >
          <span>Explore {division.title} Division</span>
          <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {division.services.map((svc) => (
          <div
            key={svc.id}
            className="flex flex-col justify-between p-7 rounded-xl bg-[#12141A] border border-white/[0.08] hover:border-[#00E5FF]/40 transition-colors duration-200"
          >
            <div>
              <h3 className="font-manrope font-semibold text-lg text-[#EAEAEA] mb-2">
                {svc.title}
              </h3>
              <p className="text-xs text-[#999999] leading-relaxed mb-6">
                {svc.description}
              </p>

              {/* Deliverables */}
              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF] opacity-80 mb-3">
                  Scope Deliverables
                </p>
                <ul className="space-y-2">
                  {svc.deliverables.map((del, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#999999]">
                      <Check size={13} className="text-[#39FF14] shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.06] mt-6 flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#00E5FF] opacity-80 uppercase">
                {svc.tools[0] || 'Studio Scope'}
              </span>

              <Link
                href={`/contact?service=${svc.id}`}
                className="inline-flex items-center gap-1 font-mono text-xs text-[#EAEAEA] hover:text-[#39FF14] transition-colors"
              >
                <span>Direct Enquiry</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}
