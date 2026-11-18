"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { PROJECTS_DATA } from "@/features/work/data";
import type { ServiceDivision } from "@/types";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | ServiceDivision | "hybrid";

const CATEGORY_TABS: { label: string; value: CategoryFilter }[] = [
  { label: "All", value: "all" },
  { label: "Branding", value: "branding" },
  { label: "Media", value: "media" },
  { label: "Web & Apps", value: "digital" },
  { label: "AI & Automation", value: "ai" },
  { label: "Hybrid Labs", value: "hybrid" },
];

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  branding: { label: "BRANDING & MARKETING", color: "#F07824" },
  media: { label: "MEDIA & CONTENT", color: "#E58A76" },
  digital: { label: "WEB, APPS & PRODUCTS", color: "#7BA9F5" },
  ai: { label: "AI & AUTOMATION", color: "#B5A0F5" },
  hybrid: { label: "HYBRID LABS", color: "#D9B875" },
};

export function WorkArchiveSection() {
  const [filter, setFilter] = useState<CategoryFilter>("all");

  const publishedProjects = PROJECTS_DATA.filter((p) => p.isPublished);
  const filteredProjects =
    filter === "all"
      ? publishedProjects
      : publishedProjects.filter((p) => p.category === filter);

  return (
    <section
      aria-label="Project Archive"
      className="bg-[#0B0D0F] py-20 text-[#F5F2EC] lg:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        {/* Section Header + Filter Bar */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#292E35] pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#D9B875]">
              ARCHIVE / {String(filteredProjects.length).padStart(2, "0")} ENTRIES
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-[#F5F2EC] sm:text-4xl">
              Built for Real-World{" "}
              <span className="italic text-[#F07824]">Impact.</span>
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter projects by division"
            className="flex max-w-full items-center gap-1.5 overflow-x-auto rounded-lg border border-[#292E35] bg-[#121519] p-1"
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = filter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(tab.value)}
                  className={cn(
                    "cursor-pointer whitespace-nowrap rounded-md px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
                    isActive
                      ? "bg-[#F07824] font-semibold text-[#0B0D0F]"
                      : "text-[#B8B9BC] hover:text-[#F5F2EC]",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="mt-12 rounded-[10px] border border-[#292E35] bg-[#121519] p-12 text-center">
            <p className="font-heading text-lg text-[#F5F2EC]">
              No projects match this division filter yet.
            </p>
            <p className="mt-2 text-sm text-[#858991]">
              Select another discipline or reset the filter to view all
              published blueprints.
            </p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="mt-4 cursor-pointer font-mono text-xs uppercase tracking-[0.14em] text-[#F07824] underline hover:text-[#F5F2EC]"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-7 lg:grid-cols-2">
            {filteredProjects.map((project, index) => {
              const meta = CATEGORY_META[project.category] ?? {
                label: project.category.toUpperCase(),
                color: "#D9B875",
              };
              const number = String(index + 1).padStart(2, "0");

              return (
                <article
                  key={project.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-[10px] border border-[#292E35] bg-[#121519] transition-colors duration-200 hover:border-[#4A5059]"
                >
                  <div>
                    {/* Artwork Frame */}
                    <Link
                      href={`/work/${project.slug}`}
                      className="relative block aspect-[16/10] overflow-hidden border-b border-[#292E35] bg-[#08090B]"
                    >
                      <Image
                        src={project.coverImage}
                        alt={project.coverAlt || project.title}
                        width={800}
                        height={500}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute left-4 top-4 flex items-center gap-2">
                        <span className="rounded bg-[#0B0D0F]/90 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-[0.14em] text-[#F07824] backdrop-blur-sm">
                          {number}
                        </span>
                        {project.isConcept ? (
                          <span className="inline-flex items-center gap-1 rounded border border-[#D9B875]/40 bg-[#0B0D0F]/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#D9B875] backdrop-blur-sm">
                            <AlertCircle
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                            Concept Project
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded border border-[#54C99A]/40 bg-[#0B0D0F]/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#54C99A] backdrop-blur-sm">
                            <CheckCircle2
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                            Client Project
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="space-y-4 p-6 sm:p-7">
                      <p
                        className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em]"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </p>

                      <Link href={`/work/${project.slug}`} className="block">
                        <h3 className="font-heading text-xl font-semibold tracking-tight text-[#F5F2EC] transition-colors group-hover:text-[#F07824] sm:text-2xl">
                          {project.title}
                        </h3>
                      </Link>

                      <p className="text-sm leading-relaxed text-[#B8B9BC]">
                        {project.summary}
                      </p>

                      {project.servicesDemonstrated.length > 0 && (
                        <ul className="flex flex-wrap gap-1.5 pt-1">
                          {project.servicesDemonstrated.slice(0, 4).map((s) => (
                            <li
                              key={s}
                              className="rounded border border-[#292E35] bg-[#171B20] px-2.5 py-1 font-mono text-[11px] text-[#B8B9BC]"
                            >
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between border-t border-[#292E35] px-6 py-4 sm:px-7">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#858991]">
                      Case Study
                    </span>
                    <Link
                      href={`/work/${project.slug}`}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#F07824] transition-colors hover:text-[#F5F2EC]"
                    >
                      View Breakdown
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

