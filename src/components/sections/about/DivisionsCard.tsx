import React from "react";
import Link from "next/link";
import { Play, Layers, Sparkles, Workflow } from "lucide-react";

interface DivisionPillar {
  number: string;
  title: string;
  description: string;
  href: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const DIVISION_PILLARS: readonly DivisionPillar[] = [
  {
    number: "01",
    title: "Media",
    description: "Stories that move people.",
    href: "/services/media",
    Icon: Play,
  },
  {
    number: "02",
    title: "Digital",
    description: "Products that solve real problems.",
    href: "/services/digital",
    Icon: Layers,
  },
  {
    number: "03",
    title: "AI",
    description: "Intelligent systems that scale work.",
    href: "/services/ai",
    Icon: Sparkles,
  },
  {
    number: "04",
    title: "Systems",
    description: "Automation that connects it all.",
    href: "/services",
    Icon: Workflow,
  },
];

export function DivisionsCard() {
  return (
    <article className="rounded-[18px] bg-[#F5F0E9]/85 border border-[#D9D2C8] p-4 sm:p-5 xl:p-6">
      {/* Header Label + Extending Rule */}
      <div className="flex items-center gap-3.5 pb-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#111111] shrink-0">
          OUR DIVISIONS
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-[#D9D2C8]" />
      </div>

      {/* Four Equal Columns (2x2 on Mobile, 4 Columns on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-5 lg:gap-y-0">
        {DIVISION_PILLARS.map((pillar, idx) => {
          const { Icon } = pillar;
          const borderClasses = [
            idx % 2 === 1 ? "border-l border-[#C8C0B7]/60 pl-4 lg:pl-5" : "pr-3 lg:pr-5",
            idx >= 2 ? "border-t border-[#C8C0B7]/60 pt-4 lg:border-t-0 lg:pt-0" : "",
            idx > 0 ? "lg:border-l lg:border-[#C8C0B7] lg:pl-5" : "lg:pl-0",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <Link
              key={pillar.title}
              href={pillar.href}
              data-about-division-col
              aria-label={`${pillar.number} — ${pillar.title}: ${pillar.description}`}
              className={`group relative flex flex-col justify-between pb-1.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6900]/60 rounded-sm ${borderClasses}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <Icon
                    strokeWidth={1.6}
                    className="w-5 h-5 text-[#FF6900] transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:text-[#FF7F24]"
                  />
                  <span
                    style={{ fontFamily: "var(--font-space-mono)" }}
                    className="text-[10px] tracking-[0.14em] text-[#111111]/40 transition-colors duration-300 group-hover:text-[#111111]/75"
                  >
                    {pillar.number}
                  </span>
                </div>

                <h3 className="text-[18px] sm:text-[20px] xl:text-[22px] font-bold tracking-[-0.025em] text-[#111111] leading-tight">
                  {pillar.title}
                </h3>

                <p className="mt-1 text-[13px] sm:text-[13.5px] xl:text-[14.5px] font-normal text-[#454545] leading-[1.35] transition-opacity duration-300 group-hover:opacity-90 group-hover:text-[#111111]">
                  {pillar.description}
                </p>
              </div>

              {/* Subtle Hover Accent Underline */}
              <span
                aria-hidden="true"
                className="mt-2 block h-[1.5px] w-full origin-left scale-x-0 bg-[#FF6900] transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </Link>
          );
        })}
      </div>
    </article>
  );
}
