export interface BespokeProcessStage {
  number: string;
  title: string;
  description: string;
}

export interface DisciplineItem {
  number: string;
  name: string;
  route: string;
}

export interface BespokeEngagementsConfig {
  sectionId: string;
  headerLeft: string;
  headerRight: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  primaryCta: {
    label: string;
    route: string;
  };
  secondaryCta: {
    label: string;
    targetId: string;
  };
  processHeading: string;
  stages: readonly BespokeProcessStage[];
  processClosing: string;
  disciplinesManifestoLine1: string;
  disciplinesManifestoLine2: string;
  disciplines: readonly DisciplineItem[];
  bottomSignature: string;
}

export const BESPOKE_ENGAGEMENTS_CONFIG: BespokeEngagementsConfig = {
  sectionId: "bespoke-engagements",
  headerLeft: "BEYOND THE SECTOR INDEX / 07",
  headerRight: "BESPOKE ENGAGEMENTS",
  headlineLine1: "Your industry isn't listed.",
  headlineLine2: "Let's build around it.",
  description:
    "Every business has different requirements. Tell us about your domain, your challenges and your goals. We'll shape an engagement around what your business actually needs.",
  primaryCta: {
    label: "Discuss your industry",
    route: "/contact?source=industries-bespoke&industry=other-not-listed",
  },
  secondaryCta: {
    label: "Explore our four disciplines",
    targetId: "four-disciplines",
  },
  processHeading: "A BESPOKE ENGAGEMENT STARTS WITH",
  stages: [
    {
      number: "01",
      title: "Your domain",
      description: "Understand your business model and operating environment.",
    },
    {
      number: "02",
      title: "Your constraints",
      description: "Identify technical, regulatory and operational requirements.",
    },
    {
      number: "03",
      title: "Your objectives",
      description: "Determine what needs to be built, improved or transformed.",
    },
  ],
  processClosing: "NO PREDEFINED INDUSTRY REQUIRED.",
  disciplinesManifestoLine1: "One studio.",
  disciplinesManifestoLine2: "Four connected disciplines.",
  disciplines: [
    {
      number: "01",
      name: "Branding & Marketing",
      route: "/services/branding",
    },
    {
      number: "02",
      name: "Media & Content Production",
      route: "/services/media",
    },
    {
      number: "03",
      name: "Web, Apps & Digital Products",
      route: "/services/digital",
    },
    {
      number: "04",
      name: "AI & Automation",
      route: "/services/ai",
    },
  ],
  bottomSignature: "ONE CONNECTED STUDIO / BUILT AROUND YOUR REQUIREMENTS",
};
