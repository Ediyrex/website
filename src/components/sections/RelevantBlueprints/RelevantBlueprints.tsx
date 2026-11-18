"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Play,
  CheckCircle2,
  Hexagon,
  Calendar,
  Mic,
  Phone,
  Filter,
} from "lucide-react";
import {
  BLUEPRINTS_SECTION_DATA,
  BLUEPRINT_PROJECTS,
  type BlueprintProject,
  type BlueprintStatus,
} from "./blueprints.data";
import { VocalisVisualShowcase } from "./VocalisVisualShowcase";
import { ProjectThumbnail } from "./ProjectThumbnail";
import { SystemFlowModal } from "./SystemFlowModal";

export interface RelevantBlueprintsProps {
  division?: string;
  contextType?: "division" | "industry" | "sector" | "all";
  contextId?: string;
  featuredProjectId?: string;
  displayLimit?: number;
  showFeaturedProject?: boolean;
  showRelatedProjects?: boolean;
  showArchiveLink?: boolean;
}

function getStatusBadge(status: BlueprintStatus, statusLabel: string) {
  switch (status) {
    case "shipped":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#56C58B]/70 bg-[#56C58B]/10 text-[#56C58B] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-3 h-3" />
          <span>{statusLabel}</span>
        </span>
      );
    case "in-progress":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#68A9FF]/70 bg-[#68A9FF]/10 text-[#68A9FF] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider">
          <Hexagon className="w-3 h-3" />
          <span>{statusLabel}</span>
        </span>
      );
    case "rnd":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#B993F2]/70 bg-[#B993F2]/10 text-[#B993F2] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider">
          <Hexagon className="w-3 h-3" />
          <span>{statusLabel}</span>
        </span>
      );
    case "concept":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D9B875]/70 bg-[#D9B875]/10 text-[#D9B875] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider">
          <Hexagon className="w-3 h-3" />
          <span>{statusLabel}</span>
        </span>
      );
  }
}

function getCapabilityIcon(tag: string) {
  const upper = tag.toUpperCase();
  if (upper.includes("VOICE") || upper.includes("AUDIO")) {
    return <Mic className="w-3 h-3 text-[#F06419]" />;
  }
  if (upper.includes("SCHEDULING") || upper.includes("CALENDAR")) {
    return <Calendar className="w-3 h-3 text-[#F06419]" />;
  }
  if (upper.includes("CALL") || upper.includes("PHONE")) {
    return <Phone className="w-3 h-3 text-[#F06419]" />;
  }
  if (upper.includes("LEAD") || upper.includes("CAPTURE")) {
    return <Filter className="w-3 h-3 text-[#F06419]" />;
  }
  return null;
}

