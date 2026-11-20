"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  Sparkles,
  ArrowUpRight,
  Monitor,
  LayoutGrid,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PreviewProjectData {
  title: string;
  slug: string;
  summary: string;
  description?: string;
  projectType: "client" | "concept" | "internal";
  industry?: string | null;
  clientName?: string | null;
  coverAssetUrl?: string | null;
  servicesDemonstrated?: string[];
  techStack?: string[];
  destination?: string;
  displayOrder?: number;
}

export function PublicPlacementPreviewModal({
  isOpen,
  onClose,
  project,
}: {
  isOpen: boolean;
  onClose: () => void;
  project: PreviewProjectData | null;
}) {
  const [viewMode, setViewMode] = useState<"homepage" | "archive" | "blueprint">("homepage");

  if (!isOpen || !project) return null;

  const isClient = project.projectType === "client";
  const classificationLabel = isClient
    ? "Client Case Study"
    : project.projectType === "internal"
    ? "Internal Studio R&D"
    : "Concept Exploration (Studio R&D)";

  const coverUrl =
    project.coverAssetUrl ||
    "/images/projects/concept-digital-strata.svg";

  const tags =
    project.techStack && project.techStack.length > 0
      ? project.techStack
      : project.servicesDemonstrated && project.servicesDemonstrated.length > 0
      ? project.servicesDemonstrated
      : ["Design Engineering", "Studio Architecture"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#090A0C] border border-[#292E35] shadow-2xl overflow-hidden text-[#F5F2EC]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-[#1E222A] bg-[#0E1013] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-[#F06419]/15 border border-[#F06419]/30 text-[#F06419]">
              <Eye className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-semibold text-xs text-[#F5F2EC]">
                  Public Placement Live Preview
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-[#1C2027] text-[#D9B875] border border-[#292E35]">
                  {project.destination || "Homepage Featured"}
                </span>
              </div>
              <p className="text-[11px] text-[#898D94]">
                Accurate rendering of approved editorial placement on public pages
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center p-0.5 rounded-lg bg-[#161A1F] border border-[#292E35] text-xs">
              <button
                type="button"
                onClick={() => setViewMode("homepage")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors font-mono text-[11px] cursor-pointer",
                  viewMode === "homepage"
                    ? "bg-[#F06419] text-white font-semibold"
                    : "text-[#898D94] hover:text-[#F5F2EC]"
                )}
              >
                Homepage
              </button>
              <button
                type="button"
                onClick={() => setViewMode("archive")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors font-mono text-[11px] cursor-pointer",
                  viewMode === "archive"
                    ? "bg-[#D9B875] text-[#090A0C] font-semibold"
                    : "text-[#898D94] hover:text-[#F5F2EC]"
                )}
              >
                Work Archive
              </button>
              <button
                type="button"
                onClick={() => setViewMode("blueprint")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors font-mono text-[11px] cursor-pointer",
                  viewMode === "blueprint"
                    ? "bg-[#68A9FF] text-[#090A0C] font-semibold"
                    : "text-[#898D94] hover:text-[#F5F2EC]"
                )}
              >
                Division / Blueprint
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#898D94] hover:text-[#F5F2EC] hover:bg-[#161A1F] transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#07080A]">
          {/* Honest Classification Ribbon Notice */}
          <div className="mb-6 px-4 py-2.5 rounded-xl bg-[#121519] border border-[#292E35] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#B8B9BC]">
              {isClient ? (
                <CheckCircle2 className="w-4 h-4 text-[#56C58B]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#D9B875]" />
              )}
              <span>Classification:</span>
              <strong className={isClient ? "text-[#56C58B]" : "text-[#D9B875]"}>
                {classificationLabel}
              </strong>
            </div>
            <span className="font-mono text-[11px] text-[#898D94]">
              Public URL: /work/{project.slug}
            </span>
          </div>

          {/* VIEW MODE 1: HOMEPAGE SELECTED WORK FEATURED CARD */}
          {viewMode === "homepage" && (
            <div className="rounded-2xl border border-[#DED6CE] bg-[#FBF8F4] text-[#111111] p-6 sm:p-8 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-[#F36B16] text-white">
                      Featured Project
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono uppercase border border-[#DED6CE] bg-[#F7F2EC] text-[#55514D]">
                      {classificationLabel}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#111111] leading-tight">
                    {project.title}
                  </h3>

                  <p className="text-sm sm:text-base text-[#55514D] leading-relaxed">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {tags.slice(0, 4).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#EFE9E1] text-[#33312E]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#111111] text-[#F7F2EC] text-xs font-semibold">
                      Explore Case Study
                      <ArrowUpRight className="w-4 h-4 text-[#F36B16]" />
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-[#DED6CE] bg-[#EAE2D8] flex items-center justify-center">
                    <Image
                      src={coverUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: WORK ARCHIVE CARD */}
          {viewMode === "archive" && (
            <div className="max-w-md mx-auto rounded-xl border border-[#292E35] bg-[#121519] overflow-hidden group shadow-xl">
              <div className="relative aspect-16/10 overflow-hidden bg-[#161A1F]">
                <Image
                  src={coverUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="400px"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#F06419] text-white">
                    Featured
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-black/70 text-[#F5F2EC] border border-[#292E35]">
                    {classificationLabel}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#898D94]">
                  <span>{project.industry || "General"}</span>
                  <span className="font-mono">Slot #{project.displayOrder || 1}</span>
                </div>

                <h4 className="font-heading font-bold text-lg text-[#F5F2EC]">
                  {project.title}
                </h4>

                <p className="text-xs text-[#898D94] line-clamp-2">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1E222A]">
                  {tags.slice(0, 3).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#161A1F] border border-[#252A32] text-[10px] text-[#B8B9BC]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 3: DIVISION BLUEPRINT CARD */}
          {viewMode === "blueprint" && (
            <div className="rounded-xl border border-[#292E35] bg-[#121519] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#68A9FF]/15 text-[#68A9FF] border border-[#68A9FF]/30 font-mono text-[10px] uppercase font-bold">
                    Division Showcase Blueprint
                  </span>
                  <span className="text-xs text-[#898D94] font-mono">
                    {project.slug}
                  </span>
                </div>
                <span className="text-xs font-mono text-[#D9B875]">
                  {classificationLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 relative aspect-video md:aspect-square rounded-lg overflow-hidden border border-[#292E35]">
                  <Image
                    src={coverUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <h3 className="font-heading font-bold text-xl text-[#F5F2EC]">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#B8B9BC] leading-relaxed">
                    {project.summary}
                  </p>
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-mono text-[#898D94] uppercase tracking-wider block">
                      Capabilities &amp; Tech Architecture
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((t, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-[#161A1F] border border-[#252A32] text-xs font-mono text-[#D9B875]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#1E222A] bg-[#0E1013] flex items-center justify-between text-xs text-[#898D94] shrink-0">
          <span>
            Target placement: <strong className="text-[#F5F2EC]">{project.destination || "Homepage"}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#161A1F] border border-[#292E35] text-[#F5F2EC] hover:bg-[#1E222A] transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
