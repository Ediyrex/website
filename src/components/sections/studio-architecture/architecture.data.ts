import { HYBRID_PRODUCTS_DATA } from "@/features/products/data";

export type WorkflowIconName = "crosshair" | "layers" | "zap" | "rocket";

export interface WorkflowStage {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: WorkflowIconName;
  variant: "glass" | "orange";
  isLaunch?: boolean;
}

export const WORKFLOW_STAGES: readonly WorkflowStage[] = [
  {
    id: "discover",
    number: "01",
    title: "Discover",
    description: "Understand the goals, market and real opportunity.",
    icon: "crosshair",
    variant: "glass",
  },
  {
    id: "craft",
    number: "02",
    title: "Craft",
    description: "Shape the strategy, build the roadmap and align execution.",
    icon: "layers",
    variant: "glass",
  },
  {
    id: "execute",
    number: "03",
    title: "Execute",
    description: "Run across design, development, media and automation.",
    icon: "zap",
    variant: "glass",
  },
  {
    id: "launch",
    number: "04",
    title: "Launch",
    description: "Deliver, optimize and scale what works.",
    icon: "rocket",
    variant: "orange",
    isLaunch: true,
  },
];

export interface StudioProductItem {
  id: string;
  name: string;
  status: "BETA" | "ALPHA" | "RESEARCH";
  icon: "zap" | "waveform" | "layers";
}

const PRODUCT_DISPLAY_NAMES: Record<string, string> = {
  "ediyrex-agent-core": "AgentCore Orchestrator",
  "vocalis-voice-runtime": "Vocalis Voice Runtime",
  "renderflow-asset-studio": "RenderFlow Asset Studio",
};

const PRODUCT_ICONS: Record<string, StudioProductItem["icon"]> = {
  "ediyrex-agent-core": "zap",
  "vocalis-voice-runtime": "waveform",
  "renderflow-asset-studio": "layers",
};

export const STUDIO_PRODUCTS: readonly StudioProductItem[] =
  HYBRID_PRODUCTS_DATA.map((product) => ({
    id: product.id,
    name: PRODUCT_DISPLAY_NAMES[product.slug] ?? product.name,
    status: product.status.toUpperCase() as StudioProductItem["status"],
    icon: PRODUCT_ICONS[product.slug] ?? "layers",
  }));

export interface ArchitectureDivisionItem {
  number: string;
  title: string;
  description: string;
  href: string;
}

export const ARCHITECTURE_DIVISIONS: readonly ArchitectureDivisionItem[] = [
  {
    number: "01",
    title: "Branding & Marketing",
    description:
      "Ads & engagement, packaging, SEO optimization, influencer & email marketing.",
    href: "/services/branding",
  },
  {
    number: "02",
    title: "Media & Video",
    description:
      "Video editing (podcast, short-forms, event videos), motion graphics & design.",
    href: "/services/media",
  },
  {
    number: "03",
    title: "Web Dev",
    description:
      "Web dev, SEO, UI/UX, Chrome/web extensions & DADV analytics dashboards.",
    href: "/services/digital",
  },
  {
    number: "04",
    title: "Agents & Automation",
    description:
      "Chatbots, voice calling agents, autonomous AI agents & n8n automation.",
    href: "/services/ai",
  },
];

