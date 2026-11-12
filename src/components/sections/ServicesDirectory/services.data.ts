import type { ServiceDivision, ServiceItem } from "@/types";

export type DirectoryIconKey = "megaphone" | "video" | "layers" | "cpu";

export interface DirectoryDivision {
  id: ServiceDivision;
  number: string;
  name: string;
  description: string;
  capabilityCountLabel: string;
  icon: DirectoryIconKey;
  accentHex: string;
  href: string;
  capabilities: ServiceItem[];
}

export interface StudioRetainer {
  id: string;
  number: string;
  title: string;
  items: string[];
}

function makeCapability(
  division: ServiceDivision,
  displayOrder: number,
  slug: string,
  title: string,
  description: string,
  capabilities: string[],
  iconName: string,
): ServiceItem {
  return {
    id: `${division}-${slug}`,
    slug,
    title,
    description,
    division,
    featured: displayOrder <= 2,
    displayOrder,
    isPublished: true,
    capabilities,
    iconName,
  };
}

const BRANDING_CAPABILITIES: ServiceItem[] = [
  makeCapability(
    "branding",
    1,
    "brand-strategy-positioning",
    "Brand Strategy & Positioning",
    "Defining market positioning, brand architecture, audience clarity, and competitive differentiation.",
    [
      "Brand discovery & research",
      "Market & competitor analysis",
      "Brand positioning",
      "Audience definition",
      "Brand architecture",
      "Messaging strategy",
    ],
    "Compass",
  ),
  makeCapability(
    "branding",
    2,
    "brand-identity-guidelines",
    "Brand Identity & Guidelines",
    "Cohesive visual identity systems built for consistent execution across digital and physical touchpoints.",
    [
      "Logo design",
      "Visual identity systems",
      "Colour & typography systems",
      "Brand guidelines",
      "Brand assets & applications",
      "Identity documentation",
    ],
    "Palette",
  ),
  makeCapability(
    "branding",
    3,
    "marketing-strategy-campaigns",
    "Marketing Strategy & Campaigns",
    "Structured marketing plans, audience segmentation, and multi-channel campaign direction.",
    [
      "Marketing strategy",
      "Campaign planning",
      "Audience segmentation",
      "Channel planning",
      "Creative direction",
      "Performance evaluation",
    ],
    "Megaphone",
  ),
  makeCapability(
    "branding",
    4,
    "performance-marketing-ads",
    "Performance Marketing & Ads",
    "Targeted paid acquisition campaigns across Meta, Google, and LinkedIn with structured testing.",
    [
      "Meta, Google & LinkedIn ads",
      "Campaign setup & targeting",
      "Creative testing",
      "Campaign optimization",
      "Conversion tracking",
    ],
    "Target",
  ),
  makeCapability(
    "branding",
    5,
    "seo-organic-growth",
    "SEO & Organic Growth",
    "Technical and on-page search foundations designed to strengthen organic visibility over time.",
    [
      "Technical & on-page SEO",
      "Keyword & intent research",
      "Content optimization",
      "Search visibility",
      "SEO audits",
    ],
    "Search",
  ),
  makeCapability(
    "branding",
    6,
    "influencer-creator-marketing",
    "Influencer & Creator Marketing",
    "End-to-end creator partnerships, campaign briefs, sponsorship coordination, and tracking.",
    [
      "Creator discovery & research",
      "Campaign planning",
      "Sponsorship coordination",
      "Creator briefs",
      "Collaboration management",
    ],
    "Users",
  ),
  makeCapability(
    "branding",
    7,
    "email-marketing-lead-nurturing",
    "Email Marketing & Lead Nurturing",
    "Automated email flows, newsletters, and segmented lifecycle campaigns built to nurture demand.",
    [
      "Email campaign strategy",
      "Newsletter planning & design",
      "Automated email flows",
      "Lead nurturing",
      "Audience segmentation",
    ],
    "Mail",
  ),
  makeCapability(
    "branding",
    8,
    "pitch-decks-presentation-design",
    "Pitch Decks & Presentation Design",
    "High-clarity investor pitch decks, sales presentations, and corporate profiles structured for persuasion.",
    [
      "Investor pitch decks",
      "Startup & sales decks",
      "Corporate presentations",
      "Business proposals",
      "Presentation storytelling",
      "Visual information design",
    ],
    "Presentation",
  ),
];

