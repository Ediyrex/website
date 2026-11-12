import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "@/types";
import { enrichProjects, PUBLISHED_PROJECTS } from "./projects.data";

export function StudioExplorations({
  projects,
}: {
  projects?: ProjectItem[];
}) {
  const allProjects = projects ? enrichProjects(projects) : PUBLISHED_PROJECTS;
  const explorations = allProjects.filter((p) => p.isConcept);

  return (
    <section
      aria-label="Studio Explorations"
      className="border-t border-[#292E35] bg-[#0C0D0F] py-16 text-[#F5EFE5] lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Intro */}
          <div className="space-y-4 lg:col-span-3">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 bg-[#F06419]"
              />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#F5EFE5]">
                STUDIO EXPLORATIONS
              </span>
            </div>

            <h2 className="font-heading text-3xl font-bold leading-[1.08] tracking-tight text-[#F5EFE5]">
              Research, prototypes &amp; what&apos;s next.
            </h2>

            <p className="text-sm leading-relaxed text-[#A9A39A]">
              Independent projects, early product ideas and experimental builds
              from our studio.
            </p>
          </div>

          {/* Right 3-Column Exploration Gallery */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3">
            {explorations.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/work/${item.slug}`}
                className="group flex flex-col justify-between overflow-hidden rounded-lg border border-[#292E35] bg-[#12151A] transition-colors duration-200 hover:border-[#F06419]/60"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[#292E35] bg-[#08090B]">
                    <Image
                      src={item.coverImage}
                      alt={item.coverAlt || item.title}
                      width={560}
                      height={350}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute right-3 top-3 rounded-full border border-[#E7B94F]/40 bg-[#0C0D0F]/90 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E7B94F]">
                      {item.statusLabel}
                    </span>
                  </div>

                  <div className="space-y-2 p-4">
                    <h3 className="font-heading text-base font-semibold text-[#F5EFE5] transition-colors group-hover:text-[#F06419]">
                      {item.title}
                    </h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-[#A9A39A]">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#292E35] px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#A9A39A]">
                    {item.projectTypeLabel}
                  </span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-[#F06419] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
