import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function DivisionsSection() {
  return (
    <section id="capabilities" className="py-14 bg-[#08090b]">
      <div className="container-main">
        {/* Section Four: Capabilities introduction */}
        <div className="relative mb-12">
          {/* Top-Right Decorative Bracket */}
          <div className="border-t border-r border-[#2a2f3a] w-5 h-5 absolute -top-1 -right-1 pointer-events-none hidden md:block" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            {/* Left Headline */}
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] text-[#777d87] uppercase mb-3">
                OUR CAPABILITIES
              </p>
              <h2 className="font-sans font-extrabold text-[36px] sm:text-[46px] leading-[0.98] tracking-[-0.03em] text-[#f5f3ee] uppercase">
                THREE <br />
                WAYS WE <br />
                CREATE <br />
                <span className="font-editorial-italic font-normal tracking-normal lowercase text-[#f5f3ee]">
                  impact.
                </span>
              </h2>
            </div>

            {/* Right Paragraph aligned around middle */}
            <p className="text-[13px] sm:text-[14px] text-[#b2b4ba] max-w-[340px] leading-relaxed">
              From cinematic content to scalable web products and AI agents that actually work — Ediyrex brings creativity and technology together to move your business forward.
            </p>
          </div>
        </div>

        {/* Section Five: Three Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 01: MEDIA */}
          <div className="rounded-xl bg-[#0d0f12] border border-[#252a32] hover:border-[#3a414b] transition-all duration-300 p-5 flex flex-col justify-between group">
            <div>
              {/* Card Image Area with Number & Arrow */}
              <div className="relative aspect-[16/10] w-full rounded-lg bg-[#12151a] border border-[#1f232c] mb-5 overflow-hidden">
                <Image
                  src="/images/card-media.png"
                  alt="Media production studio camera filming with warm lighting"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-mono text-[#b2b4ba] z-10 font-bold drop-shadow">
                  01
                </span>
                <Link
                  href="/services#media"
                  className="absolute top-2.5 right-2.5 text-[#b2b4ba] group-hover:text-[#f5f3ee] transition-colors z-10 p-1"
                >
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              {/* Title & Description */}
              <h3 className="font-sans font-extrabold text-[20px] tracking-wide text-[#f5f3ee] mb-1.5 uppercase">
                MEDIA
              </h3>
              <p className="text-[12px] text-[#b2b4ba] leading-relaxed mb-5">
                Production, editing and content that tells your story and gets results.
              </p>
            </div>

            {/* Outlined Tags */}
            <div className="flex flex-wrap gap-1.5 pt-3.5 border-t border-[#1a1d24]">
              {['Shoot', 'Video Editing', 'Motion Graphics', 'Podcast', 'Graphic Design', 'Content Creation'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full border border-[#2b303c] text-[10px] text-[#b2b4ba] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card 02: WEB */}
          <div className="rounded-xl bg-[#0d0f12] border border-[#252a32] hover:border-[#3a414b] transition-all duration-300 p-5 flex flex-col justify-between group">
            <div>
              {/* Card Image Area */}
              <div className="relative aspect-[16/10] w-full rounded-lg bg-[#12151a] border border-[#1f232c] mb-5 overflow-hidden">
                <Image
                  src="/images/card-web.png"
                  alt="Laptop displaying dark modern web interface"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-mono text-[#b2b4ba] z-10 font-bold drop-shadow">
                  02
                </span>
                <Link
                  href="/services#web"
                  className="absolute top-2.5 right-2.5 text-[#b2b4ba] group-hover:text-[#f5f3ee] transition-colors z-10 p-1"
                >
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              {/* Title & Description */}
              <h3 className="font-sans font-extrabold text-[20px] tracking-wide text-[#f5f3ee] mb-1.5 uppercase">
                WEB
              </h3>
              <p className="text-[12px] text-[#b2b4ba] leading-relaxed mb-5">
                Modern, fast and scalable web experiences for brands and businesses.
              </p>
            </div>

            {/* Outlined Tags */}
            <div className="flex flex-wrap gap-1.5 pt-3.5 border-t border-[#1a1d24]">
              {['Web Development', 'Web Apps', 'UI/UX', 'E-commerce', 'Extensions', 'Dashboards'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full border border-[#2b303c] text-[10px] text-[#b2b4ba] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card 03: AGENTS & AUTOMATION */}
          <div className="rounded-xl bg-[#0d0f12] border border-[#252a32] hover:border-[#3a414b] transition-all duration-300 p-5 flex flex-col justify-between group">
            <div>
              {/* Card Image Area */}
              <div className="relative aspect-[16/10] w-full rounded-lg bg-[#12151a] border border-[#1f232c] mb-5 overflow-hidden">
                <Image
                  src="/images/card-agents.png"
                  alt="Keycap with illuminated AI spark symbol"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-mono text-[#b2b4ba] z-10 font-bold drop-shadow">
                  03
                </span>
                <Link
                  href="/services#agents"
                  className="absolute top-2.5 right-2.5 text-[#b2b4ba] group-hover:text-[#f5f3ee] transition-colors z-10 p-1"
                >
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              {/* Title & Description */}
              <h3 className="font-sans font-extrabold text-[20px] tracking-wide text-[#f5f3ee] mb-1.5 uppercase leading-tight">
                AGENTS &amp; <br />
                AUTOMATION
              </h3>
              <p className="text-[12px] text-[#b2b4ba] leading-relaxed mb-5">
                AI agents and automation systems that save time, reduce work and scale ops.
              </p>
            </div>

            {/* Outlined Tags */}
            <div className="flex flex-wrap gap-1.5 pt-3.5 border-t border-[#1a1d24]">
              {['AI Chatbots', 'Voice Agents', 'Custom Agents', 'n8n Workflows', 'Business Automation', 'RAG'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full border border-[#2b303c] text-[10px] text-[#b2b4ba] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