const MEDIA_CAPABILITIES: ServiceItem[] = [
  makeCapability(
    "media",
    1,
    "content-strategy-planning",
    "Content Strategy & Planning",
    "Research-backed content pillars, editorial calendars, and platform-specific distribution plans.",
    [
      "Content research",
      "Content calendars & pillars",
      "Platform-specific strategy",
      "Campaign content planning",
      "Editorial scheduling",
    ],
    "Calendar",
  ),
  makeCapability(
    "media",
    2,
    "copywriting-brand-messaging",
    "Copywriting & Brand Messaging",
    "Clear, persuasive brand copywriting, taglines, ad copy, and creative narratives.",
    [
      "Brand & marketing copy",
      "Advertising copy",
      "Campaign messaging",
      "Taglines & headlines",
      "Scripts & narratives",
    ],
    "PenTool",
  ),
  makeCapability(
    "media",
    3,
    "website-landing-page-copy",
    "Website & Landing Page Copy",
    "Conversion-oriented website copywriting structured for clarity across home, service, and landing pages.",
    [
      "Homepage copywriting",
      "Service & landing page copy",
      "Product descriptions",
      "Website content structure",
      "Calls to action",
    ],
    "FileText",
  ),
  makeCapability(
    "media",
    4,
    "social-media-content-production",
    "Social Media Content Production",
    "Platform-native posts, carousels, and short-form vertical content tailored for Instagram and LinkedIn.",
    [
      "Instagram & LinkedIn content",
      "Reels & short-form content",
      "Carousel content",
      "Platform-native formats",
      "Content adaptation",
    ],
    "Share2",
  ),
  makeCapability(
    "media",
    5,
    "graphics-creative-design",
    "Graphics & Creative Design",
    "Campaign visuals, social media creatives, editorial layouts, and promotional brand collateral.",
    [
      "Marketing & ad graphics",
      "Social media creatives",
      "Campaign visuals",
      "Editorial layouts",
      "Digital brand collateral",
    ],
    "Image",
  ),
  makeCapability(
    "media",
    6,
    "video-production-brand-films",
    "Video Production & Brand Films",
    "Commercial video production, brand films, product videos, and event coverage from direction to shoot.",
    [
      "Commercial video production",
      "Brand films",
      "Promotional & product videos",
      "Event videos",
      "Creative direction & planning",
    ],
    "Video",
  ),
  makeCapability(
    "media",
    7,
    "video-editing-post-production",
    "Video Editing & Post-production",
    "Short-form, long-form, podcast, and multi-camera editing with colour grading and sound mixing.",
    [
      "Short & long-form editing",
      "Podcast & multi-cam editing",
      "Event recap videos",
      "Colour grading",
      "Sound editing & mixing",
    ],
    "Film",
  ),
  makeCapability(
    "media",
    8,
    "motion-graphics-animation",
    "Motion Graphics & Animation",
    "2D motion graphics, kinetic typography, product explainers, and interface animations.",
    [
      "2D motion graphics",
      "Kinetic typography",
      "Product explainers",
      "Animated brand graphics",
      "Interface animations",
    ],
    "Sparkles",
  ),
  makeCapability(
    "media",
    9,
    "photography-product-shoots",
    "Photography & Product Shoots",
    "Commercial, product, brand, and lifestyle photography with creative shoot planning and retouching.",
    [
      "Product & commercial shoots",
      "Brand & lifestyle photography",
      "Promotional photography",
      "Creative shoot planning",
      "Editing & retouching",
    ],
    "Camera",
  ),
];

