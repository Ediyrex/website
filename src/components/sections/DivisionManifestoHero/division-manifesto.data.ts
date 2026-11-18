export interface ProcessStage {
  number: string;
  title: string;
  description: string;
}

export interface DivisionManifestoData {
  id: string;
  slug: string;
  number: string;
  divisionTitle: string;
  studioIdentifier: string;
  headline: {
    line1: string;
    line2: string;
    line3: string;
  };
  description: string;
  processHeading: string;
  processStages: readonly ProcessStage[];
  signatureLeft: string;
  signatureRight: string;
}

export const DIVISION_MANIFESTO_MAP: Record<string, DivisionManifestoData> = {
  branding: {
    id: "branding-marketing",
    slug: "branding",
    number: "01",
    divisionTitle: "BRANDING & MARKETING",
    studioIdentifier: "DIVISION 01",
    headline: {
      line1: "Make your brand",
      line2: "impossible to overlook.",
      line3: "And worth remembering.",
    },
    description:
      "We build brand identities, marketing systems and campaigns that turn attention into meaningful business growth.",
    processHeading: "THE BRAND GROWTH PROCESS",
    processStages: [
      {
        number: "01",
        title: "POSITION",
        description: "Define what makes the brand matter.",
      },
      {
        number: "02",
        title: "ATTRACT",
        description: "Create attention through strategic campaigns.",
      },
      {
        number: "03",
        title: "CONVERT",
        description: "Turn visibility into meaningful action.",
      },
    ],
    signatureLeft: "01 / FOUR CONNECTED DIVISIONS",
    signatureRight: "STRATEGY / ATTENTION / GROWTH",
  },

  media: {
    id: "media-content",
    slug: "media",
    number: "02",
    divisionTitle: "MEDIA & CONTENT PRODUCTION",
    studioIdentifier: "DIVISION 02",
    headline: {
      line1: "Give your ideas a voice.",
      line2: "Give your stories",
      line3: "a presence.",
    },
    description:
      "Video production, editorial storytelling, motion graphics and commercial media engineered to engage and retain modern audiences.",
    processHeading: "THE MEDIA PRODUCTION PROCESS",
    processStages: [
      {
        number: "01",
        title: "CONCEPT",
        description: "Shape narrative direction and creative hooks.",
      },
      {
        number: "02",
        title: "CREATE",
        description: "Produce high-craft video, motion and visual assets.",
      },
      {
        number: "03",
        title: "DISTRIBUTE",
        description: "Format and optimize for multichannel reach.",
      },
    ],
    signatureLeft: "02 / FOUR CONNECTED DIVISIONS",
    signatureRight: "STORY / CRAFT / DISTRIBUTION",
  },

  digital: {
    id: "web-apps-digital",
    slug: "digital",
    number: "03",
    divisionTitle: "WEB, APPS & DIGITAL PRODUCTS",
    studioIdentifier: "DIVISION 03",
    headline: {
      line1: "From ambitious ideas",
      line2: "to software people",
      line3: "actually use.",
    },
    description:
      "High-performance websites, custom web applications, SaaS platforms and intuitive digital tools engineered for speed and clarity.",
    processHeading: "THE DIGITAL PRODUCT PROCESS",
    processStages: [
      {
        number: "01",
        title: "DESIGN",
        description: "Architect intuitive UI/UX systems and flows.",
      },
      {
        number: "02",
        title: "ENGINEER",
        description: "Build scalable full-stack web and product architecture.",
      },
      {
        number: "03",
        title: "EVOLVE",
        description: "Deploy, monitor and scale through continuous iteration.",
      },
    ],
    signatureLeft: "03 / FOUR CONNECTED DIVISIONS",
    signatureRight: "EXPERIENCE / ENGINEERING / SCALE",
  },

  ai: {
    id: "ai-automation",
    slug: "ai",
    number: "04",
    divisionTitle: "AI & AUTOMATION",
    studioIdentifier: "DIVISION 04",
    headline: {
      line1: "Less repetitive work.",
      line2: "More intelligent",
      line3: "operations.",
    },
    description:
      "Autonomous AI agents, production chatbots, voice calling systems and automated workflows connected directly to your core business.",
    processHeading: "THE INTELLIGENT SYSTEMS PROCESS",
    processStages: [
      {
        number: "01",
        title: "CONNECT",
        description: "Map operational bottlenecks and data sources.",
      },
      {
        number: "02",
        title: "AUTOMATE",
        description: "Deploy AI agents and end-to-end automated pipelines.",
      },
      {
        number: "03",
        title: "OPTIMIZE",
        description: "Refine accuracy, latency and operational leverage.",
      },
    ],
    signatureLeft: "04 / FOUR CONNECTED DIVISIONS",
    signatureRight: "INTELLIGENCE / AUTOMATION / IMPACT",
  },
};
