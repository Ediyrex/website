import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  BLUEPRINTS_SECTION_DATA,
  BLUEPRINT_PROJECTS,
  type BlueprintProject,
  type BlueprintStatus,
} from "./blueprints.data";

interface RelevantBlueprintsProps {
  division: string;
  displayLimit?: number;
}

function getStatusBadgeClass(status: BlueprintStatus) {
  switch (status) {
    case "shipped":
      return "text-[#56C58B] border-[#56C58B]/70 bg-[#56C58B]/10";
    case "in-progress":
      return "text-[#7BA9F5] border-[#7BA9F5]/70 bg-[#7BA9F5]/10";
    case "rnd":
      return "text-[#B5A0F5] border-[#B5A0F5]/70 bg-[#B5A0F5]/10";
    case "concept":
    default:
      return "text-[#D9B875] border-[#D9B875]/70 bg-[#D9B875]/10";
  }
}

export function RelevantBlueprints({
  division,
  displayLimit = 3,
}: RelevantBlueprintsProps) {
  // Filter projects relevant to the current division (or all projects for portfolio / industries overview)
  const filteredProjects =
    division === "all" || division === "industries"
      ? BLUEPRINT_PROJECTS
      : BLUEPRINT_PROJECTS.filter((p) => p.divisionIds.includes(division));

  const displayedProjects = filteredProjects.slice(0, displayLimit);

  // If no projects found, show clean editorial empty state
  if (displayedProjects.length === 0) {
    return (
      <section
        aria-label="Relevant Blueprints"
        className="relative w-full bg-[#0C0D0F] text-[#F5F2EC] py-16 sm:py-20 lg:py-24 border-b border-[#252A32]"
      >
        <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8">
          <div className="space-y-4 py-8">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F5F2EC]">
              The next blueprint starts here.
            </h2>
            <p className="text-base sm:text-lg text-[#B8B9BC] leading-relaxed max-w-2xl">
              We&apos;re developing new explorations across this discipline. Explore our wider studio work or discuss an upcoming project with EDYREX.
            </p>
            <div className="pt-4 flex gap-4">
              <Link
                href="/work"
                className="px-5 py-2.5 rounded-xl bg-[#F06419] text-[#171717] font-bold text-xs font-mono uppercase tracking-wider"
              >
                EXPLORE ALL WORK ↗
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl border border-[#444444] text-[#F5F2EC] font-semibold text-xs font-mono uppercase tracking-wider hover:border-[#F06419] hover:text-[#F06419]"
              >
                START A PROJECT ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Relevant Blueprints — Project Index"
      className="relative w-full bg-[#0C0D0F] text-[#F5F2EC] py-16 sm:py-20 lg:py-24 border-b border-[#252A32]"
    >
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8 sm:space-y-10">
        {/* Main Editorial Headline */}
        <div className="space-y-4">
          <h2 className="font-heading font-extrabold text-[clamp(2.35rem,4.4vw,4.25rem)] leading-[0.98] tracking-[-0.035em] text-[#F5F2EC]">
            <span>{BLUEPRINTS_SECTION_DATA.headlineLine1} </span>
            <span className="italic text-[#F06419] font-extrabold">
              {BLUEPRINTS_SECTION_DATA.headlineLine2}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#B8B9BC] leading-relaxed max-w-4xl">
            {BLUEPRINTS_SECTION_DATA.description}
          </p>
        </div>

        {/* Horizontal Divider Before Projects */}
        <div className="h-px bg-[#444444] w-full" />

        {/* Repeating Editorial Project Rows */}
        <div className="divide-y divide-[#444444]">
          {displayedProjects.map((project, idx) => {
            const formattedNumber = String(idx + 1).padStart(2, "0");
            const isFeatured = idx === 0;

            return (
              <div
                key={project.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 items-center py-7 sm:py-9 transition-colors group"
              >
                {/* Column 1: Number + Category + Divider */}
                <div className="lg:col-span-2 xl:col-span-2 flex items-center justify-between lg:pr-6">
                  <div className="space-y-2">
                    <span className="font-heading font-extrabold text-5xl sm:text-6xl lg:text-[72px] text-[#F06419] leading-none block group-hover:text-[#FF762F] transition-colors">
                      {formattedNumber}
                    </span>
                    <span className="block font-mono text-[11px] sm:text-xs uppercase tracking-wider text-[#898D94] font-semibold">
                      {project.category}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="w-px h-16 bg-[#444444] hidden lg:block shrink-0"
                  />
                </div>

                {/* Column 2: Title & Description + Divider */}
                <div className="lg:col-span-4 xl:col-span-4 flex items-center justify-between lg:px-6">
                  <div className="space-y-1.5 min-w-0 pr-6">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl lg:text-[23px] text-[#F5F2EC] tracking-tight leading-snug group-hover:text-[#F06419] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#B8B9BC] leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="w-px h-16 bg-[#444444] hidden lg:block shrink-0"
                  />
                </div>

                {/* Column 3: Capability Tags (2x2 grid) + Divider */}
                <div className="lg:col-span-3 xl:col-span-3 flex items-center justify-between lg:pl-6 lg:pr-0">
                  <div className="grid grid-cols-2 gap-2 flex-1 pr-6">
                    {project.capabilities.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center justify-center px-2 py-1.5 rounded-full border border-[#444444] text-[10px] xl:text-[11px] font-mono uppercase tracking-wide text-[#B8B9BC] text-center whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span
                    aria-hidden="true"
                    className="w-px h-16 bg-[#444444] hidden lg:block shrink-0"
                  />
                </div>

                {/* Column 4: Status Badge & Explore Action */}
                <div className="lg:col-span-3 xl:col-span-3 flex flex-col items-start justify-center space-y-3 lg:pl-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider ${getStatusBadgeClass(
                      project.status
                    )}`}
                  >
                    {project.statusLabel}
                  </span>

                  <Link
                    href={project.detailRoute}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all w-full sm:w-auto min-w-[170px] shadow-sm ${
                      isFeatured
                        ? "bg-[#F06419] text-[#171717] font-bold hover:bg-[#E05308]"
                        : "border border-[#444444] text-[#F5F2EC] font-semibold hover:border-[#F06419] hover:text-[#F06419] hover:bg-[#F06419]/10"
                    }`}
                  >
                    <span>Explore Blueprint</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Horizontal Divider Below Projects */}
        <div className="h-px bg-[#444444] w-full" />

        {/* Bottom Archive Navigation Signature */}
        <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.18em] text-[#898D94] font-semibold">
            {BLUEPRINTS_SECTION_DATA.signatureLeft}
          </span>

          <Link
            href="/work"
            className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.18em] text-[#F06419] font-bold hover:text-[#FF762F] transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>{BLUEPRINTS_SECTION_DATA.signatureRight}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
