import React from "react";
import Link from "next/link";
import Image from "next/image";
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
                {/* Clean 16:10 Visual Frame with Next/Image + Alt Text */}
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
                      0{index + 1} / {meta.label}
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
