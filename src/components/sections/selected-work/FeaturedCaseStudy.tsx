import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Database,
  Sparkles,
  Workflow,
  Zap,
  Layers,
} from "lucide-react";
import type { SelectedWorkProject } from "@/data/projects";

const FEATURED_PILL_ICONS = [Sparkles, Workflow, Layers] as const;

interface FeaturedCaseStudyProps {
  project: SelectedWorkProject;
}

export function FeaturedCaseStudy({ project }: FeaturedCaseStudyProps) {
  return (
    <article
      data-sw-featured
      className="group relative w-full rounded-[24px] bg-[#151311] text-[#EAE4DD] overflow-hidden border border-white/10 shadow-[0_24px_54px_-18px_rgba(17,17,17,0.28)]"
    >
      {/* Subtle Flowing Burnt-Orange Ambient Light Bloom on Right Side */}
      <div
        data-sw-featured-glow
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -bottom-16 w-[62%] h-[115%] opacity-75"
        style={{
          background:
            "radial-gradient(ellipse at 68% 64%, rgba(243,107,22,0.34) 0%, rgba(255,154,82,0.12) 42%, rgba(21,19,17,0) 72%)",
        }}
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 800 360"
        fill="none"
        className="pointer-events-none absolute right-0 bottom-0 w-[68%] h-full opacity-55"
      >
        <path
          d="M 140 350 C 310 315, 440 215, 795 160"
          stroke="url(#featured-orange-wave)"
          strokeWidth="1.5"
        />
        <path
          d="M 220 355 C 390 325, 510 245, 795 205"
          stroke="url(#featured-orange-wave)"
          strokeWidth="1.1"
          strokeOpacity="0.65"
        />
        <defs>
          <linearGradient
            id="featured-orange-wave"
            x1="140"
            y1="350"
            x2="795"
            y2="160"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F36B16" stopOpacity="0" />
            <stop offset="0.55" stopColor="#F36B16" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FF9A52" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[44fr_56fr] min-h-[340px] lg:h-[350px]">
        {/* Left Info Side (~44%) */}
        <div className="p-7 sm:p-8 lg:p-9 flex flex-col justify-between gap-6">
          <div className="space-y-3.5">
            <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#EAE4DD]/75">
              {project.category}
            </span>

            <h3 className="text-[clamp(1.55rem,2.35vw,2.25rem)] font-bold text-white leading-[1.1] tracking-[-0.025em]">
              {project.title}
            </h3>

            <p className="text-[14.5px] sm:text-[15.5px] text-[#EAE4DD]/80 leading-[1.5] max-w-[430px]">
              {project.description}
            </p>
          </div>

          <div className="space-y-5">
            {/* Three Compact Category Chips */}
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag, idx) => {
                const TagIcon = FEATURED_PILL_ICONS[idx % FEATURED_PILL_ICONS.length];
                return (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11.5px] font-medium text-[#EAE4DD]"
                  >
                    <TagIcon className="w-3 h-3 text-[#FF9A52]" />
                    <span>{tag}</span>
                  </span>
                );
              })}
            </div>

            {/* Cream Pill CTA */}
            <div>
              <Link
                href={project.caseStudyUrl}
                className="group/cta inline-flex items-center gap-2 h-[44px] px-6 rounded-full bg-[#FBF8F4] text-[#111111] text-[14px] font-bold border border-transparent transition-all duration-250 hover:bg-[#FFF0E2] hover:border-[#F36B16]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36B16]"
              >
                <span>View case study</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-250 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 group-hover/cta:text-[#F36B16]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Layered Dark Glass Product Interface Composition (~56%) */}
        <div className="relative flex items-center justify-center px-6 pb-8 pt-2 lg:p-6 [perspective:1200px] overflow-hidden">
          <div className="relative w-full max-w-[500px] h-[240px] sm:h-[260px] transition-transform duration-500 ease-out group-hover:[transform:rotateY(-2deg)_rotateX(1.5deg)]">
            {/* Secondary Panel 1: Upper-Left Background App Frame */}
            <div
              data-sw-featured-subpanel
              className="hidden sm:block absolute left-0 top-1 w-[56%] h-[165px] rounded-[16px] border border-white/12 bg-[#1D1A17]/80 backdrop-blur-md p-3.5 shadow-2xl [transform:rotateY(-12deg)_rotate(-2deg)]"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF9A52]" />
                <span className="w-2 h-2 rounded-full bg-white/30" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
              </div>
              <div className="mt-4 space-y-2 opacity-40">
                <div className="h-1.5 w-2/3 rounded bg-white/25" />
                <div className="h-1.5 w-1/2 rounded bg-white/15" />
              </div>
            </div>

            {/* Secondary Panel 2: Lower-Right Telemetry Bars */}
            <div
              data-sw-featured-subpanel
              className="hidden sm:flex flex-col justify-center gap-2.5 absolute right-0 bottom-3 w-[36%] h-[145px] rounded-[16px] border border-white/12 bg-[#1B1815]/85 backdrop-blur-md p-4 shadow-2xl [transform:rotateY(-14deg)_rotate(1deg)]"
            >
              {[76, 58, 86, 48, 66].map((pct, i) => (
                <div
                  key={i}
                  className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden"
                >
                  <div
                    className={`h-full rounded-full ${
                      i === 0 || i === 2
                        ? "bg-gradient-to-r from-[#F36B16] to-[#FF9A52]"
                        : "bg-white/30"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              ))}
            </div>

            {/* Central Primary Dark Glass Dashboard Node Panel */}
            <div
              data-sw-featured-mainpanel
              className="relative sm:absolute sm:left-[12%] sm:top-4 sm:w-[68%] h-[215px] sm:h-[225px] rounded-[18px] border border-[#FF9A52]/55 bg-[#1B1714]/88 backdrop-blur-xl p-5 shadow-[0_24px_50px_rgba(0,0,0,0.65),0_0_32px_rgba(243,107,22,0.16)] flex items-center justify-center [transform:rotateY(-9deg)_rotate(-1deg)]"
            >
              {/* Orthogonal Workflow Node SVG Connectors */}
              <svg
                aria-hidden="true"
                viewBox="0 0 280 180"
                fill="none"
                className="pointer-events-none absolute inset-0 w-full h-full"
              >
                <path
                  data-sw-featured-line
                  d="M 64 114 L 106 114 L 106 54 L 122 54"
                  stroke="#F36B16"
                  strokeOpacity="0.65"
                  strokeWidth="1.25"
                />
                <path
                  data-sw-featured-line
                  d="M 176 54 L 222 54 L 222 86"
                  stroke="#FF9A52"
                  strokeOpacity="0.55"
                  strokeWidth="1.25"
                />
                <path
                  data-sw-featured-line
                  d="M 148 76 L 148 118"
                  stroke="#F36B16"
                  strokeOpacity="0.8"
                  strokeWidth="1.35"
                />
                <path
                  data-sw-featured-line
                  d="M 176 140 L 222 140 L 222 118"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="1.15"
                />
              </svg>

              {/* Connected System Nodes */}
              <div className="relative z-10 grid grid-cols-3 gap-3 items-center w-full h-full">
                {/* Node 1: Orchestrator Sparkles */}
                <div className="justify-self-start self-end mb-2 w-12 h-12 rounded-xl border border-white/20 bg-white/[0.06] flex items-center justify-center text-[#EAE4DD]">
                  <Sparkles className="w-5 h-5" strokeWidth={1.6} />
                </div>

                {/* Middle Stack: AI Agent + Glowing Execution Node */}
                <div className="flex flex-col items-center justify-between h-full py-1 gap-3">
                  <div className="w-13 h-12 rounded-xl border border-white/20 bg-white/[0.08] flex items-center justify-center text-white shadow-inner">
                    <Bot className="w-5 h-5" strokeWidth={1.6} />
                  </div>
                  <div className="w-14 h-12 rounded-xl border border-[#FF9A52] bg-gradient-to-br from-[#F36B16]/45 to-[#F36B16]/15 shadow-[0_0_24px_rgba(243,107,22,0.5)] flex items-center justify-center text-[#FF9A52]">
                    <Zap className="w-5 h-5 fill-[#FF9A52]" strokeWidth={1.6} />
                  </div>
                </div>

                {/* Node 3: Database Icon */}
                <div className="justify-self-end self-center w-13 h-12 rounded-xl border border-white/20 bg-white/[0.07] flex items-center justify-center text-[#EAE4DD]">
                  <Database className="w-5 h-5" strokeWidth={1.6} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

