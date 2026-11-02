import { Cloud, Cpu, Network } from 'lucide-react'

export function SocialProofBar() {
  return (
    <div className="border-y border-[#292929] bg-[#08090B] h-[86px] flex items-center">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left label: Inter Medium 10-11px, 3 lines, ~1.35 line height */}
        <div className="flex items-center gap-6 shrink-0">
          <p className="font-inter font-medium text-[10.5px] tracking-[0.14em] text-[#777D87] uppercase leading-[1.35]">
            BUILT FOR <br />
            CREATORS, STARTUPS <br />
            AND BUSINESSES.
          </p>
          <div className="hidden sm:block w-[1px] h-[36px] bg-[#292929]" />
        </div>

        {/* Right monochrome tool identities */}
        <div className="flex items-center gap-8 sm:gap-12 text-[#D0CFCC]">
          {/* Notion */}
          <div className="flex items-center gap-2 font-inter font-medium text-[12px] hover:text-[#F5F3EE] transition-colors cursor-default">
            <div className="w-[18px] h-[18px] rounded-[3px] border border-[#3A414B] flex items-center justify-center font-serif text-[11px] font-bold text-[#F5F3EE]">
              N
            </div>
            <span>Notion</span>
          </div>

          {/* Google Cloud */}
          <div className="flex items-center gap-2 font-inter font-medium text-[12px] hover:text-[#F5F3EE] transition-colors cursor-default">
            <Cloud size={16} />
            <span>Google Cloud</span>
          </div>

          {/* n8n */}
          <div className="flex items-center gap-2 font-inter font-medium text-[12px] hover:text-[#F5F3EE] transition-colors cursor-default">
            <Network size={16} />
            <span>n8n</span>
          </div>

          {/* OpenAI */}
          <div className="flex items-center gap-2 font-inter font-medium text-[12px] hover:text-[#F5F3EE] transition-colors cursor-default">
            <Cpu size={16} />
            <span>OpenAI</span>
          </div>
        </div>
      </div>
    </div>
  )
}
