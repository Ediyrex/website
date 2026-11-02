import { Check, Wrench } from 'lucide-react'
import { Badge } from '@/shared/components/ui'
import { ServiceDivision } from '../types'

interface DivisionBlockProps {
  division: ServiceDivision
  index: number
}

export function DivisionBlock({ division }: DivisionBlockProps) {
  return (
    <article
      id={division.id}
      className="scroll-mt-28 py-16 first:pt-8 border-b border-[#1C2028] last:border-b-0"
    >
      {/* Division Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <Badge variant="accent" className="mb-4">
            Division · {division.title}
          </Badge>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#F0EDE8]">
            {division.headline}
          </h2>
          <p className="mt-4 text-[#9AA0AB] text-base leading-relaxed">
            {division.lead}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {division.services.map((svc) => (
          <div
            key={svc.id}
            className="flex flex-col justify-between p-7 rounded-2xl bg-[#12151A] border border-[#252A33] hover:border-[#D6B77A]/40 transition-all duration-300"
          >
            <div>
              <h3 className="font-heading font-bold text-xl text-[#F0EDE8] mb-3">
                {svc.title}
              </h3>
              <p className="text-sm text-[#9AA0AB] leading-relaxed mb-6">
                {svc.description}
              </p>

              {/* Deliverables */}
              <div className="pt-4 border-t border-[#1C2028]">
                <p className="text-xs font-mono uppercase tracking-wider text-[#D6B77A] mb-3">
                  Key Deliverables
                </p>
                <ul className="space-y-2">
                  {svc.deliverables.map((del, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#F0EDE8]/80">
                      <Check size={14} className="text-[#D6B77A] shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tooling / Tech stack */}
            <div className="mt-8 pt-4 border-t border-[#1C2028]">
              <div className="flex items-center gap-1.5 text-xs text-[#5C6370] mb-2 font-mono">
                <Wrench size={12} />
                <span>Primary Tooling</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {svc.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#08090B] text-[#9AA0AB] border border-[#1C2028]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Frequently Asked Questions for Division */}
      <div className="mt-14 p-8 rounded-2xl bg-[#08090B] border border-[#1C2028]">
        <h4 className="font-heading font-bold text-lg text-[#F0EDE8] mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D6B77A]" />
          Specifics &amp; Technical FAQs · {division.title}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {division.faq.map((item, i) => (
            <div key={i} className="space-y-2">
              <p className="font-heading font-medium text-sm text-[#F0EDE8]">
                {item.question}
              </p>
              <p className="text-xs text-[#9AA0AB] leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