const DIGITAL_CAPABILITIES: ServiceItem[] = [
  makeCapability(
    "digital",
    1,
    "website-design-development",
    "Website Design & Development",
    "Custom corporate, business, and service websites engineered for speed, clarity, and CMS flexibility.",
    [
      "Corporate & business sites",
      "Landing & service pages",
      "Custom functionality",
      "CMS integration",
      "Performance optimization",
    ],
    "Globe",
  ),
  makeCapability(
    "digital",
    2,
    "ui-ux-design-prototyping",
    "UI/UX Design & Prototyping",
    "User journeys, information architecture, wireframes, design systems, and interactive prototypes.",
    [
      "User research & journeys",
      "Information architecture",
      "Wireframing & prototyping",
      "Interface & interaction design",
      "Design systems",
    ],
    "Layout",
  ),
  makeCapability(
    "digital",
    3,
    "mobile-application-development",
    "Mobile Application Development",
    "Android, iOS, and cross-platform mobile applications with authentication, APIs, and release prep.",
    [
      "Android & iOS apps",
      "Cross-platform apps",
      "Auth & user management",
      "API & push notifications",
      "Testing & release prep",
    ],
    "Smartphone",
  ),
  makeCapability(
    "digital",
    4,
    "web-applications-client-portals",
    "Web Applications & Client Portals",
    "Custom web applications, customer portals, and role-based interfaces connected to live APIs.",
    [
      "Custom web applications",
      "Customer & client portals",
      "Authentication systems",
      "Role-based access control",
      "API-connected interfaces",
    ],
    "AppWindow",
  ),
  makeCapability(
    "digital",
    5,
    "saas-product-design-development",
    "SaaS Product Design & Development",
    "End-to-end SaaS architecture, multi-tenant platforms, subscription billing, and product administration.",
    [
      "Product architecture",
      "Multi-tenant platforms",
      "Subscription & billing",
      "User & admin dashboards",
      "SaaS deployment",
    ],
    "Layers",
  ),
  makeCapability(
    "digital",
    6,
    "custom-crm-development",
    "Custom CRM Development",
    "Tailored lead management, sales pipelines, customer records, follow-up tracking, and CRM integrations.",
    [
      "Lead & contact management",
      "Sales pipelines",
      "Follow-up & activity tracking",
      "Customer dashboards",
      "Role-based access & APIs",
    ],
    "Contact",
  ),
  makeCapability(
    "digital",
    7,
    "erp-business-management-systems",
    "ERP & Business Management Systems",
    "Custom operational modules for inventory, orders, staff roles, workflows, and business reporting.",
    [
      "Business process modules",
      "Inventory & order systems",
      "Operations & staff roles",
      "Departmental workflows",
      "Reporting dashboards",
    ],
    "Building2",
  ),
  makeCapability(
    "digital",
    8,
    "ecommerce-development",
    "E-commerce Development",
    "Custom storefronts, product catalogues, checkout flows, payment gateways, and order management.",
    [
      "Online storefronts",
      "Product catalogues & cart",
      "Checkout & payments",
      "Order & inventory sync",
      "Store performance",
    ],
    "ShoppingBag",
  ),
  makeCapability(
    "digital",
    9,
    "admin-panels-internal-tools",
    "Admin Panels & Internal Tools",
    "Custom administrative interfaces, CMS tools, staff permissions, and internal operational workflows.",
    [
      "Custom admin dashboards",
      "Content management tools",
      "Internal business tools",
      "Staff & permission controls",
      "Operational workflows",
    ],
    "Sliders",
  ),
  makeCapability(
    "digital",
    10,
    "dashboards-data-visualization",
    "Dashboards & Data Visualization",
    "Business intelligence interfaces, KPI monitoring, interactive charts, and operational reporting.",
    [
      "BI & analytics interfaces",
      "KPI monitoring",
      "Interactive charts & tables",
      "Data integrations",
      "Operational reporting",
    ],
    "BarChart3",
  ),
  makeCapability(
    "digital",
    11,
    "amc-technical-maintenance",
    "AMC & Technical Maintenance",
    "Structured Annual Maintenance Contracts covering updates, security patches, bug fixes, backups, and technical support.",
    [
      "Web, app & SaaS maintenance",
      "CRM & ERP maintenance",
      "Bug fixes & security updates",
      "Dependency & perf updates",
      "Backup & recovery planning",
    ],
    "ShieldCheck",
  ),
];

const AI_CAPABILITIES: ServiceItem[] = [
  makeCapability(
    "ai",
    1,
    "ai-agents-copilots",
    "AI Agents & Copilots",
    "Task-oriented business workflow agents, tool-connected copilots, and human-in-the-loop orchestration.",
    [
      "Task-oriented AI agents",
      "Workflow & tool agents",
      "Agent orchestration",
      "Human-in-the-loop systems",
      "Monitoring & evaluation",
    ],
    "Bot",
  ),
  makeCapability(
    "ai",
    2,
    "ai-chatbots-customer-support",
    "AI Chatbots & Customer Support",
    "Knowledge-grounded website assistants, enquiry automation, support routing, and human escalation.",
    [
      "Website & support chatbots",
      "Knowledge-based assistants",
      "Enquiry automation",
      "Support routing",
      "Human escalation",
    ],
    "MessageSquare",
  ),
  makeCapability(
    "ai",
    3,
    "voice-ai-virtual-receptionists",
    "Voice AI & Virtual Receptionists",
    "Inbound voice agents, appointment assistance, call routing, lead qualification, and human handoff.",
    [
      "Inbound voice agents",
      "Outbound call workflows",
      "Appointment assistance",
      "Call routing & qualification",
      "Human call escalation",
    ],
    "PhoneCall",
  ),
  makeCapability(
    "ai",
    4,
    "workflow-business-process-automation",
    "Workflow & Business Process Automation",
    "n8n automation, trigger-based orchestration, data synchronization, and operational notifications.",
    [
      "n8n workflow automation",
      "Task orchestration",
      "Trigger-based workflows",
      "Data synchronization",
      "Notification automation",
    ],
    "Workflow",
  ),
  makeCapability(
    "ai",
    5,
    "whatsapp-communication-automation",
    "WhatsApp & Communication Automation",
    "WhatsApp Business integrations, automated customer notifications, and conversational enquiry routing.",
    [
      "WhatsApp Business APIs",
      "Automated notifications",
      "Conversational workflows",
      "Appointment reminders",
      "Enquiry routing",
    ],
    "MessageCircle",
  ),
  makeCapability(
    "ai",
    6,
    "rag-knowledge-systems",
    "RAG & Knowledge Systems",
    "Retrieval-Augmented Generation, document search, vector indexing, and internal knowledge assistants.",
    [
      "Retrieval-Augmented Gen",
      "Document search systems",
      "Internal knowledge assistants",
      "Vector search integrations",
      "Document processing",
    ],
    "Database",
  ),
  makeCapability(
    "ai",
    7,
    "api-third-party-integrations",
    "API & Third-party Integrations",
    "REST APIs, webhooks, CRM connectors, payment integrations, and cross-platform data synchronization.",
    [
      "REST API & webhooks",
      "Third-party app connectors",
      "CRM integrations",
      "Payment & messaging APIs",
      "Cross-platform data sync",
    ],
    "Plug",
  ),
];

