import { ServiceDivision } from '../types'

export const SERVICES_DATA: ServiceDivision[] = [
  {
    id: 'media',
    title: 'Media & Production',
    headline: 'Cinematic Visuals Engineered to Captivate',
    lead: 'We translate brand propositions into cinema-grade visual narratives, high-impact commercials, and meticulous 3D motion assets that hold viewer attention.',
    accentColor: '#D6B77A',
    services: [
      {
        id: 'brand-commercials',
        title: 'Brand Commercials & Hero Films',
        description:
          'End-to-end film production from treatment scripting, casting, on-location cinematography, through to calibrated colour grading and theatrical master output.',
        deliverables: [
          'Master 4K/6K Video Files',
          'Platform-Optimised Cutdowns (16:9, 9:16, 1:1)',
          'High-Resolution Production Stills',
          'Licensed Audio Master & Sound Mix',
        ],
        tools: ['RED / ARRI Cinema Cameras', 'DaVinci Resolve Studio', 'Pro Tools'],
      },
      {
        id: 'motion-3d',
        title: '3D Motion Design & Visual Effects',
        description:
          'High-concept product visualisations, abstract 3D spatial sequences, and interface motion graphics engineered for tech hardware, SaaS, and forward-looking brands.',
        deliverables: [
          'Hyper-Real 3D Product Renders',
          'Exploded Tech & Architectural Animations',
          'Interactive WebGL/Lottie Assets',
          'Design System Motion Tokens',
        ],
        tools: ['Cinema 4D', 'Blender', 'Houdini', 'Octane / Redshift', 'After Effects'],
      },
      {
        id: 'content-systems',
        title: 'Editorial & Campaign Content Engines',
        description:
          'Systematic creative assets built for ongoing brand campaigns, social narratives, founder keynotes, and product announcement launches.',
        deliverables: [
          'Multi-Channel Content Bundles',
          'Short-Form Episodic Video Series',
          'Keynote & Event Background Visuals',
          'Content Style Guidelines',
        ],
        tools: ['Figma', 'Premiere Pro', 'Midjourney (Pre-vis)', 'Photoshop'],
      },
    ],
    faq: [
      {
        question: 'Do you manage both domestic (India) and international production shoots?',
        answer:
          'Yes. We handle on-ground productions across India as well as remote international creative direction, with trusted production crew networks globally.',
      },
      {
        question: 'What is the typical timeline for a hero brand film?',
        answer:
          'Standard productions range from 4 to 8 weeks depending on script development, casting, shoot logistics, and visual effects complexity.',
      },
    ],
  },
  {
    id: 'digital',
    title: 'Digital Experiences',
    headline: 'Web Applications & Systems Built with Precision',
    lead: 'We design and engineer bespoke web platforms, software applications, and SaaS architectures prioritizing velocity, security, and refined aesthetic standards.',
    accentColor: '#7AB4D6',
    services: [
      {
        id: 'custom-web-apps',
        title: 'Full-Stack Web & SaaS Applications',
        description:
          'Modern responsive web apps architected with Next.js, TypeScript, PostgreSQL, and scalable API layers built for reliability and frictionless user interaction.',
        deliverables: [
          'Clean Next.js Monorepo Codebase',
          'Custom Authentication & Authorization RBAC',
          'REST / GraphQL API Layer',
          'Comprehensive End-to-End Type Safety',
        ],
        tools: ['Next.js 15', 'React 19', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
      },
      {
        id: 'conversion-platforms',
        title: 'Flagship Marketing Websites & Portals',
        description:
          'High-converting editorial digital experiences designed to showcase high-value products, recruit talent, and convert prospective clients.',
        deliverables: [
          'Sub-Second Core Web Vitals Performance',
          'Headless CMS or Custom Management Backend',
          'Advanced SEO & Social Metadata Scaffolding',
          'Rich Micro-Interactions & Fluid Transitions',
        ],
        tools: ['Next.js App Router', 'Framer Motion', 'Tailwind CSS', 'Vercel / Cloudflare'],
      },
      {
        id: 'uiux-systems',
        title: 'Product UI/UX & Design Systems',
        description:
          'Systematic user experience architecture, wireframing, high-fidelity prototypes, and component design tokens designed to align design with engineering.',
        deliverables: [
          'Figma Component Library & Token Spec',
          'Clickable Interactive Prototypes',
          'Accessibility (WCAG AA) Compliance Review',
          'Developer Handoff Documentation',
        ],
        tools: ['Figma', 'Tokens Studio', 'Zeroheight', 'Storybook'],
      },
    ],
    faq: [
      {
        question: 'How do you handle technical handoffs and client code ownership?',
        answer:
          'You retain 100% intellectual property and code ownership. All repositories, deployment configurations, and design files are transferred cleanly upon completion.',
      },
      {
        question: 'Can you work with our existing backend or engineering team?',
        answer:
          'Absolutely. We frequently collaborate with in-house technical teams, building frontend layers against established REST/GraphQL endpoints or augmenting product engineering.',
      },
    ],
  },
  {
    id: 'ai',
    title: 'Artificial Intelligence & Automation',
    headline: 'Intelligent Systems That Expand Operating Capability',
    lead: 'We design and implement custom AI agents, automated workflow pipelines, conversational interfaces, and proprietary cognitive systems that multiply business productivity.',
    accentColor: '#A47AD6',
    services: [
      {
        id: 'autonomous-agents',
        title: 'Autonomous Business AI Agents',
        description:
          'Custom autonomous agents capable of performing multi-step reasoning, executing CRM actions, managing project intake, and conducting research.',
        deliverables: [
          'Deterministic Tool-Calling Architecture',
          'Secure Sandbox Execution Environment',
          'Audit Log & Decision Tracing Dashboard',
          'Fail-Safe Human-in-the-Loop Safeguards',
        ],
        tools: ['LangChain / LlamaIndex', 'Python', 'FastAPI', 'Node.js', 'OpenAI / Claude API'],
      },
      {
        id: 'voice-conversational',
        title: 'Voice Receptionists & Conversational Bots',
        description:
          'Ultra-low-latency voice agents and intelligent concierge bots handling client enquiries, call booking, customer onboarding, and tier-1 support.',
        deliverables: [
          'Sub-500ms Latency Speech-to-Speech Engine',
          'Telephony Bridge (Twilio / WebRTC)',
          'Real-Time CRM & Calendar Synchronization',
          'Custom Prompt Persona & Boundary Tuning',
        ],
        tools: ['Deepgram', 'Cartesia / ElevenLabs', 'LiveKit', 'Twilio'],
      },
      {
        id: 'rag-knowledge',
        title: 'Enterprise Knowledge Systems (RAG)',
        description:
          'Internal search and cognitive retrieval engines that connect LLMs to your private documentation, legal contracts, repositories, and operational databases.',
        deliverables: [
          'Semantic Vector Search Pipeline',
          'Automated Document Chunking & Ingestion',
          'Source Citation Verification',
          'Access Control & Privacy Boundary Enforcement',
        ],
        tools: ['pgvector', 'Pinecone / Qdrant', 'Unstructured', 'Hybrid Search'],
      },
    ],
    faq: [
      {
        question: 'How do you ensure enterprise data privacy and confidentiality with AI models?',
        answer:
          'We utilize zero-data-retention APIs and self-hosted open models where required. Your proprietary data is never used to train public foundation models.',
      },
      {
        question: 'How are voice agents tested for real-world accents and interruptions?',
        answer:
          'Our voice pipelines incorporate conversational turn-taking, acoustic noise suppression, and interruption detection (barge-in) tuned across multiple dialects.',
      },
    ],
  },
]

