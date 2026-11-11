export type FragmentedIconName =
  | "video"
  | "layers"
  | "code"
  | "megaphone"
  | "bot"
  | "database";

export interface FragmentedCardData {
  id: string;
  number: string;
  label: string;
  icon: FragmentedIconName;
  desktopClass: string;
  floatDuration: number;
  floatDelay: number;
}

export const FRAGMENTED_CARDS: readonly FragmentedCardData[] = [
  {
    id: "frag-video",
    number: "01",
    label: "Video Production",
    icon: "video",
    desktopClass: "-rotate-[2.5deg] -translate-y-2",
    floatDuration: 4.4,
    floatDelay: 0,
  },
  {
    id: "frag-design",
    number: "02",
    label: "Design Assets",
    icon: "layers",
    desktopClass: "rotate-[2deg] translate-y-2.5",
    floatDuration: 5.1,
    floatDelay: 0.4,
  },
  {
    id: "frag-web",
    number: "03",
    label: "Web & Development",
    icon: "code",
    desktopClass: "rotate-[1.5deg] translate-x-3",
    floatDuration: 4.7,
    floatDelay: 0.2,
  },
  {
    id: "frag-marketing",
    number: "04",
    label: "Marketing Tools",
    icon: "megaphone",
    desktopClass: "-rotate-[1.8deg] translate-y-3 -translate-x-1",
    floatDuration: 5.4,
    floatDelay: 0.7,
  },
  {
    id: "frag-ai",
    number: "05",
    label: "AI Tools (Isolated)",
    icon: "bot",
    desktopClass: "-rotate-[2deg] translate-y-1",
    floatDuration: 4.9,
    floatDelay: 0.3,
  },
  {
    id: "frag-ops",
    number: "06",
    label: "Operations (Manual)",
    icon: "database",
    desktopClass: "rotate-[2.2deg] translate-y-4 translate-x-1",
    floatDuration: 5.2,
    floatDelay: 0.5,
  },
];

export type ConnectedDivisionId =
  | "creative"
  | "digital"
  | "media"
  | "intelligence";

export interface ConnectedDivisionData {
  id: ConnectedDivisionId;
  number: string;
  title: string;
  description: string;
}

export const CONNECTED_DIVISIONS: readonly ConnectedDivisionData[] = [
  {
    id: "creative",
    number: "01",
    title: "Creative",
    description: "Brand, design & identity.",
  },
  {
    id: "digital",
    number: "02",
    title: "Digital",
    description: "Web, platforms & products.",
  },
  {
    id: "media",
    number: "03",
    title: "Media",
    description: "Video, content & production.",
  },
  {
    id: "intelligence",
    number: "04",
    title: "Intelligence",
    description: "AI, automation & operations.",
  },
];

export interface BenefitItemData {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: "zap" | "layers" | "chart" | "infinity";
}

export const OPERATIONAL_BENEFITS: readonly BenefitItemData[] = [
  {
    id: "unified-workflow",
    number: "01",
    title: "Unified Workflow",
    description: "All divisions work together, from strategy to execution.",
    icon: "zap",
  },
  {
    id: "faster-execution",
    number: "02",
    title: "Faster Execution",
    description: "Less friction, more motion across teams and tools.",
    icon: "layers",
  },
  {
    id: "higher-impact",
    number: "03",
    title: "Higher Impact",
    description: "Consistent, scalable output that drives real results.",
    icon: "chart",
  },
  {
    id: "built-to-scale",
    number: "04",
    title: "Built to Scale",
    description: "A flexible system that grows with your business.",
    icon: "infinity",
  },
];
