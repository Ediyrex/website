export interface PmsProjectTemplate {
  key: string;
  name: string;
  serviceInterest: string;
  description: string;
  milestones: Array<{ title: string; offsetDays: number }>;
  tasks: Array<{
    title: string;
    workflowStatus: "backlog" | "todo" | "in_progress" | "in_review" | "done";
    priority: "low" | "medium" | "high" | "urgent";
    labels: string[];
    offsetDays: number;
    estimatedMinutes: number;
    subtasks?: string[];
  }>;
}

export const PMS_PROJECT_TEMPLATES: PmsProjectTemplate[] = [
  {
    key: "blank",
    name: "Blank Project",
    serviceInterest: "Studio Delivery",
    description: "Start cleanly with no pre-populated tasks or milestones.",
    milestones: [],
    tasks: [],
  },
  {
    key: "brand_identity",
    name: "Brand Identity",
    serviceInterest: "Branding / Marketing",
    description:
      "Complete brand strategy, visual direction, typography, logo suite, and brand guidelines.",
    milestones: [
      { title: "Brand Discovery", offsetDays: 5 },
      { title: "Identity & Visual Direction", offsetDays: 12 },
      { title: "Brand Assets & Logo Suite", offsetDays: 18 },
      { title: "Final Guidelines Delivery", offsetDays: 24 },
    ],
    tasks: [
      {
        title: "Competitive brand analysis & audit",
        workflowStatus: "todo",
        priority: "medium",
        labels: ["Research", "Strategy"],
        offsetDays: 3,
        estimatedMinutes: 240,
      },
      {
        title: "Create visual moodboards & direction",
        workflowStatus: "todo",
        priority: "high",
        labels: ["Design", "Branding"],
        offsetDays: 7,
        estimatedMinutes: 360,
        subtasks: [
          "Collect visual references",
          "Define color & typography pairings",
          "Prepare client presentation deck",
        ],
      },
      {
        title: "Logo refinement & lockup variations",
        workflowStatus: "backlog",
        priority: "high",
        labels: ["Design", "Branding"],
        offsetDays: 15,
        estimatedMinutes: 480,
        subtasks: [
          "Refine primary mark",
          "Create horizontal & stacked versions",
          "Export SVG, PNG & monochrome marks",
        ],
      },
      {
        title: "Compile brand book & asset package",
        workflowStatus: "backlog",
        priority: "medium",
        labels: ["Deliverable"],
        offsetDays: 22,
        estimatedMinutes: 300,
      },
    ],
  },
  {
    key: "website_development",
    name: "Website Development",
    serviceInterest: "Web Dev",
    description:
      "End-to-end UX architecture, UI design, frontend/backend build, QA, and launch.",
    milestones: [
      { title: "Sitemap & Wireframes", offsetDays: 5 },
      { title: "UI Design System", offsetDays: 12 },
      { title: "Staging Build & CMS Setup", offsetDays: 21 },
      { title: "QA & Production Launch", offsetDays: 28 },
    ],
    tasks: [
      {
        title: "Information architecture & page wireframes",
        workflowStatus: "todo",
        priority: "high",
        labels: ["UX", "Architecture"],
        offsetDays: 4,
        estimatedMinutes: 360,
      },
      {
        title: "High-fidelity UI & responsive prototypes",
        workflowStatus: "backlog",
        priority: "high",
        labels: ["UI", "Web"],
        offsetDays: 10,
        estimatedMinutes: 600,
      },
      {
        title: "Next.js build, CMS wiring & animations",
        workflowStatus: "backlog",
        priority: "high",
        labels: ["Engineering", "Web"],
        offsetDays: 19,
        estimatedMinutes: 960,
      },
      {
        title: "Cross-browser QA, SEO & Core Web Vitals",
        workflowStatus: "backlog",
        priority: "medium",
        labels: ["QA", "Launch"],
        offsetDays: 26,
        estimatedMinutes: 240,
      },
    ],
  },
  {
    key: "video_production",
    name: "Video Production",
    serviceInterest: "Media",
    description:
      "Concept scripting, storyboard, shoot/render production, editing, color grade, and exports.",
    milestones: [
      { title: "Script & Storyboard", offsetDays: 4 },
      { title: "Production / Shoot", offsetDays: 10 },
      { title: "First Cut & Sound Design", offsetDays: 16 },
      { title: "Final Master & Social Cuts", offsetDays: 21 },
    ],
    tasks: [
      {
        title: "Creative treatment, script & shot list",
        workflowStatus: "todo",
        priority: "high",
        labels: ["Pre-Production", "Script"],
        offsetDays: 4,
        estimatedMinutes: 300,
      },
      {
        title: "Rough assembly & narrative cut",
        workflowStatus: "backlog",
        priority: "high",
        labels: ["Editing", "Video"],
        offsetDays: 14,
        estimatedMinutes: 480,
      },
      {
        title: "Motion graphics, VFX & sound mix",
        workflowStatus: "backlog",
        priority: "medium",
        labels: ["Motion", "Audio"],
        offsetDays: 18,
        estimatedMinutes: 360,
      },
    ],
  },
  {
    key: "social_media_campaign",
    name: "Social Media Campaign",
    serviceInterest: "Branding / Marketing",
    description:
      "Monthly campaign calendar, creative batching, copywriting, and rollout.",
    milestones: [
      { title: "Campaign Pillars & Calendar", offsetDays: 3 },
      { title: "Creative Asset Batch", offsetDays: 10 },
      { title: "Launch & Analytics Review", offsetDays: 20 },
    ],
    tasks: [
      {
        title: "Define campaign messaging & hooks",
        workflowStatus: "todo",
        priority: "medium",
        labels: ["Strategy", "Copy"],
        offsetDays: 3,
        estimatedMinutes: 180,
      },
      {
        title: "Design carousels, reels covers & ad variants",
        workflowStatus: "backlog",
        priority: "high",
        labels: ["Creative", "Social"],
        offsetDays: 9,
        estimatedMinutes: 420,
      },
    ],
  },
  {
    key: "ai_agent_development",
    name: "AI Agent Development",
    serviceInterest: "Agents & Automation",
    description:
      "Workflow discovery, agent architecture, prompt/tool integration, guardrails, and deployment.",
    milestones: [
      { title: "Workflow Audit & Architecture", offsetDays: 5 },
      { title: "Agent Build & Tool Wiring", offsetDays: 14 },
      { title: "Eval Suite & Production Handoff", offsetDays: 22 },
    ],
    tasks: [
      {
        title: "Map automation triggers, APIs & edge cases",
        workflowStatus: "todo",
        priority: "high",
        labels: ["AI", "Architecture"],
        offsetDays: 4,
        estimatedMinutes: 300,
      },
      {
        title: "Implement agent workflow & verification evals",
        workflowStatus: "backlog",
        priority: "high",
        labels: ["AI", "Engineering"],
        offsetDays: 13,
        estimatedMinutes: 720,
      },
    ],
  },
  {
    key: "general_creative",
    name: "General Creative Project",
    serviceInterest: "Studio Delivery",
    description: "Flexible creative sprint setup with kickoff, execution, review, and handoff.",
    milestones: [
      { title: "Kickoff & Brief Lock", offsetDays: 3 },
      { title: "Concept Review", offsetDays: 10 },
      { title: "Final Handoff", offsetDays: 18 },
    ],
    tasks: [
      {
        title: "Finalize project brief & deliverable checklist",
        workflowStatus: "todo",
        priority: "medium",
        labels: ["Planning"],
        offsetDays: 3,
        estimatedMinutes: 120,
      },
    ],
  },
];

export function getPmsTemplate(key?: string | null): PmsProjectTemplate {
  return (
    PMS_PROJECT_TEMPLATES.find((t) => t.key === key) ??
    PMS_PROJECT_TEMPLATES[0]
  );
}

