export interface FaqQuestion {
  id: string;
  number: string;
  question: string;
  answer: string;
}

export interface FaqCategoryData {
  id: string;
  number: string;
  title: string;
  questionCount: string;
  questions: FaqQuestion[];
}

export const FAQ_CATEGORIES: FaqCategoryData[] = [
  {
    id: "working-together",
    number: "01",
    title: "Working Together",
    questionCount: "03",
    questions: [
      {
        id: "what-can-i-build",
        number: "01",
        question: "What exactly can I build with EDYREX?",
        answer:
          "EDYREX brings together Branding & Marketing (including pitch decks and presentations), Media & Content Production (including content strategy and copywriting), Web, Apps & Digital Products (websites, UI/UX, mobile apps, SaaS, custom CRM, ERP, and AMC), and AI & Automation. Depending on your requirements, we can help with anything from brand identity to custom software and intelligent business systems.",
      },
      {
        id: "single-or-multiple-services",
        number: "02",
        question:
          "Can I commission just one service, or combine multiple divisions?",
        answer:
          "Yes. You can commission any individual capability—such as UI/UX design, pitch deck design, copywriting, a mobile app, or a workflow automation—independently. For larger goals, we can also combine multiple divisions under one coordinated engagement to deliver a more integrated solution.",
      },
      {
        id: "who-we-work-with",
        number: "03",
        question: "What types of businesses and teams do you work with?",
        answer:
          "We work with founders, startups, growing businesses, established companies, agencies, and creators. The engagement is shaped around the business problem, team structure, objectives, and scope rather than a fixed client template.",
      },
    ],
  },
  {
    id: "scope-and-investment",
    number: "02",
    title: "Scope & Investment",
    questionCount: "04",
    questions: [
      {
        id: "after-enquiry",
        number: "04",
        question: "What happens after I submit a project enquiry?",
        answer:
          "We review your enquiry to understand what you are trying to achieve. The next step is a conversation about your requirements, constraints and priorities. Once the scope is clear, we can prepare a suitable proposal outlining the deliverables, process and commercial terms.",
      },
      {
        id: "pricing-determined",
        number: "05",
        question: "How is project pricing determined?",
        answer:
          "Pricing depends on the scope of work, project complexity, required capabilities, integrations, deliverables and timeline. We assess these requirements before preparing a tailored quotation. The objective is to establish clear expectations before the engagement begins.",
      },
      {
        id: "typical-timeline",
        number: "06",
        question: "How long does a typical project take?",
        answer:
          "Timelines vary depending on the size and complexity of the project, feedback cycles, integrations and required deliverables. We establish milestones and an expected delivery schedule during the planning stage rather than applying one timeline to every project.",
      },
      {
        id: "existing-systems",
        number: "07",
        question: "Can you work with our existing team, website or systems?",
        answer:
          "Yes. We can coordinate with existing teams and work around suitable existing websites, applications, APIs, databases and business tools. We first review the current setup, access requirements and technical constraints to determine the best approach.",
      },
    ],
  },
  {
    id: "delivery-and-support",
    number: "03",
    title: "Delivery & Support",
    questionCount: "03",
    questions: [
      {
        id: "deliverable-ownership",
        number: "08",
        question: "Who owns the final deliverables, source files and code?",
        answer:
          "Deliverable ownership, licensing, source-file access and handover responsibilities are defined clearly in the project agreement. We prioritize maintainable deliverables and documented handovers so clients understand what they are receiving.",
      },
      {
        id: "ongoing-support",
        number: "09",
        question: "Do you provide ongoing maintenance, AMC and retainers?",
        answer:
          "Yes. We offer separately scoped Annual Maintenance Contracts (AMC) for websites, web and mobile apps, SaaS, CRM, and ERP systems—as well as monthly retainers for content, copywriting, marketing, and AI operations. Coverage, exclusions, and response arrangements are defined in each agreement.",
      },
      {
        id: "when-to-use-ai",
        number: "10",
        question: "When does it make sense to introduce AI or automation?",
        answer:
          "When a repetitive or time-consuming process can be improved through intelligent automation. We first understand the existing workflow, identify the actual bottleneck and evaluate whether AI is appropriate. We prioritize practical outcomes, human oversight and reliable system behaviour over introducing AI for its own sake.",
      },
    ],
  },
];

export const TOTAL_FAQ_COUNT = FAQ_CATEGORIES.reduce(
  (sum, category) => sum + category.questions.length,
  0,
);

