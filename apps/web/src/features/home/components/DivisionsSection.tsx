import Link from 'next/link'
import { ArrowUpRight, Camera, Layout, Bot, Image as ImageIcon } from 'lucide-react'

const CARDS = [
  {
    num: '01',
    href: '/media',
    icon: Camera,
    placeholderLabel: 'MEDIA VISUAL PLACEHOLDER',
    title: 'MEDIA',
    desc: 'Production, editing and content that tells your story and gets results.',
    tags: ['Shoot', 'Video Editing', 'Motion Graphics', 'Podcast', 'Graphic Design', 'Content Creation'],
  },
  {
    num: '02',
    href: '/web',
    icon: Layout,
    placeholderLabel: 'WEB VISUAL PLACEHOLDER',
    title: 'WEB',
    desc: 'Modern, fast and scalable web experiences for brands and businesses.',
    tags: ['Web Development', 'Web Apps', 'UI/UX', 'E-commerce', 'Extensions', 'Dashboards'],
  },
  {
    num: '03',
    href: '/agents-automation',
    icon: Bot,
    placeholderLabel: 'AGENTS VISUAL PLACEHOLDER',
    title: 'AGENTS &\nAUTOMATION',
    desc: 'AI agents and automation systems that save time, reduce work and scale ops.',
    tags: ['AI Chatbots', 'Voice Agents', 'Custom Agents', 'n8n Workflows', 'Business Automation', 'RAG'],
  },
]

export function DivisionsSection() {
  return (
    <section className="bg-[#000000] pt-16 pb-12">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">

        {/* Section header */}
        <div className="relative mb-12">
          {/* Top-right decorative bracket in Cobalt Blue */}
          <div
            aria-hidden="true"
            className="absolute -top-1 -right-1 pointer-events-none hidden md:block"
            style={{ width: 16, height: 16, borderTop: '1.5px solid #2C3480', borderRight: '1.5px solid #2C3480' }}
          />

          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-0 md:justify-between">
            {/* Left headline */}
            <div>
              <p
                className="font-inter font-medium uppercase text-[#7E8597] mb-3"
                style={{ fontSize: 10, letterSpacing: '0.2em' }}
              >
                OUR CAPABILITIES
              </p>
              <h2
                className="font-manrope font-extrabold uppercase text-[#FFFFFF]"
                style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 0.98, letterSpacing: '-0.03em' }}
              >
                THREE
                <br />
                WAYS WE
                <br />
                CREATE
                <br />
                <em
                  className="not-italic"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    letterSpacing: '-0.01em',
                    textTransform: 'lowercase',
                    color: '#FFFFFF',
                  }}
                >
                  impact.
                </em>
              </h2>
            </div>

            {/* Right paragraph */}
            <p
              className="font-inter font-normal text-[#D1D5DB] leading-relaxed md:self-center"
              style={{ fontSize: 13.5, maxWidth: 350 }}
            >
              From cinematic content to scalable web products and AI agents that actually work — Ediyrex brings creativity and technology together to move your business forward.
            </p>
          </div>
        </div>

        {/* Three service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARDS.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.num}
                className="group flex flex-col rounded-xl bg-[#07090E] border border-[#161A24] hover:border-[#2C3480] hover:shadow-[0_0_28px_rgba(44,52,128,0.2)] transition-all duration-300 p-5"
              >
                {/* Visual Placeholder Canvas (No image files) */}
                <div
                  className="relative w-full rounded-lg bg-[#0C0F17] border border-[#1C2230] mb-5 overflow-hidden flex flex-col items-center justify-center p-6 text-center"
                  style={{ aspectRatio: '16/10' }}
                >
                  {/* Number label */}
                  <span
                    className="absolute top-3 left-3 z-10 font-mono text-[10px] font-bold text-[#FFFFFF]"
                  >
                    {card.num}
                  </span>
                  {/* Arrow link */}
                  <Link
                    href={card.href}
                    className="absolute top-2.5 right-2.5 z-10 p-1 text-[#7E8597] group-hover:text-[#FFFFFF] transition-colors"
                  >
                    <ArrowUpRight size={14} />
                  </Link>

                  {/* Centered placeholder emblem */}
                  <div className="w-9 h-9 rounded-lg bg-[#07090E] border border-[#161A24] flex items-center justify-center text-[#2C3480] mb-2 group-hover:scale-105 transition-transform">
                    <Icon size={18} />
                  </div>
                  <p className="font-mono text-[9.5px] uppercase tracking-[1.5px] text-[#7E8597]">
                    {card.placeholderLabel}
                  </p>
                  <span className="text-[9px] font-mono text-[#4E5569] mt-0.5">
                    Awaiting asset
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-manrope font-extrabold uppercase text-[#FFFFFF] mb-1.5 leading-tight"
                  style={{ fontSize: 20, letterSpacing: '0.02em' }}
                >
                  {card.title.split('\n').map((line, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </h3>

                {/* Description */}
                <p
                  className="font-inter font-normal text-[#D1D5DB] mb-5 leading-relaxed flex-1"
                  style={{ fontSize: 12.5 }}
                >
                  {card.desc}
                </p>

                {/* Tags */}
                <div
                  className="flex flex-wrap gap-1.5 pt-3.5"
                  style={{ borderTop: '1px solid #141724' }}
                >
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-inter font-medium text-[#D1D5DB]"
                      style={{
                        fontSize: 10,
                        padding: '2px 10px',
                        borderRadius: 999,
                        border: '1px solid #1C2230',
                        backgroundColor: '#07090E',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
