import React from "react";

export function SectionLabel({ text }: { text: string }) {
  return (
    <div data-we-label className="flex items-center gap-3.5">
      <span aria-hidden="true" className="w-8 h-px bg-[#111111] shrink-0" />
      <span
        style={{ fontFamily: "var(--font-mono)" }}
        className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#111111]"
      >
        {text}
      </span>
    </div>
  );
}

