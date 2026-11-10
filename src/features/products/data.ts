import { HybridProduct } from "@/types";

export const HYBRID_PRODUCTS_DATA: HybridProduct[] = [
  {
    id: "prod-1",
    slug: "ediyrex-agent-core",
    name: "AgentCore Orchestrator",
    tagline: "Autonomous multi-agent execution framework with verifiable audit logs.",
    description: "An internal platform incubated from our enterprise automation client engagements, packaging re-usable agent hierarchies, vector RAG memory, and human-in-the-loop review guards.",
    status: "beta",
    division: "ai",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "FastAPI", "Vector Embeddings"],
  },
  {
    id: "prod-2",
    slug: "vocalis-voice-runtime",
    name: "Vocalis Voice Runtime",
    tagline: "Ultra-low-latency real-time voice streaming gateway for inbound customer operations.",
    description: "Bridges telephony providers (SIP/Twilio) directly with streaming LLMs and neural voice engines, engineered for responsive conversational pacing.",
    status: "alpha",
    division: "hybrid",
    techStack: ["WebRTC", "Node.js", "LiveKit", "Whisper", "PostgreSQL"],
  },
  {
    id: "prod-3",
    slug: "renderflow-asset-studio",
    name: "RenderFlow",
    tagline: "Programmatic short-form video batch generator for high-velocity brands.",
    description: "Automates multi-aspect vertical video reformatting, automated caption styling, and brand asset stamping across hundreds of video variants in parallel.",
    status: "research",
    division: "media",
    techStack: ["FFmpeg", "Next.js", "Tailwind CSS", "Cloudinary"],
  },
];
