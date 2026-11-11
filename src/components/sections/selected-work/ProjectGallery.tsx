"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import type { SelectedWorkProject } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

interface ProjectGalleryProps {
  projects: readonly SelectedWorkProject[];
  hasFeaturedVisible: boolean;
  onResetFilter: () => void;
}

export function ProjectGallery({
  projects,
  hasFeaturedVisible,
  onResetFilter,
}: ProjectGalleryProps) {
  if (projects.length === 0 && !hasFeaturedVisible) {
    return (
      <div className="rounded-[20px] bg-[#FBF8F4] border border-[#DED6CE] p-10 text-center space-y-3">
        <p className="text-[16px] font-semibold text-[#111111]">
          No projects match this category yet.
        </p>
        <p className="text-[14px] text-[#55514D]">
          Explore all work to see our full portfolio across disciplines.
        </p>
        <button
          type="button"
          onClick={onResetFilter}
          className="mt-2 inline-flex items-center h-10 px-5 rounded-full border border-[#F36B16] bg-[#F36B16]/[0.08] text-[13.5px] font-semibold text-[#111111] cursor-pointer hover:bg-[#F36B16]/15 transition-colors"
        >
          Show all work
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