const DIVISION_META: readonly Omit<
  DirectoryDivision,
  "capabilityCountLabel"
>[] = [
  {
    id: "branding",
    number: "01",
    name: "Branding & Marketing",
    description:
      "Building distinctive brands, defining market positioning and creating marketing systems that generate awareness, engagement and demand.",
    icon: "megaphone",
    accentHex: "#F07824",
    href: "/services/branding",
    capabilities: BRANDING_CAPABILITIES,
  },
  {
    id: "media",
    number: "02",
    name: "Media & Content Production",
    description:
      "Planning, creating and producing compelling visual and written content that communicates brand value, engages audiences and supports business objectives.",
    icon: "video",
    accentHex: "#E58A76",
    href: "/services/media",
    capabilities: MEDIA_CAPABILITIES,
  },
  {
    id: "digital",
    number: "03",
    name: "Web, Apps & Digital Products",
    description:
      "Designing and engineering scalable websites, mobile applications, SaaS products and custom business software tailored to real operational and customer needs.",
    icon: "layers",
    accentHex: "#7BA9F5",
    href: "/services/digital",
    capabilities: DIGITAL_CAPABILITIES,
  },
  {
    id: "ai",
    number: "04",
    name: "AI & Automation",
    description:
      "Developing intelligent agents, conversational systems and connected workflows that reduce operational friction and improve business processes.",
    icon: "cpu",
    accentHex: "#B5A0F5",
    href: "/services/ai",
    capabilities: AI_CAPABILITIES,
  },
];

export const DIRECTORY_DIVISIONS: readonly DirectoryDivision[] =
  DIVISION_META.map((division) => {
    const countPadded = String(division.capabilities.length).padStart(2, "0");
    return {
      ...division,
      capabilityCountLabel: `${countPadded} CAPABILITIES`,
    };
  });

export const TOTAL_CAPABILITIES_COUNT = DIRECTORY_DIVISIONS.reduce(
  (sum, division) => sum + division.capabilities.length,
  0,
);

export const STUDIO_DIRECTORY_METRICS = [
  {
    value: String(DIRECTORY_DIVISIONS.length).padStart(2, "0"),
    label: "Divisions",
  },
  {
    value: String(TOTAL_CAPABILITIES_COUNT).padStart(2, "0"),
    label: "Capabilities",
  },
  { value: "01", label: "Integrated Studio" },
] as const;

export const STUDIO_RETAINERS: readonly StudioRetainer[] = [
  {
    id: "digital-amc",
    number: "01",
    title: "Website & Digital Product AMC",
    items: [
      "Website & application maintenance",
      "Security patches & bug fixes",
      "Performance checks & technical support",
    ],
  },
  {
    id: "content-retainer",
    number: "02",
    title: "Content & Creative Retainers",
    items: [
      "Monthly content & social production",
      "Copywriting & campaign creatives",
      "Video editing & motion assets",
    ],
  },
  {
    id: "marketing-retainer",
    number: "03",
    title: "Marketing Retainers",
    items: [
      "SEO maintenance & optimization",
      "Advertising campaign management",
      "Email marketing & reporting",
    ],
  },
  {
    id: "ai-ops-support",
    number: "04",
    title: "Technical & AI Operations Support",
    items: [
      "API & workflow maintenance",
      "AI agent monitoring",
      "Automation & system improvements",
    ],
  },
];
