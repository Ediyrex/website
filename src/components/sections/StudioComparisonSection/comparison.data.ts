export type VendorIconKey = "play" | "code" | "cpu" | "pen" | "layers";
export type CapabilityIconKey = "play" | "code" | "sparkles";
export type AdvantageIconKey = "layers" | "users" | "eye" | "code" | "zap";

export interface TraditionalVendor {
  id: string;
  labelLine1: string;
  labelLine2: string;
  icon: VendorIconKey;
}

export interface StudioCapability {
  id: string;
  title: string;
  subtitle: string;
  icon: CapabilityIconKey;
  items: readonly string[];
}

export interface KeyAdvantage {
  id: string;
  index: string;
  title: string;
  icon: AdvantageIconKey;
  ediyrex: string;
  traditional: string;
  featured?: boolean;
}

export const TRADITIONAL_VENDORS: readonly TraditionalVendor[] = [
  {
    id: "media-agency",
    labelLine1: "Media",
    labelLine2: "Agency",
    icon: "play",
  },
  {
    id: "web-agency",
    labelLine1: "Web",
    labelLine2: "Agency",
    icon: "code",
  },
  {
    id: "ai-vendor",
    labelLine1: "AI",
    labelLine2: "Vendor",
    icon: "cpu",
  },
  {
    id: "design-studio",
    labelLine1: "Design",
    labelLine2: "Studio",
    icon: "pen",
  },
  {
    id: "dev-partner",
    labelLine1: "Development",
    labelLine2: "Partner",
    icon: "layers",
  },
];

export const EDIYREX_CAPABILITIES: readonly StudioCapability[] = [
  {
    id: "cap-media",
    title: "Media",
    subtitle: "Story & Production",
    icon: "play",
    items: [
      "Video production",
      "Photography",
      "Motion graphics",
      "Brand storytelling",
      "Social media content",
    ],
  },
  {
    id: "cap-digital",
    title: "Digital",
    subtitle: "Product & Technology",
    icon: "code",
    items: [
      "Website development",
      "SaaS applications",
      "UI/UX design",
      "Digital products",
      "Software engineering",
    ],
  },
  {
    id: "cap-ai",
    title: "AI",
    subtitle: "Intelligence & Automation",
    icon: "sparkles",
    items: [
      "AI agents",
      "Workflow automation",
      "Voice AI",
      "RAG systems",
      "Intelligent integrations",
    ],
  },
];

export const KEY_ADVANTAGES: readonly KeyAdvantage[] = [
  {
    id: "adv-disciplines",
    index: "01",
    title: "Disciplines",
    icon: "layers",
    ediyrex: "Media, Digital and AI planned together.",
    traditional: "Siloed video, web and software vendors.",
    featured: true,
  },
  {
    id: "adv-communication",
    index: "02",
    title: "Communication",
    icon: "users",
    ediyrex: "Direct access to engineers and creative leads.",
    traditional: "Multiple account-manager relay layers.",
  },
  {
    id: "adv-transparency",
    index: "03",
    title: "Transparency",
    icon: "eye",
    ediyrex: "Concept explorations honestly labeled and clear scope.",
    traditional: "Inflated projections and vague retainers.",
  },
  {
    id: "adv-architecture",
    index: "04",
    title: "Architecture",
    icon: "code",
    ediyrex: "Clean TypeScript, Next.js and PostgreSQL ownership.",
    traditional: "Bloated templates and rigid plugin lock-in.",
  },
  {
    id: "adv-ai",
    index: "05",
    title: "AI Capability",
    icon: "zap",
    ediyrex: "Practical agents, voice reception and RAG integrated.",
    traditional: "Surface-level chatbots bolted on afterwards.",
  },
];

