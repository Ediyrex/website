import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function DivisionsSection() {
  return (
    <section id="capabilities" className="py-20 bg-[#050507]">
      <div className="container-main">
        {/* Section Header with Bracket */}
        <div className="relative mb-14">
          <div className="border-t border-r border-[#232733] w-6 h-6 absolute -top-3 right-0 pointer-events-none hidden md:block" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-mono tracking-[0.2em] text-[#8C92A4] uppercase mb-4">
                OUR CAPABILITIES
              </p>
              <h2 className="font-sans font-extrabold text-3xl sm:text-5xl leading-[1.05] tracking-tight text-white uppercase max-w-md">
                THREE <br />
                WAYS WE <br />
                CREATE <br />
                <span className="font-editorial-italic font-normal tracking-normal lowercase text-white">
                  impact.
                </span>
              </h2>
            </div>

            <p className="text-sm text-[#8C92A4] max-w-sm leading-relaxed pb-2">
              From cinematic content to scalable web products and AI agents that actually work — Ediyrex brings creativity and technology together to move your business forward.
            </p>
          </div>
        </div>

        {/* 3 Dark Architectural Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 01 - MEDIA */}
          <div className="rounded-2xl bg-[#090A0E] border border-[#181B24] hover:border-[#2C3140] transition-all duration-300 p-6 flex flex-col justify-between group">
            <div>
              {/* Media Preview Box with Warm Rim Light */}
              <div className="relative aspect-[16/10] w-full rounded-xl bg-[#11131A] border border-[#202430] mb-6 overflow-hidden flex items-end p-4">
                <div
                  aria-hidden="true"
                  className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-60 blur-[40px] pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, #FF5E1E 0%, transparent 70%)',
                  }}
                />
                <span className="absolute top-3 left-3 text-[11px] font-mono text-[#6E7487]">01</span>
                <Link
                  href="/services#media"
                  className="absolute top-3 right-3 text-[#8C92A4] group-hover:text-white transition-colors"
                >
                  <ArrowUpRight size={16} />
                </Link>
                <div className="relative z-10">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF5E1E]">Production Studio</span>
                </div>
              </div>

              <h3 className="font-sans font-extrabold text-2xl tracking-wide text-white mb-2">
                MEDIA
              </h3>
              <p className="text-xs text-[#8C92A4] leading-relaxed mb-6">
                Production, editing and content that tells your story and gets results.
              </p>
            </div>

            {/* Pill Tags */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#151720]">
              {['Shoot', 'Video Editing', 'Motion Graphics', 'Podcast', 'Graphic Design', 'Content Creation'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-[#111319] border border-[#1D212A] text-[10px] text-[#A2A8B8] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card 02 - WEB */}
          <div className="rounded-2xl bg-[#090A0E] border border-[#181B24] hover:border-[#2C3140] transition-all duration-300 p-6 flex flex-col justify-between group">
            <div>
              {/* Web Device Preview Box */}
              <div className="relative aspect-[16/10] w-full rounded-xl bg-[#11131A] border border-[#202430] mb-6 overflow-hidden flex items-center justify-center p-4">
                <span className="absolute top-3 left-3 text-[11px] font-mono text-[#6E7487]">02</span>
                <Link
                  href="/services#web"
                  className="absolute top-3 right-3 text-[#8C92A4] group-hover:text-white transition-colors"
                >
                  <ArrowUpRight size={16} />
                </Link>
                {/* Floating Mockup representation */}
                <div className="w-32 h-20 rounded-md bg-[#181B24] border border-[#2A2F3E] shadow-2xl flex flex-col justify-between p-2">
                  <div className="w-8 h-1.5 rounded-full bg-white/40" />
                  <div className="space-y-1">
                    <div className="w-16 h-1 rounded bg-white/20" />
                    <div className="w-10 h-1 rounded bg-white/20" />
                  </div>
                </div>
              </div>

              <h3 className="font-sans font-extrabold text-2xl tracking-wide text-white mb-2">
                WEB
              </h3>
              <p className="text-xs text-[#8C92A4] leading-relaxed mb-6">
                Modern, fast and scalable web experiences for brands and businesses.
              </p>
            </div>

            {/* Pill Tags */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#151720]">
              {['Web Development', 'Web Apps', 'UI/UX', 'E-commerce', 'Extensions', 'Dashboards'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-[#111319] border border-[#1D212A] text-[10px] text-[#A2A8B8] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card 03 - AGENTS & AUTOMATION */}
          <div className="rounded-2xl bg-[#090A0E] border border-[#181B24] hover:border-[#2C3140] transition-all duration-300 p-6 flex flex-col justify-between group">
            <div>
              {/* Agent Spark Preview Box */}
              <div className="relative aspect-[16/10] w-full rounded-xl bg-[#11131A] border border-[#202430] mb-6 overflow-hidden flex items-center justify-center p-4">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-radial from-[#FF5E1E]/20 via-transparent to-transparent pointer-events-none"
                />
                <span className="absolute top-3 left-3 text-[11px] font-mono text-[#6E7487]">03</span>
                <Link
                  href="/services#agents"
                  className="absolute top-3 right-3 text-[#8C92A4] group-hover:text-white transition-colors"
                >
                  <ArrowUpRight size={16} />
                </Link>
                {/* 3D Keycap / Spark Star representation */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-[#222634] to-[#12141C] border border-[#31374A] flex items-center justify-center shadow-lg">
                  <div className="w-5 h-5 text-[#FF5E1E] flex items-center justify-center font-bold text-lg">
                    ✦
                  </div>
                </div>
              </div>

              <h3 className="font-sans font-extrabold text-2xl tracking-wide text-white mb-2">
                AGENTS &amp; AUTOMATION
              </h3>
              <p className="text-xs text-[#8C92A4] leading-relaxed mb-6">
                AI agents and automation systems that save time, reduce work and scale ops.
              </p>
            </div>

            {/* Pill Tags */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#151720]">
              {['AI Chatbots', 'Voice Agents', 'Custom Agents', 'n8n Workflows', 'Business Automation', 'RAG'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-[#111319] border border-[#1D212A] text-[10px] text-[#A2A8B8] font-medium"
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
