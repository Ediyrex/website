export type BlueprintStatus = "shipped" | "in-progress" | "concept" | "rnd";

export interface BlueprintProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  divisionIds: string[];
  capabilities: readonly string[];
  status: BlueprintStatus;
  statusLabel: string;
  detailRoute: string;
  featured?: boolean;
}

export interface RelevantBlueprintsData {
  headerLeft: string;
  headerRight: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  signatureLeft: string;
  signatureRight: string;
}

export const BLUEPRINTS_SECTION_DATA: RelevantBlueprintsData = {
  headerLeft: "RELEVANT BLUEPRINTS",
  headerRight: "ALL WORK ↗",
  headlineLine1: "Ideas explored.",
  headlineLine2: "Systems imagined.",
  description:
    "A selection of studio concepts and related projects that demonstrate how our capabilities translate into practical systems.",
  signatureLeft: "STUDIO PROJECTS / CONCEPTS / R&D",
  signatureRight: "VIEW ALL BLUEPRINTS ↗",
};

export const BLUEPRINT_PROJECTS: readonly BlueprintProject[] = [
  {
    id: "vocalis",
    slug: "vocalis-voice-receptionist",
    title: "Vocalis Intelligent Voice Receptionist",
    description:
      "A low-latency conversational voice agent architecture designed for natural inbound call handling, calendar scheduling, and structured lead capture.",
    category: "HYBRID / VOICE AI",
    divisionIds: ["branding", "ai", "media", "digital"],
    capabilities: ["VOICE AI", "INBOUND CALLS", "SCHEDULING", "LEAD CAPTURE"],
    status: "concept",
    statusLabel: "CONCEPT PROJECT",
    detailRoute: "/work/vocalis-voice-receptionist",
    featured: true,
  },
  {
    id: "lumora",
    slug: "lumora-launch-campaign",
    title: "Lumora Launch Campaign",
    description:
      "A full-funnel launch campaign and brand system for a D2C wellness brand, combining positioning, creative, and performance marketing.",
    category: "BRANDING / CAMPAIGN",
    divisionIds: ["branding", "media"],
    capabilities: [
      "BRAND IDENTITY",
      "PAID CAMPAIGNS",
      "CREATIVE SYSTEM",
      "GROWTH MEDIA",
    ],
    status: "shipped",
    statusLabel: "SHIPPED",
    detailRoute: "/work",
    featured: false,
  },
  {
    id: "atlas",
    slug: "atlas-brand-experience",
    title: "Atlas Brand Experience",
    description:
      "A product-led brand and web experience for a SaaS platform, designed to simplify a complex offering and drive qualified sign-ups.",
    category: "WEB / PRODUCT",
    divisionIds: ["branding", "digital"],
    capabilities: ["UX / UI", "WEBSITE", "PRODUCT MARKETING", "CONVERSION"],
    status: "in-progress",
    statusLabel: "IN PROGRESS",
    detailRoute: "/work",
    featured: false,
  },
  {
    id: "nexus",
    slug: "nexus-automations-os",
    title: "Autonomous Ops Agent & Workflow Suite",
    description:
      "Concept architecture for an autonomous enterprise operations hub integrating multi-agent coordination, document parsing, and human-in-the-loop review.",
    category: "AI / AUTOMATION",
    divisionIds: ["ai", "digital"],
    capabilities: ["AI AGENTS", "N8N WORKFLOWS", "CHATBOTS", "DADV CHARTS"],
    status: "rnd",
    statusLabel: "STUDIO R&D",
    detailRoute: "/work/nexus-automations-os",
    featured: true,
  },
  {
    id: "lumina",
    slug: "lumina-cinematic-campaign",
    title: "Lumina Brand Identity & Motion Narrative",
    description:
      "Visual identity, 3D product motion graphics, and short-form video system created as a concept showcase for sustainable consumer hardware.",
    category: "MEDIA / PRODUCTION",
    divisionIds: ["media", "branding"],
    capabilities: [
      "MOTION GRAPHICS",
      "BRAND FILMS",
      "VIDEO EDITING",
      "3D STORYBOARD",
    ],
    status: "concept",
    statusLabel: "CONCEPT PROJECT",
    detailRoute: "/work/lumina-cinematic-campaign",
    featured: false,
  },
  {
    id: "strata",
    slug: "strata-cloud-dashboard",
    title: "Strata Cloud Metrics & Telemetry Platform",
    description:
      "High-contrast SaaS web application and modular design system engineered for streaming telemetry workflows and developer tooling.",
    category: "DIGITAL / SAAS",
    divisionIds: ["digital", "ai"],
    capabilities: [
      "DADV PORTAL",
      "REACT & D3",
      "UI / UX TOKENS",
      "TECHNICAL SEO",
    ],
    status: "shipped",
    statusLabel: "SHIPPED",
    detailRoute: "/work/strata-cloud-dashboard",
    featured: false,
  },
];
