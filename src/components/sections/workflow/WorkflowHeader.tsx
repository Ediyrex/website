import React from "react";

export function WorkflowHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 lg:pb-7">
      <div className="space-y-3">
        <h2 className="m-0">
          <span className="block font-bold text-[#111111] text-[30px] sm:text-[38px] lg:text-[42px] leading-[1.0] tracking-[-0.035em]">
            A clear process from
          </span>
          <span
            style={{ fontFamily: "var(--font-playfair)" }}
            className="block font-normal italic text-[#111111] text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.05] tracking-[-0.02em]"
          >
            first thought to finished reality
            <span
              aria-hidden="true"
              className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF6900] ml-1.5 align-baseline"
            />
          </span>
        </h2>
      </div>

      <div className="max-w-[330px] md:text-right">
        <p className="text-[14.5px] sm:text-[15.5px] text-[#56514B] leading-[1.45]">
          A connected process that transforms ambitious ideas into meaningful
          outcomes.
        </p>
        <span
          aria-hidden="true"
          className="mt-2.5 inline-block w-10 h-[2px] bg-[#FF6900]"
        />
      </div>
    </div>
  );
}

