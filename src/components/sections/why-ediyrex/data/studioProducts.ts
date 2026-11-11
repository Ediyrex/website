import { HYBRID_PRODUCTS_DATA } from "@/features/products/data";

export interface OperatingPrinciple {
  number: string;
  title: string;
  description: string;
}

export const OPERATING_PRINCIPLES: readonly OperatingPrinciple[] = [
  {
    number: "01",
    title: "Connected thinking",
    description: "Creative, digital and AI work together from the beginning.",
  },
  {
    number: "02",
    title: "Purpose before tools",
    description:
      "Every solution starts with the problem, not the technology.",
  },
  {
    number: "03",
    title: "Craft meets function",
    description: "Design quality and practical usability receive equal attention.",
  },
  {
    number: "04",
    title: "Built to evolve",
    description:
      "Everything is engineered for maintenance, iteration and scale.",
  },
];

export type InHouseProductVisual = "energy" | "waveform" | "layers";

export interface InHouseProductItem {
  id: string;
  slug: string;
  name: string;
  status: "BETA" | "ALPHA" | "RESEARCH";
  description: string;
  visual: InHouseProductVisual;
  href: string;
}

const PRODUCT_META: Record<
  string,
  Pick<InHouseProductItem, "name" | "description" | "visual" | "href">
> = {
  "ediyrex-agent-core": {
    name: "AgentCore",
    description:
      "Autonomous multi-agent execution framework with verifiable audit logs.",
    visual: "energy",
    href: "/work/nexus-automations-os",
  },
  "vocalis-voice-runtime": {
    name: "Vocalis",
    description:
      "Ultra-low-latency voice streaming gateway for customer operations.",
    visual: "waveform",
    href: "/work/vocalis-voice-receptionist",
  },
  "renderflow-asset-studio": {
    name: "RenderFlow",
    description:
      "Programmatic short-form video batch generator for high-velocity brands.",
    visual: "layers",
    href: "/work/lumina-cinematic-campaign",
  },
};

export const IN_HOUSE_PRODUCTS: readonly InHouseProductItem[] =
  HYBRID_PRODUCTS_DATA.map((product) => {
    const meta = PRODUCT_META[product.slug];
    return {
      id: product.id,
      slug: product.slug,
      name: meta?.name ?? product.name,
      status: product.status.toUpperCase() as InHouseProductItem["status"],
      description: meta?.description ?? product.tagline,
      visual: meta?.visual ?? "layers",
      href: meta?.href ?? "/services",
    };
  });

