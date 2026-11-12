import { PROJECTS_DATA } from "@/features/work/data";
import type { ProjectItem, ServiceDivision } from "@/types";

export type WorkDivisionFilter =
  | "all"
  | ServiceDivision
  | "hybrid"
  | "explorations";

export type WorkProjectStatus = "SHIPPED" | "IN PROGRESS" | "CONCEPT" | "R&D";

export interface EnrichedProject extends ProjectItem {
  number: string;
  divisionLabel: string;
  statusLabel: WorkProjectStatus;
  projectTypeLabel: string;
}

const DIVISION_LABELS: Record<string, string> = {
  branding: "Branding & Marketing",
  media: "Media & Production",
  digital: "Web, Apps & Digital Products",
  ai: "AI & Automation",
  hybrid: "AI & Automation / Hybrid",
};

const PROJECT_META_BY_SLUG: Record<
  string,
  { status: WorkProjectStatus; projectType: string }
> = {
  "nexus-automations-os": {
    status: "CONCEPT",
    projectType: "Multi-Agent Operations Blueprint",
  },
  "lumina-cinematic-campaign": {
    status: "CONCEPT",
    projectType: "Brand Identity & Motion System",
  },
  "strata-cloud-dashboard": {
    status: "CONCEPT",
    projectType: "SaaS Telemetry Interface",
  },
  "vocalis-voice-receptionist": {
    status: "R&D",
    projectType: "Voice AI Prototype",
  },
};

export function enrichProjects(
  items: readonly ProjectItem[],
): EnrichedProject[] {
  return items
    .filter((p) => p.isPublished)
    .map((project, index) => {
      const meta = PROJECT_META_BY_SLUG[project.slug];
      const statusLabel: WorkProjectStatus =
        project.workStatus === "shipped"
          ? "SHIPPED"
          : project.workStatus === "in-progress"
            ? "IN PROGRESS"
            : project.workStatus === "rnd"
              ? "R&D"
              : meta?.status ?? (project.isConcept ? "CONCEPT" : "SHIPPED");

      return {
        ...project,
        number: String(index + 1).padStart(3, "0"),
        divisionLabel:
          DIVISION_LABELS[project.category] ?? project.category.toUpperCase(),
        statusLabel,
        projectTypeLabel:
          project.classification ??
          meta?.projectType ??
          (project.isConcept ? "Studio Concept" : "Client Case Study"),
      };
    });
}

export const PUBLISHED_PROJECTS: readonly EnrichedProject[] =
  enrichProjects(PROJECTS_DATA);

export interface FilterOption {
  value: WorkDivisionFilter;
  label: string;
  count: number;
}

export function getWorkFilterOptions(
  projectsList: readonly EnrichedProject[] = PUBLISHED_PROJECTS,
): FilterOption[] {
  const all = projectsList;
  const countBy = (fn: (p: EnrichedProject) => boolean) =>
    all.filter(fn).length;

  return [
    { value: "all", label: "All Work", count: all.length },
    {
      value: "branding",
      label: "Branding & Marketing",
      count: countBy((p) => p.category === "branding"),
    },
    {
      value: "media",
      label: "Media & Production",
      count: countBy((p) => p.category === "media"),
    },
    {
      value: "digital",
      label: "Web, Apps & Digital",
      count: countBy((p) => p.category === "digital"),
    },
    {
      value: "ai",
      label: "AI & Automation",
      count: countBy((p) => p.category === "ai" || p.category === "hybrid"),
    },
    {
      value: "explorations",
      label: "Studio Explorations",
      count: countBy((p) => p.isConcept),
    },
  ];
}

