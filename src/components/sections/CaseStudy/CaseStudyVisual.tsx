"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Database,
  FileText,
  Layers,
  UserCheck,
  Workflow,
} from "lucide-react";
import type { ProjectItem } from "@/types";
import { cn } from "@/lib/utils";

function NexusArchitectureShowcase() {
  return (
    <div className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden bg-[#0C0D0F] px-6 py-10 sm:min-h-[360px] sm:px-10 sm:py-12">
      {/* Subtle dot-matrix backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(245, 242, 236, 0.14) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Curved Orange SVG Connector Lines (Desktop) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 900 320"
        fill="none"
        className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
        preserveAspectRatio="none"
      >
        <defs>
          <marker
            id="orange-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#F06419" />
          </marker>
        </defs>

        {/* Top-left to center */}
        <path
          d="M 275 78 C 335 78, 330 142, 378 142"
          stroke="#F06419"
          strokeWidth="1.75"
          markerEnd="url(#orange-arrow)"
        />
        {/* Bottom-left to center */}
        <path
          d="M 275 242 C 335 242, 330 178, 378 178"
          stroke="#F06419"
          strokeWidth="1.75"
          markerEnd="url(#orange-arrow)"
        />
        {/* Top-right to center */}
        <path
          d="M 625 78 C 565 78, 570 142, 522 142"
          stroke="#F06419"
          strokeWidth="1.75"
          markerEnd="url(#orange-arrow)"
        />
        {/* Center to bottom-right */}
        <path
          d="M 522 178 C 570 178, 565 242, 625 242"
          stroke="#F06419"
          strokeWidth="1.75"
          markerEnd="url(#orange-arrow)"
        />
      </svg>

      {/* 3-Column Agent Flow */}
      <div className="relative z-10 grid w-full max-w-[920px] grid-cols-1 items-center gap-6 md:grid-cols-3 md:gap-8">
        {/* Left Nodes */}
        <div className="space-y-8">
          <div className="flex items-center gap-3.5 rounded-2xl border border-[#343940] bg-[#14171C]/95 px-5 py-4">
            <FileText
              className="h-6 w-6 shrink-0 text-[#F5F2EC]"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="text-sm font-medium leading-snug text-[#F5F2EC]">
              Document
              <br />
              Extraction Agent
            </span>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-[#343940] bg-[#14171C]/95 px-5 py-4">
            <Database
              className="h-6 w-6 shrink-0 text-[#F5F2EC]"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="text-sm font-medium leading-snug text-[#F5F2EC]">
              Data Reconciliation
              <br />
              Agent
            </span>
          </div>
        </div>

        {/* Center Orchestrator Circle */}
        <div className="flex items-center justify-center">
          <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-2 border-[#F06419] bg-[#12151A] p-4 text-center shadow-[0_0_50px_rgba(240,100,25,0.28)] sm:h-44 sm:w-44">
            <Layers
              className="h-7 w-7 text-[#F5F2EC]"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="mt-2.5 text-[15px] font-semibold leading-tight text-[#F5F2EC]">
              Orchestrator
              <br />
              Agent
            </span>
          </div>
        </div>

        {/* Right Nodes */}
        <div className="space-y-8">
          <div className="flex items-center gap-3.5 rounded-2xl border border-[#343940] bg-[#14171C]/95 px-5 py-4">
            <Workflow
              className="h-6 w-6 shrink-0 text-[#F5F2EC]"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="text-sm font-medium leading-snug text-[#F5F2EC]">
              Workflow
              <br />
              Automation Agent
            </span>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-[#343940] bg-[#14171C]/95 px-5 py-4">
            <UserCheck
              className="h-6 w-6 shrink-0 text-[#F5F2EC]"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="text-sm font-medium leading-snug text-[#F5F2EC]">
              Human-in-the-Loop
              <br />
              Review
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CaseStudyVisual({ project }: { project: ProjectItem }) {
  const mediaItems = [
    {
      id: "cover",
      src: project.coverImage,
      alt: project.coverAlt || project.title,
    },
    ...(project.gallery ?? []),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const current = mediaItems[activeIndex] ?? mediaItems[0];
  const showNexusDiagram =
    project.slug === "nexus-automations-os" && activeIndex === 0;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-[#292E35] bg-[#0C0D0F] shadow-xl">
        {showNexusDiagram ? (
          <NexusArchitectureShowcase />
        ) : (
          <div className="relative aspect-[16/9] w-full bg-[#08090B]">
            <Image
              src={current.src}
              alt={current.alt}
              width={1280}
              height={720}
              className="h-full w-full object-cover"
              priority={activeIndex === 0}
            />
            {project.isConcept && (
              <span className="absolute bottom-3 right-3 rounded border border-[#D9B875]/40 bg-[#0C0D0F]/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#D9B875]">
                Concept Architecture Preview
              </span>
            )}
          </div>
        )}
      </div>

      {mediaItems.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {mediaItems.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative h-16 w-28 shrink-0 cursor-pointer overflow-hidden rounded border transition-colors",
                idx === activeIndex
                  ? "border-[#F06419]"
                  : "border-[#CFC5B9] opacity-75 hover:opacity-100",
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={160}
                height={90}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
