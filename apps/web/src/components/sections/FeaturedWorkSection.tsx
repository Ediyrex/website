import React from "react";
import Link from "next/link";
import { ArrowUpRight, AlertCircle } from "lucide-react";
import { PROJECTS_DATA } from "@/features/work/data";
import { Badge } from "@/components/ui/Badge";

const CATEGORY_META: Record<string, { label: string; accent: string }> = {
  media: { label: "Media", accent: "#E58A76" },
  digital: { label: "Digital", accent: "#7BA9F5" },
  ai: { label: "AI", accent: "#B5A0F5" },
  hybrid: { label: "Hybrid Studio", accent: "#D6B77A" },
};

export function FeaturedWorkSection() {
  const featuredProjects = PROJECTS_DATA.filter(
    (p) => p.featured && p.isPublished
  );

  return (
    <section
      id="work"
      className="py-16 md:py-28 bg-[#0D0F12] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
              Portfolio
            </span>
            <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12]">
              Selected work
            </h2>
            <p className="text-[#B2B4BA] text-base leading-relaxed">
              A closer look at ideas shaped into thoughtful experiences.
            </p>
          </div>

          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#D6B77A] hover:text-[#E6CC99] transition-colors shrink-0"
          >
            <span>View all work</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2-Column Editorial Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {featuredProjects.map((project, index) => {
            const meta = CATEGORY_META[project.category] || {
              label: project.category,
              accent: "#D6B77A",
            };

            return (
              <article
                key={project.id}
                className="group rounded-2xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] overflow-hidden flex flex-col justify-between transition-all duration-200"
              >
                {/* Clean 16:10 Visual Frame (text below image per Section 6.4) */}
                <div className="aspect-[16/10] bg-[#08090B] border-b border-[#252A32] p-6 flex flex-col justify-between relative overflow-hidden bg-editorial-grid">
                  <div
                    className="absolute inset-0 pointer-events-none opacity-60"
                    style={{
                      background: `radial-gradient(circle at 70% 30%, ${meta.accent}18 0%, transparent 65%)`,
                    }}
                  />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#777D87]">
                      0{index + 1} / {meta.label}
                    </span>
                    {project.isConcept ? (
                      <Badge variant="concept">
                        <AlertCircle className="w-3 h-3" />
                        <span>Concept project</span>
                      </Badge>
                    ) : (
                      <Badge variant="featured">Client project</Badge>
                    )}
                  </div>

                  {/* Restrained Geometric Preview */}
                  <div
                    aria-hidden="true"
                    className="relative z-10 my-auto flex items-center justify-center"
                  >
                    <div className="w-full max-w-xs h-24 rounded-xl bg-[#12151A]/90 border border-[#252A32] group-hover:border-[#3A414B] p-4 flex flex-col justify-between transition-colors">
                      <div className="flex items-center justify-between">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: meta.accent }}
                        />
                        <span className="text-[10px] font-mono text-[#777D87]">
                          {project.slug}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-1.5 w-3/4 rounded bg-[#252A32]" />
                        <div className="h-1.5 w-1/2 rounded bg-[#191D23]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Content Below Visual */}
                <div className="p-6 md:p-7 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#777D87]">
                      <span style={{ color: meta.accent }}>{meta.label}</span>
                      <span>
                        {project.isConcept ? "Concept exploration" : "Client work"}
                      </span>
                    </div>

                    <h3 className="font-heading font-semibold text-xl sm:text-2xl text-[#F5F3EE] group-hover:text-[#D6B77A] transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-[#B2B4BA] leading-relaxed">
                      {project.summary}
                    </p>
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
      </div>
    </section>
  );
}
