"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { SelectedWorkProject } from "@/data/projects";
import { ProjectPreview } from "./ProjectPreview";

interface ProjectCardProps {
  project: SelectedWorkProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      data-sw-card
      className="h-full"
    >
      <Link
        href={project.caseStudyUrl}
        aria-label={`View case study: ${project.title}`}
        className="group flex flex-col h-full rounded-[20px] bg-[#FBF8F4] border border-[#E2DAD2] shadow-[0_8px_24px_-16px_rgba(17,17,17,0.12)] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#C8BFB6] hover:shadow-[0_18px_36px_-14px_rgba(17,17,17,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36B16]"
      >
        {/* Top Dark Visual Preview */}
        <ProjectPreview variant={project.previewVariant} />

        {/* Ivory Content Body */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div>
            {/* Category Badge + Circular Navigation Arrow */}
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center rounded-full bg-[#F36B16]/[0.1] border border-[#F36B16]/25 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#F36B16]">
                {project.category}
              </span>

              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-full border border-[#DED6CE] flex items-center justify-center text-[#111111] transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:border-[#F36B16] group-hover:text-[#F36B16]"
              >
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </span>
            </div>

            <h3 className="mt-3 text-[clamp(1.22rem,1.45vw,1.4rem)] font-bold text-[#111111] leading-[1.2] tracking-[-0.02em]">
              {project.title}
            </h3>

            <p className="mt-2.5 text-[14px] sm:text-[15px] text-[#55514D] leading-[1.5]">
              {project.description}
            </p>
          </div>

          {/* Supporting Service Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F2ECE5] border border-[#E5DDD5] px-2.5 py-1 text-[11.5px] font-medium text-[#55514D]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

