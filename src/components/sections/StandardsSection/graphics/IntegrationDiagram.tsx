import { Code2, PlayCircle, Sparkles } from "lucide-react";

export function IntegrationDiagram() {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-[138px] w-[144px] shrink-0 items-center justify-center mx-auto sm:mx-0"
    >
      <svg
        viewBox="0 0 184 176"
        fill="none"
        className="h-full w-full overflow-visible"
      >
        <circle
          data-brutal-svg
          cx="92"
          cy="56"
          r="44"
          stroke="#F06419"
          strokeWidth="1.35"
          className="transition-all duration-300 group-hover:stroke-[#171717]"
        />
        <circle
          data-brutal-svg
          cx="58"
          cy="116"
          r="44"
          stroke="#F06419"
          strokeWidth="1.35"
          className="transition-all duration-300 group-hover:stroke-[#171717]"
        />
        <circle
          data-brutal-svg
          cx="126"
          cy="116"
          r="44"
          stroke="#F06419"
          strokeWidth="1.35"
          className="transition-all duration-300 group-hover:stroke-[#171717]"
        />
        <circle
          cx="92"
          cy="94"
          r="13"
          fill="#F06419"
          fillOpacity="0.16"
          className="transition-opacity duration-300 group-hover:fill-opacity-30"
        />
      </svg>

      <div className="absolute top-[20px] left-1/2 -translate-x-1/2 flex flex-col items-center text-[#171717]">
        <PlayCircle className="h-3.5 w-3.5 stroke-[1.75] text-[#F06419]" />
        <span className="font-heading text-[9.5px] font-semibold leading-tight">
          Media
        </span>
      </div>

      <div className="absolute bottom-[22px] left-[22px] flex flex-col items-center text-[#171717]">
        <Code2 className="h-3.5 w-3.5 stroke-[1.75] text-[#171717] group-hover:text-[#F06419] transition-colors" />
        <span className="font-heading text-[9.5px] font-semibold leading-tight">
          Digital
        </span>
      </div>

      <div className="absolute bottom-[22px] right-[28px] flex flex-col items-center text-[#171717]">
        <Sparkles className="h-3.5 w-3.5 stroke-[1.75] text-[#171717] group-hover:text-[#F06419] transition-colors" />
        <span className="font-heading text-[9.5px] font-semibold leading-tight">
          AI
        </span>
      </div>
    </div>
  );
}

