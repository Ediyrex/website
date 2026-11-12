"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import {
  getWorkFilterOptions,
  PUBLISHED_PROJECTS,
  type EnrichedProject,
  type WorkDivisionFilter,
} from "./projects.data";
import { cn } from "@/lib/utils";

export function ProjectIndex() {
  const [filter, setFilter] = useState<WorkDivisionFilter>("all");
  const [selectedSlug, setSelectedSlug] = useState<string>(
    PUBLISHED_PROJECTS[0]?.slug ?? "",
  );

  const filterOptions = useMemo(() => getWorkFilterOptions(), []);

  const filteredProjects = useMemo(() => {
    if (filter === "all") return PUBLISHED_PROJECTS;
    if (filter === "explorations") {
      return PUBLISHED_PROJECTS.filter((p) => p.isConcept);
    }
    if (filter === "ai") {
      return PUBLISHED_PROJECTS.filter(
        (p) => p.category === "ai" || p.category === "hybrid",
      );
    }
    return PUBLISHED_PROJECTS.filter((p) => p.category === filter);
  }, [filter]);

  const activeProject: EnrichedProject | undefined = useMemo(() => {
    return (
      filteredProjects.find((p) => p.slug === selectedSlug) ??
      filteredProjects[0]
    );
  }, [filteredProjects, selectedSlug]);

  const rangeLabel =
    filteredProjects.length > 0
      ? `${filteredProjects[0].number}–${filteredProjects[filteredProjects.length - 1].number}`
      : "000";

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (filteredProjects.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = filteredProjects[(index + 1) % filteredProjects.length];
      setSelectedSlug(next.slug);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev =
        filteredProjects[
          (index - 1 + filteredProjects.length) % filteredProjects.length
        ];
      setSelectedSlug(prev.slug);
    }
  };

  return (
    <section
      id="project-index"
      aria-label="Interactive Project Index"
      className="border-b border-[#CFC5B9] bg-[#F5EFE5] py-16 text-[#171717] sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        {/* Top Header + Filter Strip */}
        <div className="flex flex-col justify-between gap-6 border-b-[1.5px] border-[#171717] pb-6 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#F06419]">
              EXPLORE OUR WORK / {rangeLabel}
            </p>
            <h2
              style={{ fontFamily: "var(--font-archivo-narrow), sans-serif" }}
              className="mt-2 text-[clamp(2.25rem,4vw,3.6rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-[#171717]"
            >
              Project Index
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter project index"
            className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-1"
          >
            {filterOptions.map((option) => {
              const isSelected = filter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    "cursor-pointer whitespace-nowrap rounded-[4px] border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors",
                    isSelected
                      ? "border-[#171717] bg-[#171717] font-semibold text-[#F5EFE5]"
                      : "border-[#CFC5B9] bg-[#FFFCF7] text-[#49433E] hover:border-[#171717] hover:text-[#171717]",
                  )}
                >
                  {option.label} ({option.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 || !activeProject ? (
          <div className="mt-10 border border-[#CFC5B9] bg-[#FFFCF7] p-10 text-center">
            <p className="font-heading text-lg font-semibold text-[#171717]">
              No published projects in this category yet.
            </p>
            <p className="mt-2 text-sm text-[#49433E]">
              Reset the filter to inspect all available studio blueprints and
              case studies.
            </p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="mt-4 cursor-pointer font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#F06419] underline"
            >
              Show All Work
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[38%_1fr] lg:gap-12">
            {/* Left Panel: Numbered Project Index */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="divide-y divide-[#CFC5B9] border-b border-t border-[#171717]">
                {filteredProjects.map((project, index) => {
                  const isActive = project.slug === activeProject.slug;
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setSelectedSlug(project.slug)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "group flex w-full cursor-pointer items-start justify-between gap-4 px-3 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] sm:px-4",
                        isActive
                          ? "border-l-4 border-l-[#F06419] bg-[#FBE5D3]"
                          : "hover:bg-[#FFFCF7]",
                      )}
                    >
                      <div className="flex min-w-0 items-baseline gap-3.5">
                        <span className="shrink-0 font-mono text-xs font-semibold tracking-[0.12em] text-[#F06419]">
                          {project.number}
                        </span>
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "truncate font-[var(--font-space-grotesk)] text-[16px] font-bold transition-colors sm:text-[17px]",
                              isActive
                                ? "text-[#171717]"
                                : "text-[#171717] group-hover:text-[#F06419]",
                            )}
                          >
                            {project.title}
                          </p>
                          <p className="mt-1 text-xs text-[#77716A]">
                            {project.projectType} · {project.divisionLabel}
                          </p>
                          <span className="mt-2 inline-block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#49433E]">
                            {project.statusLabel}
                          </span>
                        </div>
                      </div>

                      <ArrowUpRight
                        aria-hidden="true"
                        className={cn(
                          "mt-1 h-4 w-4 shrink-0 transition-transform duration-200",
                          isActive
                            ? "translate-x-0.5 -translate-y-0.5 text-[#F06419]"
                            : "text-[#77716A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#F06419]",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Panel: Selected Project Large Preview */}
            <article className="min-w-0 space-y-6">
              {/* Top Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#CFC5B9] pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#F06419]">
                    {activeProject.number} / SELECTED PROJECT
                  </span>
                  <span className="text-[#CFC5B9]" aria-hidden="true">
                    |
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#49433E]">
                    {activeProject.divisionLabel}
                  </span>
                </div>

                {activeProject.isConcept ? (
                  <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#F06419]/40 bg-[#FBE5D3] px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F06419]">
                    <AlertCircle className="h-3 w-3" aria-hidden="true" />
                    {activeProject.statusLabel}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#171717]/20 bg-[#171717] px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F5EFE5]">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    {activeProject.statusLabel}
                  </span>
                )}
              </div>

              {/* Large Visual Preview */}
              <Link
                href={`/work/${activeProject.slug}`}
                className="group block overflow-hidden border border-[#171717] bg-[#0C0D0F]"
              >
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={activeProject.coverImage}
                    alt={activeProject.coverAlt || activeProject.title}
                    width={1200}
                    height={675}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </Link>

              {/* Project Information */}
              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
                  {activeProject.title}
                </h3>
                <p className="max-w-[760px] text-[15.5px] leading-[1.65] text-[#49433E] sm:text-[17px]">
                  {activeProject.summary}
                </p>
              </div>

              {/* Metadata Grid: THE WORK / CAPABILITIES / DELIVERABLES */}
              <div className="grid grid-cols-1 gap-6 border-t border-[#CFC5B9] pt-6 sm:grid-cols-3">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#77716A]">
                    THE WORK
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#171717]">
                    {activeProject.projectType}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#77716A]">
                    CAPABILITIES
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#171717]">
                    {activeProject.servicesDemonstrated.slice(0, 3).join(", ")}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#77716A]">
                    DELIVERABLES
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#171717]">
                    {activeProject.outcomes?.[0] ??
                      "Documented studio blueprint & implementation"}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/work/${activeProject.slug}`}
                  className="inline-flex items-center gap-2 rounded-[4px] bg-[#F06419] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#FFFFFF] transition-colors hover:bg-[#D95612]"
                >
                  <span>View Full Case Study</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        )}
      </div>
    </section>
  );
}

