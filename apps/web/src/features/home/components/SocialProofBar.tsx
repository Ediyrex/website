import { Cloud, Cpu, Database, Network } from 'lucide-react'

export function SocialProofBar() {
  return (
    <div className="border-y border-[#15171F] bg-[#07080A]/60 py-6 my-10">
      <div className="container-main flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Kicker */}
        <div className="flex items-center gap-6">
          <p className="text-[11px] font-mono tracking-widest text-[#6E7487] uppercase leading-tight max-w-[140px]">
            BUILT FOR <br />
            CREATORS, STARTUPS <br />
            AND BUSINESSES.
          </p>
          <div className="hidden md:block w-px h-10 bg-[#1D202A]" />
        </div>

        {/* Tech Partners / Stack Row */}
        <div className="flex flex-wrap items-center gap-8 md:gap-14 text-[#8C92A4]">
          {/* Notion */}
          <div className="flex items-center gap-2 text-xs font-semibold hover:text-white transition-colors cursor-default">
            <div className="w-5 h-5 rounded border border-[#2B2F3D] flex items-center justify-center font-serif text-[11px] font-bold">
              N
            </div>
            <span>Notion</span>
          </div>

          {/* Google Cloud */}
          <div className="flex items-center gap-2 text-xs font-semibold hover:text-white transition-colors cursor-default">
            <Cloud size={16} />
            <span>Google Cloud</span>
          </div>

          {/* n8n */}
          <div className="flex items-center gap-2 text-xs font-semibold hover:text-white transition-colors cursor-default">
            <Network size={16} />
            <span>n8n</span>
          </div>

          {/* OpenAI */}
          <div className="flex items-center gap-2 text-xs font-semibold hover:text-white transition-colors cursor-default">
            <Cpu size={16} />
            <span>OpenAI</span>
          </div>
        </div>
      </div>
    </div>
  )
}
