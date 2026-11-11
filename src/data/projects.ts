import { PROJECTS_DATA } from "@/features/work/data";
import { HYBRID_PRODUCTS_DATA } from "@/features/products/data";

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

