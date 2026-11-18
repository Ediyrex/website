export type BlueprintStatus = "shipped" | "in-progress" | "concept" | "rnd";

export type ProjectClassification =
  | "client-project"
  | "concept-project"
  | "studio-rnd";

export type ProjectPreviewVariant =
  | "vocalis"
  | "lumora"
  | "atlas"
  | "nexus"
  | "lumina"
  | "strata";

export interface BlueprintProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  classification: ProjectClassification;
  classificationLabel: string;
  status: BlueprintStatus;
  statusLabel: string;
  divisionIds: string[];
  industryIds: string[];
  capabilities: readonly string[];
  industryLabel: string;
  divisionLabel: string;
  typeLabel: string;
  detailRoute: string;
  systemFlowAvailable?: boolean;
  featured: boolean;
  previewVariant: ProjectPreviewVariant;
  displayOrder: number;
}

export interface RelevantBlueprintsConfig {
  headerLeft: string;
  headerRight: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  featuredLabel: string;
  relatedLabel: string;
  signatureLeft: string;
  signatureRight: string;
}

export const BLUEPRINTS_SECTION_DATA: RelevantBlueprintsConfig = {
  headerLeft: "SELECTED WORK / PROJECTS",
  headerRight: "STUDIO PROJECTS & BLUEPRINTS",
  headlineLine1: "Selected work.",
  headlineLine2: "Systems in motion.",
  description:
    "A curated selection of shipped projects, ongoing builds and studio concepts. Explore the thinking, capabilities and execution behind each project.",
  featuredLabel: "FEATURED BLUEPRINT",
  relatedLabel: "MORE RELATED BLUEPRINTS",
  signatureLeft: "STUDIO PROJECTS / CONCEPTS / R&D",
  signatureRight: "VIEW ALL PROJECTS ↗",
};

