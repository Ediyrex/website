import { PROJECTS_DATA } from "@/features/work/data";
import { HYBRID_PRODUCTS_DATA } from "@/features/products/data";
import type { ProjectItem } from "@/types";

export type WorkFilterKey =
  | "all"
  | "ai-agents"
  | "brand-identity"
  | "media-video"
  | "platforms-tools"
  | "automation";

export interface WorkFilterOption {
  key: WorkFilterKey;
  label: string;
}

export const WORK_FILTER_OPTIONS: readonly WorkFilterOption[] = [
  { key: "all", label: "All Work" },
  { key: "ai-agents", label: "AI & Agents" },
  { key: "brand-identity", label: "Brand & Identity" },
  { key: "media-video", label: "Media & Video" },
  { key: "platforms-tools", label: "Platforms & Tools" },
  { key: "automation", label: "Automation" },
];

export type ProjectPreviewVariant = "lumina" | "strata" | "vocalis";

export interface SelectedWorkProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  previewVariant?: ProjectPreviewVariant;
  tags: readonly string[];
  caseStudyUrl: string;
  featured: boolean;
  isPublished: boolean;
  filterCategories: readonly WorkFilterKey[];
}

const SELECTED_WORK_OVERRIDES: Record<
  string,
  Pick<
    SelectedWorkProject,
    | "category"
    | "description"
    | "tags"
    | "previewVariant"
    | "filterCategories"
    | "featured"
  >
> = {
  "nexus-automations-os": {
    category: "FEATURED CASE STUDY",
    description:
      "A multi-agent system that automates operation workflows, research, and execution across tools.",
    tags: ["AI Agents", "Workflow Automation", "Ops Systems"],
    filterCategories: ["all", "ai-agents", "automation", "platforms-tools"],
    featured: true,
  },
  "lumina-cinematic-campaign": {
    category: "BRAND & MEDIA",
    description:
      "A full brand system with motion, visuals and storytelling for a modern creative brand.",
    tags: ["Brand Identity", "Motion Design", "Video"],
    previewVariant: "lumina",
    filterCategories: ["all", "brand-identity", "media-video"],
    featured: false,
  },
  "strata-cloud-dashboard": {
    category: "PLATFORM",
    description:
      "A unified analytics platform for monitoring, insights and performance across distributed systems.",
    tags: ["Data Platform", "Observability", "Dashboards"],
    previewVariant: "strata",
    filterCategories: ["all", "platforms-tools"],
    featured: false,
  },
  "vocalis-voice-receptionist": {
    category: "AI & VOICE",
    description:
      "A low-latency, natural voice agent for customer support, booking and lead capture.",
    tags: ["Voice AI", "Call Automation", "Multi-Agent"],
    previewVariant: "vocalis",
    filterCategories: ["all", "ai-agents", "automation"],
    featured: false,
  },
};

export const SELECTED_WORK_PROJECTS: readonly SelectedWorkProject[] =
  PROJECTS_DATA.filter((project) => project.isPublished).map((project) => {
    const override = SELECTED_WORK_OVERRIDES[project.slug];
    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      category: override?.category ?? project.category.toUpperCase(),
      description: override?.description ?? project.summary,
      thumbnail: project.coverImage,
      previewVariant: override?.previewVariant,
      tags: override?.tags ?? project.servicesDemonstrated.slice(0, 3),
      caseStudyUrl: `/work/${project.slug}`,
      featured: override ? override.featured : project.featured,
      isPublished: project.isPublished,
      filterCategories: override?.filterCategories ?? ["all"],
    };
  });

function inferFilterCategories(project: ProjectItem): readonly WorkFilterKey[] {
  const cats = new Set<WorkFilterKey>(["all"]);
  const cat = (project.category || "").toLowerCase();
  const searchStr = `${project.title} ${project.summary || ""} ${project.description || ""} ${(project.servicesDemonstrated || []).join(" ")}`.toLowerCase();

  if (
    cat === "ai" ||
    searchStr.includes("ai") ||
    searchStr.includes("agent") ||
    searchStr.includes("voice")
  ) {
    cats.add("ai-agents");
  }
  if (
    cat === "branding" ||
    searchStr.includes("brand") ||
    searchStr.includes("identity") ||
    searchStr.includes("packaging")
  ) {
    cats.add("brand-identity");
  }
  if (
    cat === "media" ||
    searchStr.includes("video") ||
    searchStr.includes("motion") ||
    searchStr.includes("cinematic") ||
    searchStr.includes("film")
  ) {
    cats.add("media-video");
  }
  if (
    cat === "digital" ||
    searchStr.includes("dashboard") ||
    searchStr.includes("platform") ||
    searchStr.includes("web") ||
    searchStr.includes("dadv") ||
    searchStr.includes("telemetry") ||
    searchStr.includes("app")
  ) {
    cats.add("platforms-tools");
  }
  if (
    searchStr.includes("automation") ||
    searchStr.includes("n8n") ||
    searchStr.includes("workflow") ||
    searchStr.includes("ops")
  ) {
    cats.add("automation");
  }

  if (cats.size === 1) {
    if (cat === "branding") cats.add("brand-identity");
    else if (cat === "media") cats.add("media-video");
    else if (cat === "digital") cats.add("platforms-tools");
    else if (cat === "ai") cats.add("ai-agents");
    else cats.add("platforms-tools");
  }

  return Array.from(cats);
}

export function mapToSelectedWorkProjects(
  items?: ProjectItem[]
): readonly SelectedWorkProject[] {
  if (!items || items.length === 0) {
    return SELECTED_WORK_PROJECTS;
  }

  return items.map((project, idx) => {
    const override = SELECTED_WORK_OVERRIDES[project.slug];
    const tags =
      override?.tags ??
      (project.servicesDemonstrated && project.servicesDemonstrated.length > 0
        ? project.servicesDemonstrated.slice(0, 3)
        : project.techStack && project.techStack.length > 0
          ? project.techStack.slice(0, 3)
          : ["Studio Project"]);

    const previewVariant: ProjectPreviewVariant | undefined =
      override?.previewVariant ??
      (project.slug.includes("lumina")
        ? "lumina"
        : project.slug.includes("strata")
          ? "strata"
          : project.slug.includes("voice")
            ? "vocalis"
            : (["lumina", "strata", "vocalis"] as const)[idx % 3]);

    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      category:
        override?.category ??
        (project.featured
          ? "FEATURED CASE STUDY"
          : project.category
            ? project.category.toUpperCase()
            : "PROJECT"),
      description:
        override?.description ??
        project.summary ??
        project.description ??
        "",
      thumbnail:
        project.coverImage || "/images/projects/concept-digital-strata.svg",
      previewVariant,
      tags,
      caseStudyUrl: `/work/${project.slug}`,
      featured: override ? override.featured : (project.featured ?? false),
      isPublished: project.isPublished ?? true,
      filterCategories:
        override?.filterCategories ?? inferFilterCategories(project),
    };
  });
}

export interface StudioImpactStat {
  id: string;
  target: number;
  suffix: string;
  label: string;
}

export const IMPACT_STATISTICS: readonly StudioImpactStat[] = [
  {
    id: "projects-shaped",
    target: 20,
    suffix: "+",
    label: "Projects Shaped",
  },
  {
    id: "clients-partners",
    target: 10,
    suffix: "+",
    label: "Clients & Partners",
  },
  {
    id: "product-experiments",
    target: 6,
    suffix: "+",
    label: "Product Experiments",
  },
  {
    id: "active-products",
    target: HYBRID_PRODUCTS_DATA.length,
    suffix: "",
    label: "Active Studio Products",
  },
];

