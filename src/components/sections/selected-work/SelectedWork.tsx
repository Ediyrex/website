"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  SELECTED_WORK_PROJECTS,
  WORK_FILTER_OPTIONS,
  type WorkFilterKey,
} from "@/data/projects";
import { WorkHeader } from "./WorkHeader";
import { WorkFilters } from "./WorkFilters";
import { FeaturedCaseStudy } from "./FeaturedCaseStudy";
import { ProjectGallery } from "./ProjectGallery";
import { ImpactStats } from "./ImpactStats";
import { initSelectedWorkAnimations } from "./animations";

export function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<WorkFilterKey>("all");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    return initSelectedWorkAnimations(el);
  }, []);

  const { featuredProject, galleryProjects } = useMemo(() => {
    const matching = SELECTED_WORK_PROJECTS.filter((project) =>
      project.filterCategories.includes(activeFilter)
    );
    const featured = matching.find((project) => project.featured) ?? null;
    const gallery = matching.filter((project) => project !== featured);
    return {
      featuredProject: featured,
      galleryProjects: gallery,
    };
  }, [activeFilter]);

  return (
    <section
      id="work"
      ref={sectionRef}
      style={
        {
          "--sw-bg": "#F7F2EC",
          "--sw-card": "#FBF8F4",
          "--sw-ink": "#111111",
          "--sw-muted": "#55514D",
          "--sw-orange": "#F36B16",
          "--sw-border": "#DED6CE",
        } as React.CSSProperties
      }
      className="w-full bg-[#F7F2EC] text-[#111111] py-14 md:py-20 lg:py-24 border-t border-[#DED6CE]"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 space-y-8 md:space-y-10">
        {/* Block One: Editorial Heading */}
        <WorkHeader />

        {/* Block Two: Project Category Filters */}
        <WorkFilters
          options={WORK_FILTER_OPTIONS}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        {/* Block Three & Four: Featured Case Study + Supporting Project Gallery */}
        <div className="space-y-6">
          {featuredProject && <FeaturedCaseStudy project={featuredProject} />}

          <ProjectGallery
            projects={galleryProjects}
            hasFeaturedVisible={featuredProject !== null}
            onResetFilter={() => setActiveFilter("all")}
          />
        </div>

        {/* Block Five: Impact Statistics */}
        <ImpactStats />
      </div>
    </section>
  );
}

