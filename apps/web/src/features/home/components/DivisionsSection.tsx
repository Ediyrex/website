import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const CARDS = [
  {
    num: '01',
    href: '/services#media',
    img: '/images/card-media.png',
    imgAlt: 'Cinematic camera in warm orange light',
    title: 'MEDIA',
    desc: 'Production, editing and content that tells your story and gets results.',
    tags: ['Shoot', 'Video Editing', 'Motion Graphics', 'Podcast', 'Graphic Design', 'Content Creation'],
  },
  {
    num: '02',
    href: '/services#web',
    img: '/images/card-web.png',
    imgAlt: 'Dark laptop displaying a modern web interface',
    title: 'WEB',
    desc: 'Modern, fast and scalable web experiences for brands and businesses.',
    tags: ['Web Development', 'Web Apps', 'UI/UX', 'E-commerce', 'Extensions', 'Dashboards'],
  },
  {
    num: '03',
    href: '/services#agents',
    img: '/images/card-agents.png',
    imgAlt: 'Illuminated AI keycap with star glyph',
    title: 'AGENTS &\nAUTOMATION',
    desc: 'AI agents and automation systems that save time, reduce work and scale ops.',
    tags: ['AI Chatbots', 'Voice Agents', 'Custom Agents', 'n8n Workflows', 'Business Automation', 'RAG'],
  },
]

export function DivisionsSection() {
  return (
    <section className="bg-[#08090B] pt-14 pb-10">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">

        {/* Section header */}
        <div className="relative mb-10">
          {/* Top-right decorative bracket */}
          <div
            aria-hidden="true"
            className="absolute -top-1 -right-1 pointer-events-none hidden md:block"
            style={{ width: 16, height: 16, borderTop: '1px solid #2A2F3A', borderRight: '1px solid #2A2F3A' }}
          />

          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-0 md:justify-between">
            {/* Left headline */}
            <div>
              <p
                className="font-inter font-medium uppercase text-[#777D87] mb-3"
                style={{ fontSize: 10, letterSpacing: '0.2em' }}
              >
                OUR CAPABILITIES
              </p>
              <h2
                className="font-manrope font-extrabold uppercase text-[#F5F3EE]"
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
                  }}
                >
                  impact.
                </em>
              </h2>
            </div>

            {/* Right paragraph — sits at headline middle on desktop */}
            <p
              className="font-inter font-normal text-[#B2B4BA] leading-relaxed md:self-center"
              style={{ fontSize: 13, maxWidth: 340 }}
            >
              From cinematic content to scalable web products and AI agents that actually work — Ediyrex brings creativity and technology together to move your business forward.
            </p>
          </div>
        </div>

        {/* Three service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARDS.map((card) => (
            <div
              key={card.num}
              className="group flex flex-col rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#3A414B] transition-all duration-300 p-5"
            >
              {/* Card image */}
              <div
                className="relative w-full rounded-lg bg-[#12151A] border border-[#1F232C] mb-5 overflow-hidden"
                style={{ aspectRatio: '16/10' }}
              >
                <Image
                  src={card.img}
                  alt={card.imgAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Number label */}
                <span
                  className="absolute top-3 left-3 z-10 font-inter font-bold text-[#B2B4BA] drop-shadow"
                  style={{ fontSize: 10 }}
                >
                  {card.num}
                </span>
                {/* Arrow link */}
                <Link
                  href={card.href}
                  className="absolute top-2.5 right-2.5 z-10 p-1 text-[#777D87] group-hover:text-[#F5F3EE] transition-colors"
                >
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              {/* Title */}
              <h3
                className="font-manrope font-extrabold uppercase text-[#F5F3EE] mb-1.5 leading-tight"
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
                className="font-inter font-normal text-[#B2B4BA] mb-5 leading-relaxed flex-1"
                style={{ fontSize: 12 }}
              >
                {card.desc}
              </p>

              {/* Tags */}
              <div
                className="flex flex-wrap gap-1.5 pt-3.5"
                style={{ borderTop: '1px solid #1A1D24' }}
              >
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-inter font-medium text-[#B2B4BA]"
                    style={{
                      fontSize: 10,
                      padding: '2px 10px',
                      borderRadius: 999,
                      border: '1px solid #2B303C',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
