import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const SERVICE_ROWS = [
  {
    num: '01',
    title: 'MEDIA PRODUCTION',
    desc: 'Film, photography, motion graphics and visual storytelling.',
    href: '/media',
  },
  {
    num: '02',
    title: 'DIGITAL EXPERIENCES',
    desc: 'Web development, SaaS platforms, UI/UX and digital products.',
    href: '/web',
  },
  {
    num: '03',
    title: 'INTELLIGENT SYSTEMS',
    desc: 'AI agents, conversational systems and intelligent workflow automation.',
    href: '/agents-automation',
  },
]

export function ServiceIndex() {
  return (
    <div className="w-full mt-16 md:mt-20 pt-8 border-t border-white/[0.10]">
      {/* Editorial Table of Contents Header */}
      <div className="flex items-center justify-between pb-4 text-[#00E5FF] font-mono text-[10px] uppercase tracking-[0.2em] opacity-80">
        <span>SERVICE INDEX // 01 &mdash; 03</span>
        <span>DISCIPLINES</span>
      </div>

      {/* Three Horizontal Rows */}
      <div className="divide-y divide-white/[0.08]">
        {SERVICE_ROWS.map((service) => (
          <Link
            key={service.num}
            href={service.href}
            className="group relative flex flex-col md:flex-row md:items-center justify-between py-5 md:py-6 transition-all duration-200"
          >
            {/* Subtle left accent highlight on hover (Electric Cyan) */}
            <span
              className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-hidden="true"
            />

            {/* Left: Number (Cyan Mono) + Title (Header) */}
            <div className="flex items-baseline gap-6 md:gap-10 pl-2 group-hover:pl-4 transition-all duration-200">
              <span className="font-mono text-xs md:text-[13px] text-[#00E5FF] font-semibold">
                {service.num}
              </span>
              <h3 className="font-manrope font-medium text-base md:text-lg text-[#EAEAEA] group-hover:text-[#00E5FF] transition-colors tracking-tight">
                {service.title}
              </h3>
            </div>

            {/* Right: Description + Directional Arrow */}
            <div className="flex items-center justify-between md:justify-end gap-6 md:gap-12 mt-2 md:mt-0 pl-12 md:pl-0">
              <p className="font-inter text-xs md:text-[13px] text-[#999999] group-hover:text-[#CCCCCC] transition-colors max-w-sm">
                {service.desc}
              </p>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#666666] group-hover:text-[#39FF14] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0">
                <ArrowUpRight size={15} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

