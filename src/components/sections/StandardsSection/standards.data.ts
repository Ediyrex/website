export interface BrutalistPrinciple {
  id: string;
  number: string;
  label: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  annotation: string;
  href: string;
}

export const STANDARDS_PRINCIPLES: Record<
  "transparency" | "integration" | "ownership" | "practicalAi",
  BrutalistPrinciple
> = {
  transparency: {
    id: "transparency",
    number: "01",
    label: "TRANSPARENCY",
    headlineLine1: "NOTHING",
    headlineLine2: "TO HIDE.",
    description:
      "Every concept, prototype and exploration is honestly represented.",
    annotation: "EVIDENCE FIRST",
    href: "/work",
  },
  integration: {
    id: "integration",
    number: "02",
    label: "INTEGRATION",
    headlineLine1: "EVERYTHING",
    headlineLine2: "CONNECTED.",
    description: "Media, Digital and AI work as one team.",
    annotation: "UNIFIED EXECUTION",
    href: "/services",
  },
  ownership: {
    id: "ownership",
    number: "03",
    label: "OWNERSHIP",
    headlineLine1: "BUILT TO",
    headlineLine2: "BE YOURS.",
    description: "Maintainable systems. Complete ownership.",
    annotation: "LONG-TERM CONTROL",
    href: "/services/digital",
  },
  practicalAi: {
    id: "practicalAi",
    number: "04",
    label: "PRACTICAL AI",
    headlineLine1: "INTELLIGENCE",
    headlineLine2: "WITH PURPOSE.",
    description:
      "AI is deployed where it solves real problems, with human oversight and measurable outcomes.",
    annotation: "APPLIED INTELLIGENCE",
    href: "/services/ai",
  },
};