export function RelevantBlueprints({
  division = "all",
  contextType,
  contextId,
  featuredProjectId,
  displayLimit = 3,
  showFeaturedProject = true,
  showRelatedProjects = true,
  showArchiveLink = true,
}: RelevantBlueprintsProps) {
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);

  // Filter projects relevant to the current division / context
  const filteredProjects = BLUEPRINT_PROJECTS.filter((p) => {
    if (contextType === "industry" && contextId) {
      return p.industryIds.includes(contextId);
    }
    if (division === "all" || division === "industries") {
      return true;
    }
    return p.divisionIds.includes(division);
  });

  // Select the featured project: either explicit ID or first featured/matching item
  const selectedFeatured =
    (featuredProjectId
      ? filteredProjects.find((p) => p.id === featuredProjectId)
      : null) ??
    filteredProjects.find((p) => p.featured) ??
    filteredProjects[0];

  // Exclude the featured project from related list
  const relatedProjects = selectedFeatured
    ? filteredProjects
        .filter((p) => p.id !== selectedFeatured.id)
        .slice(0, Math.max(1, displayLimit - 1))
    : filteredProjects.slice(1, displayLimit);

  // If no projects found at all, show editorial empty state
  if (!selectedFeatured && relatedProjects.length === 0) {
    return (
      <section
        aria-label="Selected Work &amp; Project Showcase"
        className="relative w-full bg-[#0C0D0F] text-[#F5F2EC] py-16 sm:py-20 lg:py-24 border-b border-[#252A32]"
      >
        <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8">
          <div className="space-y-4 py-8">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F5F2EC]">
              The next project starts here.
            </h2>
            <p className="text-base sm:text-lg text-[#B8B9BC] leading-relaxed max-w-2xl">
              We&apos;re continuing to explore and build across this discipline. Talk to EDYREX about your next project.
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

  const relatedRangeStart = "02";
  const relatedRangeEnd = String(1 + relatedProjects.length).padStart(2, "0");

  return (
    <section
      id="selected-work-showcase"
      aria-label="Selected Work &amp; Project Showcase"
      className="relative w-full bg-[#0C0D0F] text-[#F5F2EC] py-16 sm:py-20 lg:py-24 border-b border-[#252A32] scroll-mt-20"
    >
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8 sm:space-y-10">
        {/* Main Editorial Headline & Description */}
        <div className="space-y-4 pt-1 sm:pt-2">
          <h2 className="font-heading font-extrabold text-[clamp(2.4rem,4.5vw,4.25rem)] leading-[0.98] tracking-[-0.035em] text-[#F5F2EC] text-balance">
            <span>{BLUEPRINTS_SECTION_DATA.headlineLine1} </span>
            <span className="text-[#F06419] font-extrabold">
              {BLUEPRINTS_SECTION_DATA.headlineLine2}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#B8B9BC] leading-relaxed max-w-4xl">
            {BLUEPRINTS_SECTION_DATA.description}
          </p>
        </div>

        {/* Level 01: Featured Blueprint Showcase Card with Radiant Ambient Glow */}
        {showFeaturedProject && selectedFeatured && (
          <div className="relative rounded-[18px] sm:rounded-[22px] bg-gradient-to-b from-[#F06419]/[0.15] via-[#14161A] to-[#101215] border border-[#F06419]/80 p-6 sm:p-8 lg:p-10 shadow-[0_0_70px_-10px_rgba(240,100,25,0.32),0_0_120px_-20px_rgba(240,100,25,0.18)] overflow-hidden">
            {/* Luminous Top Edge Shine Streak */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFA266] to-transparent opacity-100"
            />

            {/* Upper Radiant Ambient Glow Flare */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[850px] h-[280px] rounded-full bg-[radial-gradient(ellipse_at_top,_rgba(240,100,25,0.32)_0%,_rgba(240,100,25,0.12)_45%,_rgba(0,0,0,0)_75%)] blur-3xl pointer-events-none -z-0"
            />

            {/* Top Bar of Featured Card */}
            <div className="relative z-10 flex items-center justify-between border-b border-[#252A32] pb-5 sm:pb-6 mb-7 sm:mb-8">
              <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.16em] text-[#D9B875] font-bold">
                {BLUEPRINTS_SECTION_DATA.featuredLabel}
              </span>

              {/* Classification Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D9B875]/70 bg-[#D9B875]/10 text-[#D9B875] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider">
                <Hexagon className="w-3.5 h-3.5" />
                <span>{selectedFeatured.classificationLabel}</span>
              </span>
            </div>

            {/* 2-Column Grid: Left Project Identity + Right Visual Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column (50%): Identity, Tags, Metadata & Actions */}
              <div className="lg:col-span-6 xl:col-span-6 space-y-6 sm:space-y-7">
                {/* Project Identifier + Category + Title */}
                <div className="flex items-start gap-4 sm:gap-5">
                  <span className="font-heading font-extrabold text-5xl sm:text-6xl lg:text-[72px] text-[#F06419] leading-none shrink-0">
                    01
                  </span>
                  <div className="space-y-1.5 min-w-0">
                    <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#D9B875] font-semibold">
                      {selectedFeatured.category}
                    </span>
                    <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[32px] text-[#F5F2EC] tracking-tight leading-tight">
                      {selectedFeatured.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-[15px] text-[#B8B9BC] leading-relaxed">
                  {selectedFeatured.description}
                </p>

                {/* Capability Tags with Icons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedFeatured.capabilities.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#444444] bg-[#0E1012] text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#F5F2EC]"
                    >
                      {getCapabilityIcon(tag)}
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                {/* Three-Column Metadata Strip */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#252A32]">
                  {/* Industry */}
                  <div className="space-y-0.5">
                    <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#898D94] font-semibold">
                      INDUSTRY
                    </span>
                    <span className="block font-heading text-xs sm:text-[13px] text-[#F5F2EC] font-medium">
                      {selectedFeatured.industryLabel}
                    </span>
                  </div>

                  {/* Division */}
                  <div className="space-y-0.5 border-l border-[#252A32] pl-3">
                    <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#898D94] font-semibold">
                      DIVISION
                    </span>
                    <span className="block font-heading text-xs sm:text-[13px] text-[#F5F2EC] font-medium">
                      {selectedFeatured.divisionLabel}
                    </span>
                  </div>

                  {/* Type */}
                  <div className="space-y-0.5 border-l border-[#252A32] pl-3">
                    <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#898D94] font-semibold">
                      TYPE
                    </span>
                    <span className="block font-heading text-xs sm:text-[13px] text-[#F5F2EC] font-medium">
                      {selectedFeatured.typeLabel}
                    </span>
                  </div>
                </div>

                {/* Featured Project CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <Link
                    href={selectedFeatured.detailRoute}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F06419] text-[#171717] font-bold text-xs sm:text-[13px] uppercase font-mono tracking-wide hover:bg-[#E05308] transition-colors shadow-sm"
                  >
                    <span>Explore Project</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </Link>

                  {selectedFeatured.systemFlowAvailable && (
                    <button
                      type="button"
                      onClick={() => setIsFlowModalOpen(true)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#444444] text-[#F5F2EC] font-semibold text-xs sm:text-[13px] uppercase font-mono tracking-wide hover:border-[#F06419] hover:text-[#F06419] hover:bg-[#F06419]/10 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>See System Flow</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column (50%): Visual Showcase Preview */}
              <div className="lg:col-span-6 xl:col-span-6">
                {selectedFeatured.previewVariant === "vocalis" ? (
                  <VocalisVisualShowcase />
                ) : (
                  <div className="relative w-full h-[360px] sm:h-[420px] rounded-[16px] bg-[#0E1013] border border-[#2B2F38] flex items-center justify-center p-6">
                    <ProjectThumbnail
                      variant={selectedFeatured.previewVariant}
                      title={selectedFeatured.title}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Level 02: Related Projects Index */}
        {showRelatedProjects && relatedProjects.length > 0 && (
          <div className="space-y-4 pt-6 sm:pt-8">
            {/* Sub-header Bar */}
            <div className="flex items-center justify-between border-b border-[#252A32] pb-3">
              <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.16em] text-[#D9B875] font-bold shrink-0">
                {BLUEPRINTS_SECTION_DATA.relatedLabel}
              </span>
              <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.18em] text-[#898D94] shrink-0">
                {relatedRangeStart} — {relatedRangeEnd}
              </span>
            </div>

            {/* Compact Editorial Project Rows (4-Column Layout) */}
            <div className="divide-y divide-[#252A32]">
              {relatedProjects.map((project, idx) => {
                const rowNumber = String(idx + 2).padStart(2, "0");

                return (
                  <div
                    key={project.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center py-7 sm:py-8 transition-all duration-200 group rounded-xl px-2 -mx-2 hover:bg-[#F06419]/[0.02]"
                  >
                    {/* Column 1: Project Preview Thumbnail (~22%) */}
                    <div className="lg:col-span-3 xl:col-span-3">
                      <Link
                        href={project.detailRoute}
                        className="block rounded-[12px] overflow-hidden"
                      >
                        <ProjectThumbnail
                          variant={project.previewVariant}
                          title={project.title}
                        />
                      </Link>
                    </div>

                    {/* Column 2: Number, Category, Title & Description (~43%) */}
                    <div className="lg:col-span-5 xl:col-span-5 flex items-center justify-between lg:px-4">
                      <div className="flex items-start gap-4">
                        <span className="font-heading font-extrabold text-4xl sm:text-5xl text-[#F06419] leading-none shrink-0 group-hover:text-[#FF762F] transition-colors">
                          {rowNumber}
                        </span>
                        <div className="space-y-1.5 min-w-0 pr-2">
                          <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#D9B875] font-semibold">
                            {project.category}
                          </span>
                          <Link href={project.detailRoute}>
                            <h4 className="font-heading font-bold text-lg sm:text-xl text-[#F5F2EC] tracking-tight leading-snug group-hover:text-[#F06419] transition-colors">
                              {project.title}
                            </h4>
                          </Link>
                          <p className="text-xs sm:text-sm text-[#B8B9BC] leading-relaxed line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                      </div>
                      <span
                        aria-hidden="true"
                        className="w-px h-16 bg-[#252A32] hidden lg:block shrink-0 mx-2"
                      />
                    </div>

                    {/* Column 3: Status Badge + 2x2 Capability Tags (~29%) */}
                    <div className="lg:col-span-3 xl:col-span-3 flex flex-col justify-center space-y-3 lg:pl-3">
                      <div>{getStatusBadge(project.status, project.statusLabel)}</div>

                      <div className="grid grid-cols-2 gap-1.5">
                        {project.capabilities.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center justify-center px-2 py-1 rounded-full border border-[#333842] text-[10px] font-mono uppercase tracking-wider text-[#B8B9BC] text-center whitespace-nowrap bg-[#0E1012]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Column 4: Directional Arrow Action (~6%) */}
                    <div className="lg:col-span-1 xl:col-span-1 flex items-center justify-start lg:justify-end">
                      <Link
                        href={project.detailRoute}
                        aria-label={`Explore ${project.title}`}
                        className="w-10 h-10 rounded-full border border-[#333842] flex items-center justify-center text-[#F06419] group-hover:border-[#F06419] group-hover:text-[#FF762F] group-hover:bg-[#F06419]/10 group-hover:shadow-[0_0_18px_rgba(240,100,25,0.45)] transition-all shrink-0"
                      >
                        <ArrowUpRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Level 03: Bottom Archive Navigation Signature */}
        {showArchiveLink && (
          <div className="pt-4 border-t border-[#252A32] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        )}
      </div>

      {/* Interactive System Flow Modal for Vocalis Architecture */}
      {selectedFeatured && (
        <SystemFlowModal
          isOpen={isFlowModalOpen}
          onClose={() => setIsFlowModalOpen(false)}
          projectTitle={selectedFeatured.title}
        />
      )}
    </section>
  );
}
