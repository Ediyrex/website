export type VendorIconKey = "play" | "code" | "cpu" | "pen" | "layers";
export type PillarIconKey = "play" | "code" | "sparkles";
export type DimensionIconKey = "layers" | "users" | "eye" | "code" | "zap";

export interface FragmentedVendor {
  id: string;
  label: string;
  icon: VendorIconKey;
  rotationDeg: number;
  offsetClass: string;
}

export interface StudioPillar {
  id: string;
  label: string;
  icon: PillarIconKey;
  tiltClass: string;
}

export interface ComparisonDimension {
  id: string;
  index: string;
  title: string;
  icon: DimensionIconKey;
  ediyrex: string;
  traditional: string;
  featured?: boolean;
}

export const FRAGMENTED_VENDORS: readonly FragmentedVendor[] = [
  {
    id: "media-agency",
    label: "Media Agency",
    icon: "play",
    rotationDeg: -7,
    offsetClass: "md:-translate-y-2",
  },
  {
    id: "web-agency",
    label: "Web Agency",
    icon: "code",
    rotationDeg: 3,
    offsetClass: "md:-translate-y-5",
  },
  {
    id: "ai-vendor",
    label: "AI Vendor",
    icon: "cpu",
    rotationDeg: 7,
    offsetClass: "md:translate-y-0",
  },
  {
    id: "design-studio",
    label: "Design Studio",
    icon: "pen",
    rotationDeg: -5,
    offsetClass: "md:translate-y-2 md:translate-x-4",
  },
  {
    id: "dev-partner",
    label: "Development Partner",
    icon: "layers",
    rotationDeg: 4,
    offsetClass: "md:translate-y-1 md:-translate-x-2",
  },
];

export const STUDIO_PILLARS: readonly StudioPillar[] = [
  {
    id: "pillar-media",
    label: "Media",
    icon: "play",
    tiltClass: "md:[transform:perspective(800px)_rotateY(6deg)_translateZ(8px)]",
  },
  {
    id: "pillar-digital",
    label: "Digital",
    icon: "code",
    tiltClass: "md:[transform:perspective(800px)_translateZ(14px)]",
  },
  {
    id: "pillar-ai",
    label: "AI",
    icon: "sparkles",
    tiltClass: "md:[transform:perspective(800px)_rotateY(-6deg)_translateZ(8px)]",
  },
];

export const COMPARISON_DIMENSIONS: readonly ComparisonDimension[] = [
  {
    id: "disciplines",
    index: "01",
    title: "Disciplines",
    icon: "layers",
    ediyrex: "Media, Digital and AI planned together.",
    traditional: "Siloed video, web and software vendors.",
    featured: true,
  },
  {
    id: "communication",
    index: "02",
    title: "Communication",
    icon: "users",
    ediyrex: "Direct access to engineers and creative leads.",
    traditional: "Multiple account-manager relay layers.",
  },
  {
    id: "transparency",
    index: "03",
    title: "Transparency",
    icon: "eye",
    ediyrex: "Concept explorations honestly labeled and clear scope.",
    traditional: "Inflated projections and vague retainers.",
  },
  {
    id: "architecture",
    index: "04",
    title: "Architecture",
    icon: "code",
    ediyrex: "Clean TypeScript, Next.js and PostgreSQL ownership.",
    traditional: "Bloated templates and rigid plugin lock-in.",
  },
  {
    id: "ai-capability",
    index: "05",
    title: "AI Capability",
    icon: "zap",
    ediyrex: "Practical agents, voice reception and RAG integrated.",
    traditional: "Surface-level chatbots bolted on afterwards.",
  },
];
