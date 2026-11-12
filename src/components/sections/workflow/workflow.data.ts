export type WorkflowStageId =
  | "intro"
  | "discover"
  | "define"
  | "create"
  | "deliver"
  | "outro";

export interface WorkflowStageSpec {
  id: WorkflowStageId;
  railIndex: string;
  label: string;
  rangeLabel: string;
  minProgress: number;
  maxProgress: number;
  targetProgress: number;
  railDescription: string;
  counter?: string;
  title: string;
  description: string;
  keywords: readonly string[];
  storyboardSubtitle?: string;
}

export const WORKFLOW_STAGES: readonly WorkflowStageSpec[] = [
  {
    id: "intro",
    railIndex: "Intro",
    label: "Intro",
    rangeLabel: "0–10%",
    minProgress: 0,
    maxProgress: 0.1,
    targetProgress: 0.04,
    railDescription: "Editorial headline, context and scroll cue.",
    counter: "00 / 04",
    title: "Blueprint Evolution",
    description:
      "Watch a single system evolve continuously from initial points and research insights into a finished architectural solution.",
    keywords: ["DISCOVERY", "ARCHITECTURE", "EXECUTION", "DELIVERY"],
  },
  {
    id: "discover",
    railIndex: "01",
    label: "Discover",
    rangeLabel: "10–35%",
    minProgress: 0.1,
    maxProgress: 0.35,
    targetProgress: 0.23,
    railDescription: "Initial insights and problem space emerge as points.",
    counter: "01 / 04",
    title: "Discover",
    description:
      "Understand the business, audience, challenges and opportunities before choosing a direction.",
    keywords: ["RESEARCH", "INSIGHTS", "OPPORTUNITY"],
    storyboardSubtitle: "Points & Insights",
  },
  {
    id: "define",
    railIndex: "02",
    label: "Define",
    rangeLabel: "35–60%",
    minProgress: 0.35,
    maxProgress: 0.6,
    targetProgress: 0.48,
    railDescription: "Structure, scope and plan take shape with a blueprint.",
    counter: "02 / 04",
    title: "Define",
    description:
      "Turn insights into a clear plan, scope, architecture and measurable goals.",
    keywords: ["PLANNING", "ARCHITECTURE", "ROADMAP"],
    storyboardSubtitle: "Structure & Plan",
  },
  {
    id: "create",
    railIndex: "03",
    label: "Create",
    rangeLabel: "60–85%",
    minProgress: 0.6,
    maxProgress: 0.85,
    targetProgress: 0.73,
    railDescription: "Modules form, gain depth and come together cleanly.",
    counter: "03 / 04",
    title: "Create",
    description:
      "Design, develop, produce and integrate the solution through transparent checkpoints.",
    keywords: ["DESIGN", "DEVELOPMENT", "INTEGRATION"],
    storyboardSubtitle: "Build & Integrate",
  },
  {
    id: "deliver",
    railIndex: "04",
    label: "Deliver",
    rangeLabel: "85–100%",
    minProgress: 0.85,
    maxProgress: 1.0,
    targetProgress: 0.92,
    railDescription: "A complete, proven solution ready for launch.",
    counter: "04 / 04",
    title: "Deliver",
    description:
      "Launch, hand over and ensure a smooth path forward with documentation and ongoing support.",
    keywords: ["LAUNCH", "OPTIMIZATION", "SUPPORT"],
    storyboardSubtitle: "Complete Solution",
  },
  {
    id: "outro",
    railIndex: "Outro",
    label: "Transition",
    rangeLabel: "100%",
    minProgress: 0.96,
    maxProgress: 1.01,
    targetProgress: 0.98,
    railDescription: "Final milestone leading into your studio engagement.",
    counter: "04 / 04",
    title: "Deliver",
    description:
      "Complete architectural delivery, production documentation, and ongoing evolution.",
    keywords: ["PRODUCTION READY", "HANDOVER", "SCALE"],
  },
];

export const CORE_STORYBOARD_STAGES = WORKFLOW_STAGES.filter(
  (s) =>
    s.id === "discover" ||
    s.id === "define" ||
    s.id === "create" ||
    s.id === "deliver"
);

export function getStageForProgress(progress: number): WorkflowStageSpec {
  if (progress < 0.1) return WORKFLOW_STAGES[0];
  if (progress < 0.35) return WORKFLOW_STAGES[1];
  if (progress < 0.6) return WORKFLOW_STAGES[2];
  if (progress < 0.85) return WORKFLOW_STAGES[3];
  if (progress < 0.96) return WORKFLOW_STAGES[4];
  return WORKFLOW_STAGES[5];
}

