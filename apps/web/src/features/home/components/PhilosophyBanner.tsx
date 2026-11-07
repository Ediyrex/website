import { Film, Terminal, Bot } from 'lucide-react'

const PILLARS = [
  {
    icon: Film,
    title: 'Creative Craft',
    description: 'Cinematic brand films, precision post-production, and visual storytelling that commands real attention in noisy markets.',
  },
  {
    icon: Terminal,
    title: 'Engineering Rigor',
    description: 'Fast, secure, and maintainable web applications built on modern React, Next.js, and TypeScript architectures.',
  },
  {
    icon: Bot,
    title: 'Autonomous Intelligence',
    description: 'Custom AI agents, conversational voice systems, and automated operations that eliminate routine business drag.',
  },
]

export function PhilosophyBanner() {
  return (
    <section className="bg-[#000000] py-16 relative">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        <div
          className="relative rounded-xl overflow-hidden bg-[#080808] border border-neutral-800 p-8 sm:p-10 lg:p-14"
        >
          {/* Top header row */}
          <div className="max-w-2xl mb-12">
            <p
              className="font-mono text-[11px] uppercase text-neutral-500 mb-3 flex items-center gap-2"
              style={{ letterSpacing: '0.2em' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />
              <span>THE EDIYREX ADVANTAGE</span>
            </p>
            <h3
              className="font-manrope font-extrabold uppercase text-[#FFFFFF] text-2xl sm:text-3xl lg:text-4xl leading-[1.08] tracking-tight"
            >
              ONE UNIFIED PARTNER FOR
              <br />
              CREATIVITY, CODE &amp; AUTOMATION.
            </h3>
            <p className="font-inter text-neutral-400 text-sm mt-3 leading-relaxed">
              Eliminate the drag and misalignment of juggling separate production agencies, web development boutiques, and AI consultants.
            </p>
          </div>

          {/* Three Architectural Value Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 pt-8 border-t border-neutral-800">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className={`flex flex-col items-start ${
                    i > 0 ? 'md:border-l md:border-neutral-800 md:pl-8 lg:pl-10' : ''
                  } ${i < 2 ? 'md:pr-8 lg:pr-10' : ''}`}
                >
                  <div className="w-10 h-10 rounded-lg border border-neutral-800 flex items-center justify-center text-neutral-300 mb-4">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <h4 className="font-manrope font-bold text-base text-[#FFFFFF] mb-2 tracking-tight">
                    {pillar.title}
                  </h4>
                  <p className="font-inter text-sm text-neutral-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
