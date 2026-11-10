"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { PROJECTS_DATA } from "@/features/work/data";
import { ServiceDivision } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | ServiceDivision | "hybrid";

const CATEGORY_TABS: { label: string; value: CategoryFilter }[] = [
  { label: "All", value: "all" },
  { label: "Media", value: "media" },
  { label: "Digital", value: "digital" },
  { label: "AI", value: "ai" },
  { label: "Hybrid Labs", value: "hybrid" },
];

const CATEGORY_COLOR: Record<string, string> = {
  media: "#E58A76",
  digital: "#7BA9F5",
  ai: "#B5A0F5",
  hybrid: "#D6B77A",
};

export function WorkGallery() {
  const [filter, setFilter] = useState<CategoryFilter>("all");

  const publishedProjects = PROJECTS_DATA.filter((p) => p.isPublished);
  const filteredProjects =
    filter === "all"
      ? publishedProjects
      : publishedProjects.filter((p) => p.category === filter);

  return (
    <div className="space-y-10">
      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#252A32]">
        <div className="flex items-center gap-1.5 p-1 bg-[#12151A] border border-[#252A32] rounded-xl overflow-x-auto max-w-full">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={cn(
                "px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap",
                filter === tab.value
                  ? "bg-[#D6B77A] text-[#17130B] font-semibold"
                  : "text-[#B2B4BA] hover:text-[#F5F3EE]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="text-xs font-mono text-[#777D87]">
          Showing {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#12151A] border border-[#252A32] text-center space-y-3">
          <p className="font-heading text-lg text-[#F5F3EE]">
            No projects match this filter yet.
          </p>
          <p className="text-sm text-[#B2B4BA]">
            Select another discipline or reset the filter to view all published blueprints.
          </p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="text-xs font-mono text-[#D6B77A] hover:text-[#E6CC99] underline cursor-pointer"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {filteredProjects.map((project, index) => {
            const accent = CATEGORY_COLOR[project.category] || "#D6B77A";

            return (
              <article
                key={project.id}
                className="group rounded-2xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] overflow-hidden flex flex-col justify-between transition-colors"
              >
                {/* Header Artwork */}
                <div className="aspect-[16/10] bg-[#08090B] border-b border-[#252A32] relative overflow-hidden">
                  <Image
                    src={project.coverImage}
                    alt={project.coverAlt || project.title}
                    width={800}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-[#08090B]/90 border border-[#252A32] text-[#B2B4BA]">
                      0{index + 1} / {project.category}
                    </span>
                    {project.isConcept ? (
                      <Badge variant="concept" className="bg-[#08090B]/90">
                        <AlertCircle className="w-3 h-3" />
                        <span>Concept project</span>
                      </Badge>
                    ) : (
                      <Badge variant="featured" className="bg-[#08090B]/90">
                        Client project
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Body Below Image */}
                <div className="p-6 md:p-7 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#777D87]">
                      <span style={{ color: accent }}>
                        {project.category.toUpperCase()}
                      </span>
                      <span>{new Date(project.createdAt).getUTCFullYear()}</span>
                    </div>

                    <h2 className="font-heading font-semibold text-xl sm:text-2xl text-[#F5F3EE] group-hover:text-[#D6B77A] transition-colors">
                      {project.title}
                    </h2>

                    <p className="text-sm text-[#B2B4BA] leading-relaxed">
                      {project.summary}
                    </p>

                    {project.outcomes && project.outcomes.length > 0 && (
                      <ul className="space-y-1.5 pt-1">
                        {project.outcomes.map((outcome, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-xs text-[#B2B4BA]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B77A] shrink-0" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#252A32] space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.servicesDemonstrated.map((serviceName) => (
                        <span
                          key={serviceName}
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#0D0F12] text-[#B2B4BA] border border-[#252A32]"
                        >
                          {serviceName}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/work/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F5F3EE] hover:text-[#D6B77A] transition-colors"
                    >
                      <span>View case study</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
