export interface SectorArchitecture {
  id: string;
  slug: string;
  number?: string;
  category: string;
  title: string;
  description: string;
  capabilities: readonly string[];
  industryIds: readonly string[];
  published: boolean;
  featured: boolean;
  highlighted?: boolean;
  displayOrder: number;
  detailRoute?: string;
}

export const SECTOR_INTELLIGENCE_CONFIG = {
  sectionId: "sector-intelligence",
  headerLeft: "SECTOR INTELLIGENCE / 01",
  headerRight: "FEATURED SECTOR ARCHITECTURES",
  headlineLine1: "Domain-specific systems.",
  headlineLine2: "Built around real-world complexity.",
  description:
    "Explore how EDYREX combines creative, digital and intelligent systems to address the distinct requirements of different business sectors.",
  registerLabel: "SECTOR REGISTER",
  beyondSix: {
    title: "Beyond these six.",
    subtitle: "There are more industries to build for.",
    description:
      "EDYREX is not limited to these featured sector groups. We explore solutions for other business domains according to their requirements.",
    ctaLabel: "Explore More Industries",
    targetId: "industry-directory",
  },
};

export const FEATURED_SECTOR_ARCHITECTURES: readonly SectorArchitecture[] = [
  {
    id: "ai-devtools",
    slug: "ai-devtools",
    category: "AUTONOMOUS SYSTEMS / DEVELOPER TOOLS",
    title: "AI, Machine Learning & DevTools",
    description:
      "Intelligent agent frameworks, observability systems and engineering infrastructure.",
    capabilities: [
      "AI AGENTS",
      "MODEL INFRASTRUCTURE",
      "DEVELOPER PLATFORMS",
      "API SYSTEMS",
    ],
    industryIds: ["healthcare-clinics", "finance-fintech", "agencies-white-label"],
    published: true,
    featured: true,
    highlighted: false,
    displayOrder: 1,
    detailRoute: "/contact?sector=ai-devtools",
  },
  {
    id: "b2b-saas",
    slug: "b2b-saas",
    category: "TELEMETRY / CLOUD OPERATIONS",
    title: "B2B SaaS & Cloud Infrastructure",
    description:
      "High-performance SaaS products, real-time analytics and cloud-native systems.",
    capabilities: [
      "SAAS PLATFORMS",
      "CLOUD ARCHITECTURE",
      "TELEMETRY",
      "DASHBOARDS",
    ],
    industryIds: ["real-estate-property", "agencies-white-label", "education-coaching"],
    published: true,
    featured: true,
    highlighted: false,
    displayOrder: 2,
    detailRoute: "/contact?sector=b2b-saas",
  },
  {
    id: "dtc-commerce",
    slug: "dtc-commerce",
    category: "BRAND EXPERIENCE / COMMERCE",
    title: "DTC, Retail & Consumer Tech",
    description:
      "Connected brand experiences, commerce platforms and customer engagement systems.",
    capabilities: [
      "E-COMMERCE",
      "BRAND SYSTEMS",
      "CUSTOMER EXPERIENCE",
      "MARKETING",
    ],
    industryIds: ["retail-ecommerce", "restaurants-cafes", "gyms-fitness-sports"],
    published: true,
    featured: true,
    highlighted: false,
    displayOrder: 3,
    detailRoute: "/contact?sector=dtc-commerce",
  },
  {
    id: "fintech",
    slug: "fintech",
    category: "PAYMENTS / TRUST INFRASTRUCTURE",
    title: "FinTech & Financial Infrastructure",
    description:
      "Secure financial platforms, operational workflows and intelligent integrations.",
    capabilities: [
      "PAYMENT SYSTEMS",
      "KYC WORKFLOWS",
      "FINANCIAL AUTOMATION",
      "ANALYTICS",
    ],
    industryIds: ["finance-fintech", "real-estate-property"],
    published: true,
    featured: true,
    highlighted: false,
    displayOrder: 4,
    detailRoute: "/contact?sector=fintech",
  },
  {
    id: "biotech-health",
    slug: "biotech-health",
    category: "BIOTECH / HEALTH / LIFE SCIENCES",
    title: "Biotech, HealthTech & Life Sciences",
    description:
      "Digital health experiences, patient workflows and research-supporting technology.",
    capabilities: [
      "PATIENT PLATFORMS",
      "CLINICAL WORKFLOWS",
      "HEALTH DATA",
      "INTEGRATIONS",
    ],
    industryIds: ["healthcare-clinics", "gyms-fitness-sports"],
    published: true,
    featured: true,
    highlighted: false,
    displayOrder: 5,
    detailRoute: "/contact?sector=biotech-health",
  },
  {
    id: "professional-services",
    slug: "professional-services",
    category: "ENTERPRISE / MODERN OPERATIONS",
    title: "Professional Services & Modern Operators",
    description:
      "Connected business operations, internal platforms and workflow automation.",
    capabilities: [
      "CRM & ERP",
      "BUSINESS INTELLIGENCE",
      "WORKFLOW SYSTEMS",
      "AI ASSISTANTS",
    ],
    industryIds: ["construction-builders", "agencies-white-label", "education-coaching"],
    published: true,
    featured: true,
    highlighted: false,
    displayOrder: 6,
    detailRoute: "/contact?sector=professional-services",
  },
];
