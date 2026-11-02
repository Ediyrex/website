import { Cloud, Cpu, Network } from 'lucide-react'

export function SocialProofBar() {
  return (
    <div className="border-y border-[#181a20] bg-[#08090b] py-5 my-8">
      <div className="container-main flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Left Statement */}
        <div className="flex items-center gap-6 shrink-0">
          <p className="text-[10px] font-mono tracking-[0.16em] text-[#777d87] uppercase leading-[1.4]">
            BUILT FOR <br />
            CREATORS, STARTUPS <br />
            AND BUSINESSES.
          </p>
          <div className="hidden sm:block w-px h-8 bg-[#252a32]" />
        </div>

        {/* Right Tools/Technology Strip */}
        <div className="flex flex-wrap items-center gap-8 md:gap-12 text-[#b2b4ba]">
          {/* Notion */}
          <div className="flex items-center gap-2 text-[12px] font-medium hover:text-[#f5f3ee] transition-colors cursor-default">
            <div className="w-4 h-4 rounded-[3px] border border-[#3a414b] flex items-center justify-center font-serif text-[10px] font-bold text-[#f5f3ee]">
              N
            </div>
            <span>Notion</span>
          </div>

          {/* Google Cloud */}
          <div className="flex items-center gap-2 text-[12px] font-medium hover:text-[#f5f3ee] transition-colors cursor-default">
            <Cloud size={15} />
            <span>Google Cloud</span>
          </div>

          {/* n8n */}
          <div className="flex items-center gap-2 text-[12px] font-medium hover:text-[#f5f3ee] transition-colors cursor-default">
            <Network size={15} />
            <span>n8n</span>
          </div>

          {/* OpenAI */}
          <div className="flex items-center gap-2 text-[12px] font-medium hover:text-[#f5f3ee] transition-colors cursor-default">
            <Cpu size={15} />
            <span>OpenAI</span>
          </div>
        </div>
      </div>
    </div>
  )
}
