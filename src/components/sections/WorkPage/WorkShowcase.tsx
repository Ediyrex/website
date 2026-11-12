"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { ProjectItem } from "@/types";
import {
  enrichProjects,
  getWorkFilterOptions,
  PUBLISHED_PROJECTS,
  type EnrichedProject,
  type WorkDivisionFilter,
} from "./projects.data";
import { cn } from "@/lib/utils";

function StatusBadge({ project }: { project: EnrichedProject }) {
  const isShipped = project.statusLabel === "SHIPPED";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em]",
        isShipped
          ? "border-[#56C58B]/40 bg-[#56C58B]/10 text-[#56C58B]"
          : "border-[#E7B94F]/40 bg-[#E7B94F]/10 text-[#E7B94F]",
      )}
    >
      {isShipped ? (
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
      ) : (
        <AlertCircle className="h-3 w-3" aria-hidden="true" />
      )}
      {project.statusLabel}
    </span>
  );
}

export function WorkShowcase({ projects }: { projects?: ProjectItem[] }) {
  const [filter, setFilter] = useState<WorkDivisionFilter>("all");
  const allProjects = useMemo(
    () => (projects ? enrichProjects(projects) : PUBLISHED_PROJECTS),
    [projects],
  );
  const filterOptions = useMemo(
    () => getWorkFilterOptions(allProjects),
    [allProjects],
  );

  const filteredProjects = useMemo(() => {
    if (filter === "all") return allProjects;
    if (filter === "explorations") {
      return allProjects.filter((p) => p.isConcept);
    }
    if (filter === "ai") {
      return allProjects.filter(
        (p) => p.category === "ai" || p.category === "hybrid",
      );
    }
    return allProjects.filter((p) => p.category === filter);
  }, [allProjects, filter]);

  const featuredProject = useMemo(() => {
    return (
      filteredProjects.find((p) => p.featured) ?? filteredProjects[0] ?? null
    );
  }, [filteredProjects]);

  const archiveProjects = useMemo(() => {
    if (!featuredProject) return [];
    return filteredProjects.filter((p) => p.id !== featuredProject.id);
  }, [filteredProjects, featuredProject]);

  return (
    <section
      aria-label="Project Filters, Featured Case Study, and Archive"
      className="bg-[#0C0D0F] py-10 text-[#F5EFE5] sm:py-12"
    >
      <div className="mx-auto max-w-[1440px] space-y-14 px-5 sm:px-8 lg:px-14">
        {/* Section 03 — Project Category Filters */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#292E35] pb-6 lg:flex-row lg:items-center">
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="flex max-w-full items-center gap-1.5 overflow-x-auto rounded-lg border border-[#292E35] bg-[#12151A] p-1"
          >
            {filterOptions.map((option) => {
              const isActive = filter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    "cursor-pointer whitespace-nowrap rounded-md px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors",
                    isActive
                      ? "bg-[#F5EFE5] font-semibold text-[#0C0D0F]"
                      : "text-[#A9A39A] hover:text-[#F5EFE5]",
                  )}
                >
                  {option.label} ({option.count})
                </button>
              );
            })}
          </div>

          <p className="shrink-0 font-mono text-xs uppercase tracking-[0.14em] text-[#A9A39A]">
            SHOWING {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "PROJECT" : "PROJECTS"}
          </p>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-lg border border-[#292E35] bg-[#12151A] p-12 text-center">
            <p className="font-heading text-lg font-semibold text-[#F5EFE5]">
              No projects in this category yet. More work is being added to the
              archive.
            </p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="mt-4 cursor-pointer font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#F06419] underline hover:text-[#F5EFE5]"
            >
              Show All Work
            </button>
          </div>
        ) : (
          <>
            {/* Section 04 — Featured Case Study (48% / 52% split) */}
            {featuredProject && (
              <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-[#292E35] bg-[#12151A] lg:grid-cols-12">
                <Link
                  href={`/work/${featuredProject.slug}`}
                  className="group relative block aspect-[16/10] overflow-hidden border-b border-[#292E35] bg-[#08090B] lg:col-span-6 lg:aspect-auto lg:min-h-[380px] lg:border-b-0 lg:border-r"
                >
                  <Image
                    src={featuredProject.coverImage}
                    alt={featuredProject.coverAlt || featuredProject.title}
                    width={960}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </Link>

                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6 lg:p-10">
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#F06419]">
                        FEATURED CASE STUDY
                      </span>
                      <StatusBadge project={featuredProject} />
                    </div>

                    <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-[#F5EFE5] sm:text-4xl">
                      {featuredProject.title}
                    </h2>

                    <p className="text-sm leading-relaxed text-[#A9A39A] sm:text-base">
                      {featuredProject.summary}
                    </p>

                    <div className="grid grid-cols-1 gap-5 border-t border-[#292E35] pt-5 sm:grid-cols-3">
                      <div>
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A9A39A]">
                          THE WORK
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#F5EFE5]">
                          {featuredProject.servicesDemonstrated
                            .slice(0, 3)
                            .join(", ")}
                        </p>
                      </div>

                      <div>
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A9A39A]">
                          THE OUTCOME
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#F5EFE5]">
                          {featuredProject.outcomes?.[0] ??
                            featuredProject.projectTypeLabel}
                        </p>
                      </div>

                      <div>
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A9A39A]">
                          STATUS
                        </p>
                        <div className="mt-1.5">
                          <StatusBadge project={featuredProject} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/work/${featuredProject.slug}`}
                      className="inline-flex items-center gap-2 rounded-[4px] bg-[#F06419] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#FFFFFF] transition-colors hover:bg-[#D95612]"
                    >
                      <span>View Full Case Study</span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Section 05 — Project Archive (3-Column Desktop Grid) */}
            {archiveProjects.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 border-b border-[#292E35] pb-4">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 bg-[#F06419]"
                  />
                  <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#F5EFE5]">
                    PROJECT ARCHIVE
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {archiveProjects.map((project) => (
                    <article
                      key={project.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-lg border border-[#292E35] bg-[#12151A] transition-colors duration-200 hover:border-[#4A5059]"
                    >
                      <div>
                        {/* Card Metadata Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-[#292E35] px-5 py-3">
                          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A9A39A]">
                            {project.number} / {project.category.toUpperCase()}
                          </span>
                          <StatusBadge project={project} />
                        </div>

                        {/* Card Image */}
                        <Link
                          href={`/work/${project.slug}`}
                          className="block aspect-[16/10] overflow-hidden border-b border-[#292E35] bg-[#08090B]"
                        >
                          <Image
                            src={project.coverImage}
                            alt={project.coverAlt || project.title}
                            width={640}
                            height={400}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        </Link>

                        {/* Card Content */}
                        <div className="space-y-3 p-5">
                          <Link href={`/work/${project.slug}`} className="block">
                            <h3 className="font-heading text-xl font-semibold tracking-tight text-[#F5EFE5] transition-colors group-hover:text-[#F06419]">
                              {project.title}
                            </h3>
                          </Link>

                          <p className="line-clamp-2 text-sm leading-relaxed text-[#A9A39A]">
                            {project.summary}
                          </p>

                          <ul className="flex flex-wrap gap-1.5 pt-1">
                            {project.servicesDemonstrated
                              .slice(0, 3)
                              .map((service) => (
                                <li
                                  key={service}
                                  className="rounded border border-[#292E35] bg-[#171B20] px-2.5 py-1 font-mono text-[10px] text-[#A9A39A]"
                                >
                                  {service}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>

                      <div className="border-t border-[#292E35] px-5 py-3.5">
                        <Link
                          href={`/work/${project.slug}`}
                          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#F5EFE5] transition-colors group-hover:text-[#F06419]"
                        >
                          <span>
                            {project.isConcept
                              ? "View Project"
                              : "View Case Study"}
                          </span>
                          <ArrowUpRight
                            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

