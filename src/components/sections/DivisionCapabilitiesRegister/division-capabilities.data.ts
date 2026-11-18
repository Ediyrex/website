export interface ServiceRegisterItem {
  id: string;
  number: string;
  title: string;
  slug: string;
  shortCta: string;
  description: string;
  deliverables: readonly string[];
}

export interface DivisionCapabilitiesData {
  headerLeft: string;
  headerRight: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  registerLabel: string;
  registerRange: string;
  signatureLeft: string;
  services: readonly ServiceRegisterItem[];
}

export const DIVISION_CAPABILITIES_MAP: Record<string, DivisionCapabilitiesData> = {
  branding: {
    headerLeft: "CAPABILITIES & DELIVERABLES",
    headerRight: "05 SERVICE LINES / DIVISION 01",
    headlineLine1: "The capabilities behind",
    headlineLine2: "every brand move.",
    description:
      "From strategic positioning to campaign execution, explore the specialist capabilities and deliverables within our Branding & Marketing division.",
    registerLabel: "SERVICE REGISTER",
    registerRange: "01 — 05",
    signatureLeft: "BRANDING / MARKETING / GROWTH",
    services: [
      {
        id: "ads-and-engagement",
        number: "01",
        title: "Ads & Engagement",
        slug: "ads-and-engagement",
        shortCta: "Enquire about Ads & Engagement",
        description:
          "Performance-led campaigns designed to attract relevant audiences and build qualified demand.",
        deliverables: [
          "Meta, Google & LinkedIn Campaigns",
          "Creative Hooks & Ad Testing",
          "Community Engagement Systems",
          "ROAS, CPA & Funnel Attribution",
        ],
      },
      {
        id: "packaging-and-promotional-design",
        number: "02",
        title: "Packaging & Promotional Design",
        slug: "packaging-and-promotional-design",
        shortCta: "Enquire about Packaging & Design",
        description:
          "Brand presentation and promotional assets across physical and digital touchpoints.",
        deliverables: [
          "Product Packaging & Dielines",
          "Brand Identity Guidelines",
          "Promotional Decks & Print Collateral",
          "Launch Kits & Merchandise",
        ],
      },
      {
        id: "seo-optimization",
        number: "03",
        title: "SEO Optimization",
        slug: "seo-optimization",
        shortCta: "Enquire about SEO Optimization",
        description:
          "Search visibility, content architecture and organic discovery systems built for growth.",
        deliverables: [
          "Keyword Strategy & Intent Mapping",
          "On-Page Optimization & Content Clusters",
          "Local, Programmatic & AI Search SEO",
          "Search Console & Organic Growth Audits",
        ],
      },
      {
        id: "influencer-marketing",
        number: "04",
        title: "Influencer Marketing",
        slug: "influencer-marketing",
        shortCta: "Enquire about Influencer Marketing",
        description:
          "Creator partnerships and distribution strategies that connect brands with relevant audiences.",
        deliverables: [
          "Creator Discovery & Vetting",
          "Campaign Briefs & Content Direction",
          "Seeding, Whitelisting & Sponsorships",
          "Conversion & Referral Tracking",
        ],
      },
      {
        id: "email-marketing",
        number: "05",
        title: "Email Marketing",
        slug: "email-marketing",
        shortCta: "Enquire about Email Marketing",
        description:
          "Lifecycle communication and segmentation designed to nurture customer relationships.",
        deliverables: [
          "Welcome, Onboarding & Win-Back Flows",
          "Newsletter Design & Copywriting",
          "Audience Segmentation & A/B Testing",
          "Deliverability & Domain Authentication",
        ],
      },
    ],
  },

  media: {
    headerLeft: "CAPABILITIES & DELIVERABLES",
    headerRight: "05 SERVICE LINES / DIVISION 02",
    headlineLine1: "The craft behind",
    headlineLine2: "every visual story.",
    description:
      "From post-production to commercial photography, explore the specialist media and content production capabilities within our studio.",
    registerLabel: "SERVICE REGISTER",
    registerRange: "01 — 05",
    signatureLeft: "STORY / CRAFT / DISTRIBUTION",
    services: [
      {
        id: "video-editing",
        number: "01",
        title: "Video Editing",
        slug: "video-editing",
        shortCta: "Enquire about Video Editing",
        description:
          "Precision post-production for podcasts, high-retention short-form reels, and event narratives.",
        deliverables: [
          "Podcast Video & Multi-Cam Editing",
          "Short-Form Reels, TikToks & Shorts",
          "Event Videos & Recaps",
          "Color Grading & Sound Mixing",
        ],
      },
      {
        id: "motion-graphics",
        number: "02",
        title: "Motion Graphics",
        slug: "motion-graphics",
        shortCta: "Enquire about Motion Graphics",
        description:
          "Dynamic 2D and 3D motion design, product explainers, and animated visual systems.",
        deliverables: [
          "Product Explainers & 3D Renders",
          "Kinetic Typography & Social Motion",
          "Logo Animations & Brand Stingers",
          "UI Animation & Interactive Lottie Assets",
        ],
      },
      {
        id: "graphics-design",
        number: "03",
        title: "Graphics Design",
        slug: "graphics-design",
        shortCta: "Enquire about Graphics Design",
        description:
          "Commercial graphic design, digital marketing collateral, and high-impact brand creative.",
        deliverables: [
          "Social Media Content Systems",
          "Pitch Decks & Presentation Design",
          "Digital Display & Out-Of-Home Creative",
          "Infographics & Brand Illustration",
        ],
      },
      {
        id: "video-production",
        number: "04",
        title: "Video Production",
        slug: "video-production",
        shortCta: "Enquire about Video Production",
        description:
          "Full-service video production from pre-production scripting to on-location cinematography.",
        deliverables: [
          "Commercials & Brand Story Films",
          "Founder Stories & Case Study Shoots",
          "Product Launch & Demo Cinematography",
          "Studio Lighting & Multi-Cam Crew",
        ],
      },
      {
        id: "commercial-photography",
        number: "05",
        title: "Commercial Photography",
        slug: "commercial-photography",
        shortCta: "Enquire about Photography",
        description:
          "Commercial product photography, editorial executive portraits, and lifestyle imagery.",
        deliverables: [
          "Studio & E-Commerce Product Stills",
          "Executive Headshots & Team Portraits",
          "Architectural & Workspace Photography",
          "High-End Retouching & Compositing",
        ],
      },
    ],
  },

  digital: {
    headerLeft: "CAPABILITIES & DELIVERABLES",
    headerRight: "05 SERVICE LINES / DIVISION 03",
    headlineLine1: "The engineering behind",
    headlineLine2: "every digital product.",
    description:
      "From bespoke web applications to intuitive UI/UX design, explore the digital products and engineering capabilities within our studio.",
    registerLabel: "SERVICE REGISTER",
    registerRange: "01 — 05",
    signatureLeft: "EXPERIENCE / ENGINEERING / SCALE",
    services: [
      {
        id: "custom-web-development",
        number: "01",
        title: "Custom Web Development",
        slug: "custom-web-development",
        shortCta: "Enquire about Web Development",
        description:
          "High-performance websites and full-stack web platforms engineered with Next.js and TypeScript.",
        deliverables: [
          "Next.js & React Web Applications",
          "Tailwind CSS & Headless CMS Integration",
          "API Architecture & Microservices",
          "Performance Optimization & Web Vitals",
        ],
      },
      {
        id: "technical-seo",
        number: "02",
        title: "Technical SEO",
        slug: "technical-seo",
        shortCta: "Enquire about Technical SEO",
        description:
          "Deep technical infrastructure audits, schema architecture, and Core Web Vitals optimization.",
        deliverables: [
          "Core Web Vitals Remediation",
          "Structured Data & Schema Graph",
          "Crawl Budget & Sitemap Architecture",
          "Server-Side Rendering & Indexation",
        ],
      },
      {
        id: "uiux-design",
        number: "03",
        title: "UI/UX Design",
        slug: "uiux-design",
        shortCta: "Enquire about UI/UX Design",
        description:
          "User-centered interface design, design systems, and responsive digital product flows.",
        deliverables: [
          "Design Systems & Token Architecture",
          "Interactive Prototypes & Wireframing",
          "User Journey Mapping & Testing",
          "Design-to-Code Component Specs",
        ],
      },
      {
        id: "browser-web-extensions",
        number: "04",
        title: "Browser Web Extensions",
        slug: "browser-web-extensions",
        shortCta: "Enquire about Extensions",
        description:
          "Custom Chrome and cross-browser extensions built to streamline user workflows and automate actions.",
        deliverables: [
          "Manifest V3 Chrome Extensions",
          "Cross-Browser Compatibility (Edge/Firefox)",
          "Secure Background APIs & Auth Storage",
          "Web Store Publishing & Release Pipeline",
        ],
      },
      {
        id: "dadv-dashboards",
        number: "05",
        title: "DADV (Dashboards & Analytics)",
        slug: "dadv-dashboards",
        shortCta: "Enquire about DADV",
        description:
          "Dashboards, Data Analytics & Visualization portals engineered for operational clarity and decision-making.",
        deliverables: [
          "Interactive React & D3 Data Charts",
          "Real-Time Operational Dashboards",
          "Role-Based Access & Team Permissions",
          "PostgreSQL & Data Warehouse Connectors",
        ],
      },
    ],
  },

  ai: {
    headerLeft: "CAPABILITIES & DELIVERABLES",
    headerRight: "04 SERVICE LINES / DIVISION 04",
    headlineLine1: "The systems behind",
    headlineLine2: "every intelligent workflow.",
    description:
      "From production chatbots to autonomous calling agents and workflow automation, explore our AI capabilities.",
    registerLabel: "SERVICE REGISTER",
    registerRange: "01 — 04",
    signatureLeft: "INTELLIGENCE / AUTOMATION / IMPACT",
    services: [
      {
        id: "production-chatbots",
        number: "01",
        title: "Production Chatbots",
        slug: "production-chatbots",
        shortCta: "Enquire about Chatbots",
        description:
          "Context-aware AI chatbots powered by RAG and custom knowledge bases integrated with your CRM and support channels.",
        deliverables: [
          "RAG & Knowledge Base Ingestion",
          "Multi-Channel Deployment (Web, WhatsApp, Slack)",
          "Hallucination Guardrails & Fallback Triage",
          "Analytics & Conversation History Audit",
        ],
      },
      {
        id: "ai-calling-agents",
        number: "02",
        title: "AI Calling Agents",
        slug: "ai-calling-agents",
        shortCta: "Enquire about Calling Agents",
        description:
          "Ultra-low-latency voice AI agents capable of handling inbound inquiries, scheduling appointments, and outbound follow-ups.",
        deliverables: [
          "Natural Voice Synthesis & Dynamic Scripts",
          "Real-Time Twilio & SIP Trunk Integration",
          "Call Recording, Transcription & Sentiment",
          "Live Calendar Booking & CRM Injection",
        ],
      },
      {
        id: "autonomous-ai-agents",
        number: "03",
        title: "Autonomous AI Agents",
        slug: "autonomous-ai-agents",
        shortCta: "Enquire about AI Agents",
        description:
          "Task-oriented autonomous agents designed to research, draft, analyze data, and execute complex business workflows.",
        deliverables: [
          "Multi-Agent Orchestration & Tool Calling",
          "Automated Research & Synthesis Pipelines",
          "Human-in-the-Loop Approval Interfaces",
          "Audit Logging & Operational Monitoring",
        ],
      },
      {
        id: "n8n-workflow-automation",
        number: "04",
        title: "n8n Workflow Automation",
        slug: "n8n-workflow-automation",
        shortCta: "Enquire about n8n Automation",
        description:
          "Custom self-hosted n8n pipelines connecting your tools, automating repetitive manual copy-pasting, and syncing operational data.",
        deliverables: [
          "Self-Hosted n8n Instance Setup & Security",
          "Custom Webhooks & REST API Integrations",
          "Automated Lead Routing & Invoicing Flows",
          "Failure Alerts & Self-Healing Retries",
        ],
      },
    ],
  },
};
