import React from "react";

export function WorkflowHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 lg:pb-8 border-b border-[#DED4CA]">
      <div className="space-y-2.5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF6900]">
          04 / WORKFLOW &amp; DELIVERY PROCESS
        </span>

        <h2 className="m-0">
          <span className="block font-bold text-[#111111] text-[30px] sm:text-[38px] lg:text-[44px] leading-[1.0] tracking-[-0.035em]">
            A clear process from
          </span>
          <span
            style={{ fontFamily: "var(--font-playfair)" }}
            className="block font-normal italic text-[#111111] text-[32px] sm:text-[40px] lg:text-[46px] leading-[1.05] tracking-[-0.02em] pt-1"
          >
            first thought to finished reality
            <span
              aria-hidden="true"
              className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF6900] ml-2 align-baseline"
            />
          </span>
        </h2>
      </div>

      <div className="max-w-[360px] md:text-right space-y-2">
        <p className="text-[14.5px] sm:text-[15.5px] text-[#56514B] leading-[1.5]">
          A connected, four-phase studio process engineered for velocity,
          technical rigour, and complete client ownership.
        </p>
        <span
          aria-hidden="true"
          className="inline-block w-12 h-[2px] bg-[#FF6900]"
        />
      </div>
    </div>
  );
}
