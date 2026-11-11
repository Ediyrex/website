import React from "react";

interface StudioStat {
  value: string;
  label: string;
}

const STUDIO_STATS: readonly StudioStat[] = [
  { value: "04", label: "Divisions" },
  { value: "20+", label: "Projects" },
  { value: "10+", label: "Clients" },
  { value: "01", label: "Studio" },
];

export function StudioStatsCard() {
  return (
    <article
      data-about-stats
      className="rounded-[18px] bg-[#F5F0E9] border border-[#D9D2C8] p-4 sm:p-5 lg:p-5 flex flex-col justify-between gap-3.5"
    >
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#111111] shrink-0">
          STUDIO IN NUMBERS
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-[#D9D2C8]" />
      </div>

      <dl className="grid grid-cols-4 divide-x divide-[#D9D2C8]/90">
        {STUDIO_STATS.map((stat, idx) => (
          <div
            key={stat.label}
            className={`${idx > 0 ? "pl-2.5 sm:pl-3" : ""} ${idx < STUDIO_STATS.length - 1 ? "pr-2" : ""}`}
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd className="text-[22px] sm:text-[26px] lg:text-[24px] xl:text-[28px] font-extrabold tracking-[-0.03em] leading-none text-[#111111]">
              {stat.value}
            </dd>
            <dd className="mt-1 text-[11px] sm:text-[12px] xl:text-[13px] font-medium text-[#454545]">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