export const BLUEPRINT_PROJECTS: readonly BlueprintProject[] = [
  {
    id: "vocalis",
    slug: "vocalis-voice-receptionist",
    title: "Vocalis Intelligent Voice Receptionist",
    description:
      "A low-latency conversational voice agent architecture designed for natural inbound call handling, calendar scheduling and structured lead capture.",
    category: "HYBRID / VOICE AI",
    classification: "concept-project",
    classificationLabel: "CONCEPT PROJECT",
    status: "concept",
    statusLabel: "CONCEPT PROJECT",
    divisionIds: ["branding", "ai", "media", "digital"],
    industryIds: ["professional-services", "healthcare-clinics", "real-estate-property", "agencies-white-label"],
    capabilities: ["VOICE AI", "SCHEDULING", "INBOUND CALLS", "LEAD CAPTURE"],
    industryLabel: "Professional Services",
    divisionLabel: "Hybrid Systems",
    typeLabel: "Studio R&D",
    detailRoute: "/work/vocalis-voice-receptionist",
    systemFlowAvailable: true,
    featured: true,
    previewVariant: "vocalis",
    displayOrder: 1,
  },
  {
    id: "lumora",
    slug: "lumora-launch-campaign",
    title: "Lumora Launch Campaign",
    description:
      "A full-funnel launch campaign and brand system for a D2C wellness brand, combining positioning, creative and performance marketing.",
    category: "BRANDING / CAMPAIGN",
    classification: "client-project",
    classificationLabel: "CLIENT PROJECT",
    status: "shipped",
    statusLabel: "SHIPPED",
    divisionIds: ["branding", "media"],
    industryIds: ["retail-ecommerce", "health-biotech"],
    capabilities: [
      "BRAND IDENTITY",
      "PAID CAMPAIGNS",
      "CREATIVE SYSTEM",
      "GROWTH MEDIA",
    ],
    industryLabel: "Retail & E-commerce",
    divisionLabel: "Branding & Media",
    typeLabel: "Client Project",
    detailRoute: "/work",
    systemFlowAvailable: false,
    featured: false,
    previewVariant: "lumora",
    displayOrder: 2,
  },
  {
    id: "atlas",
    slug: "atlas-brand-experience",
    title: "Atlas Brand Experience",
    description:
      "A product-led brand and web experience for a SaaS platform, designed to simplify a complex offering and drive qualified sign-ups.",
    category: "WEB / PRODUCT",
    classification: "client-project",
    classificationLabel: "CLIENT PROJECT",
    status: "in-progress",
    statusLabel: "IN PROGRESS",
    divisionIds: ["branding", "digital"],
    industryIds: ["b2b-saas", "agencies-white-label"],
    capabilities: ["UX / UI", "WEBSITE", "PRODUCT MARKETING", "CONVERSION"],
    industryLabel: "B2B SaaS",
    divisionLabel: "Web & Digital",
    typeLabel: "Client Project",
    detailRoute: "/work",
    systemFlowAvailable: false,
    featured: false,
    previewVariant: "atlas",
    displayOrder: 3,
  },
  {
    id: "nexus",
    slug: "nexus-automations-os",
    title: "Autonomous Ops Agent & Workflow Suite",
    description:
      "Concept architecture for an autonomous enterprise operations hub integrating multi-agent coordination, document parsing, and human-in-the-loop review.",
    category: "AI / AUTOMATION",
    classification: "studio-rnd",
    classificationLabel: "STUDIO R&D",
    status: "rnd",
    statusLabel: "STUDIO R&D",
    divisionIds: ["ai", "digital"],
    industryIds: ["enterprise-ops", "ai-devtools"],
    capabilities: ["AI AGENTS", "N8N WORKFLOWS", "CHATBOTS", "DADV CHARTS"],
    industryLabel: "Enterprise Ops",
    divisionLabel: "AI & Automation",
    typeLabel: "Studio R&D",
    detailRoute: "/work/nexus-automations-os",
    systemFlowAvailable: true,
    featured: true,
    previewVariant: "nexus",
    displayOrder: 4,
  },
  {
    id: "lumina",
    slug: "lumina-cinematic-campaign",
    title: "Lumina Brand Identity & Motion Narrative",
    description:
      "Visual identity, 3D product motion graphics, and short-form video system created as a concept showcase for sustainable consumer hardware.",
    category: "MEDIA / PRODUCTION",
    classification: "concept-project",
    classificationLabel: "CONCEPT PROJECT",
    status: "concept",
    statusLabel: "CONCEPT PROJECT",
    divisionIds: ["media", "branding"],
    industryIds: ["retail-ecommerce", "agencies-white-label"],
    capabilities: [
      "MOTION GRAPHICS",
      "BRAND FILMS",
      "VIDEO EDITING",
      "3D STORYBOARD",
    ],
    industryLabel: "Hardware & Tech",
    divisionLabel: "Media Production",
    typeLabel: "Concept Project",
    detailRoute: "/work/lumina-cinematic-campaign",
    systemFlowAvailable: false,
    featured: false,
    previewVariant: "lumina",
    displayOrder: 5,
  },
  {
    id: "strata",
    slug: "strata-cloud-dashboard",
    title: "Strata Cloud Metrics & Telemetry Platform",
    description:
      "High-contrast SaaS web application and modular design system engineered for streaming telemetry workflows and developer tooling.",
    category: "DIGITAL / SAAS",
    classification: "client-project",
    classificationLabel: "CLIENT PROJECT",
    status: "shipped",
    statusLabel: "SHIPPED",
    divisionIds: ["digital", "ai"],
    industryIds: ["b2b-saas", "ai-devtools"],
    capabilities: [
      "DADV PORTAL",
      "REACT & D3",
      "UI / UX TOKENS",
      "TECHNICAL SEO",
    ],
    industryLabel: "Cloud Infrastructure",
    divisionLabel: "Digital Products",
    typeLabel: "Client Project",
    detailRoute: "/work/strata-cloud-dashboard",
    systemFlowAvailable: false,
    featured: false,
    previewVariant: "strata",
    displayOrder: 6,
  },
];
