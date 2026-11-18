export type WorkflowStageId = "discover" | "define" | "create" | "deliver";

export interface WorkflowStageSpec {
  id: WorkflowStageId;
  stepNumber: "01" | "02" | "03" | "04";
  tabLabel: string;
  badgeLabel: string;
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  deliverables: readonly string[];
  metrics: readonly { label: string; value: string }[];
  tags: readonly string[];
}

export const WORKFLOW_STAGES: readonly WorkflowStageSpec[] = [
  {
    id: "discover",
    stepNumber: "01",
    tabLabel: "Discover",
    badgeLabel: "01 / RESEARCH & INTELLIGENCE",
    title: "Deconstruct the problem. Map the breakthrough.",
    subtitle: "Research, Domain Intelligence & Feasibility",
    duration: "Week 01 – 02",
    description:
      "We dive deep into your operating environment, competitor landscape, and technical constraints to uncover hidden leverage before committing to code or production.",
    deliverables: [
      "Competitive Intelligence & Positioning Dossier",
      "Technical Architecture Feasibility Matrix",
      "User Journeys & Measurable Metric Alignment",
    ],
    metrics: [
      { label: "Parameters Audited", value: "48+" },
      { label: "Domain Clarity", value: "100%" },
      { label: "Risk Mitigation", value: "High" },
    ],
    tags: ["DOMAIN INTEL", "AUDIT", "POSITIONING", "OPPORTUNITY MATRIX"],
  },
  {
    id: "define",
    stepNumber: "02",
    tabLabel: "Define",
    badgeLabel: "02 / SYSTEM ARCHITECTURE",
    title: "Architect the solution. Eliminate ambiguity.",
    subtitle: "System Design, Wireframes & API Specifications",
    duration: "Week 02 – 04",
    description:
      "We turn raw requirements into precise specifications: interactive high-fidelity prototypes, component design tokens, data models, and API orchestration contracts.",
    deliverables: [
      "Full-Funnel Interactive Prototypes & UI System",
      "Database Schemas & API Integration Specs",
      "Autonomous Workflow & Agentic Blueprints",
    ],
    metrics: [
      { label: "Spec Coverage", value: "100%" },
      { label: "Prototype Fidelity", value: "Interactive" },
      { label: "Tech Stack", value: "Modular" },
    ],
    tags: ["ARCHITECTURE", "UI/UX DESIGN", "SCHEMAS", "PROTOTYPES"],
  },
  {
    id: "create",
    stepNumber: "03",
    tabLabel: "Create",
    badgeLabel: "03 / RAPID PRODUCTION",
    title: "Build across disciplines in synchronized sprints.",
    subtitle: "Brand, Code, Media & AI Working in Parallel",
    duration: "Week 04 – 08",
    description:
      "Rather than handing off between siloed agencies, our integrated studio executes simultaneously: engineers write production code, media editors produce cinematic assets, and AI specialists tune agent runtimes.",
    deliverables: [
      "Production-Ready Frontend & Backend Codebases",
      "Cinematic Media, Motion & Commercial Assets",
      "Trained Agentic Workflows & Tool Call Integrations",
    ],
    metrics: [
      { label: "Sprint Velocity", value: "2x Agility" },
      { label: "Discipline Synergy", value: "Unified" },
      { label: "Code Quality", value: "Type-Safe" },
    ],
    tags: ["FULL-STACK CODE", "MEDIA PRODUCTION", "AI AGENTS", "SPRINTS"],
  },
  {
    id: "deliver",
    stepNumber: "04",
    tabLabel: "Deliver",
    badgeLabel: "04 / DEPLOYMENT & OWNERSHIP",
    title: "Deploy with confidence. Own everything.",
    subtitle: "Production Deployment, Runbooks & Complete IP Transfer",
    duration: "Week 08+",
    description:
      "We deploy to your production infrastructure with automated CI/CD pipelines, complete documentation, and 100% intellectual property transfer. No vendor lock-in. Built to be yours.",
    deliverables: [
      "Automated CI/CD Deployment & Telemetry Setup",
      "Comprehensive Operational Runbooks & Training",
      "100% Source Code & Intellectual Property Handover",
    ],
    metrics: [
      { label: "Code Ownership", value: "100% Yours" },
      { label: "Vendor Lock-in", value: "Zero" },
      { label: "Launch Status", value: "Production" },
    ],
    tags: ["DEPLOYMENT", "CI/CD", "100% IP HANDOVER", "ZERO LOCK-IN"],
  },
] as const;
