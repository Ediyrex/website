import React from "react";

const DESCRIPTORS = ["CREATIVE", "TECHNOLOGY", "AUTOMATION"] as const;

export function SectionHeader() {
  return (
    <div
      data-about-header
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 md:pb-5"
    >
      <div className="flex items-center">
        <span className="text-[14px] lg:text-[16px] font-black uppercase tracking-[1.4px] text-[#111111]">
          ABOUT EDIYREX
        </span>
      </div>

      <div
        aria-label="Creative, Technology, Automation"
        className="flex flex-wrap items-center gap-2.5 text-[11px] lg:text-[12.5px] font-semibold uppercase tracking-[1.5px] text-[#111111]"
      >
        {DESCRIPTORS.map((item, idx) => (
          <React.Fragment key={item}>
            {idx > 0 && (
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-[#FF6900]"
              />
            )}
            <span>{item}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
