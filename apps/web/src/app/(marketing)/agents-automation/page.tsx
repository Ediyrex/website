import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Bot, Cpu, GitBranch, Network, FileText, PhoneCall, Workflow } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Agents & Intelligent Automation — EDIYREX®',
  description:
    'Custom AI agents, autonomous n8n workflows, RAG systems, and business process automation engineered to eliminate manual work and scale operations.',
}

const AI_SERVICES = [
  {
    icon: Bot,
    title: 'Custom AI Agents',
    desc: 'Autonomous agentic systems equipped with tools, memory, and validation checks to execute multi-step operational tasks without manual intervention.',
    tags: ['Tool Execution', 'Multi-Agent Teams', 'Structured Outputs'],
  },
  {
    icon: Workflow,
    title: 'n8n & Workflow Automation',
    desc: 'End-to-end event-driven workflows connecting your CRM, databases, payment gateways, Notion workspaces, and customer channels into one seamless pipeline.',
    tags: ['n8n Self-Hosted', 'Webhook Architecture', 'Error Fallbacks'],
  },
  {
    icon: Network,
    title: 'RAG & Private Knowledge Systems',
    desc: 'Retrieval-Augmented Generation connecting your internal documentation, SOPs, and research to state-of-the-art LLMs with verifiable citations.',
    tags: ['Vector Embeddings', 'Hybrid Search', 'Privacy First'],
  },
  {
    icon: PhoneCall,
    title: 'Voice & Conversational AI',
    desc: 'Low-latency natural language voice assistants and intelligent support bots that qualify leads, handle bookings, and resolve customer enquiries.',
    tags: ['Real-Time Audio', 'Inbound Screening', 'Calendar Sync'],
  },
  {
    icon: FileText,
    title: 'Document & Data Intelligence',
    desc: 'Automated ingestion, extraction, and validation of unstructured invoices, contracts, proposals, and briefs into clean database records.',
    tags: ['PDF Extraction', 'Schema Validation', 'Automated Audits'],
  },
  {
    icon: Cpu,
    title: 'Operational AI Strategy',
    desc: 'Deep audit of your business operations to identify high-leverage bottlenecks, assess AI feasibility, and build a phased automation roadmap.',
    tags: ['Process Mining', 'ROI Modeling', 'Security Guardrails'],
  },
]

const AGENT_WORKFLOW_STEPS = [
  {
    step: '01',
    name: 'Process Audit & Mapping',
    desc: 'We map your existing manual workflows, pinpoint redundant handoffs, and identify exact trigger-action automation points.',
  },
  {
    step: '02',
    name: 'Architecture & Tool Definition',
    desc: 'We design the agent prompt architecture, select the optimal models (OpenAI, Anthropic, local), and configure secure API tools.',
  },
  {
    step: '03',
    name: 'Implementation & Guardrails',
    desc: 'We build the n8n pipelines, embed schema validation, implement fallback loops, and enforce strict data privacy boundaries.',
  },
  {
    step: '04',
    name: 'Live Testing & Monitoring',
    desc: 'Rigorous edge-case testing, team onboarding, production deployment, and telemetry dashboards to track automation reliability.',
  },
]

export default function AgentsAutomationPage() {
  return (
    <div className="bg-[#0B0C10] min-h-screen text-[#EAEAEA] pt-[82px]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-b border-white/[0.08]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
              <p className="font-mono text-[10.5px] tracking-[2px] uppercase text-[#00E5FF]">
                DIVISION 03 // AGENTS &amp; AUTOMATION
              </p>
            </div>
            <h1 className="font-manrope font-semibold text-[42px] sm:text-[56px] lg:text-[68px] leading-[0.98] tracking-[-0.035em] text-[#00E5FF] mb-6 drop-shadow-[0_0_35px_rgba(0,229,255,0.15)]">
              INTELLIGENT AGENTS.
              <br />
              <span className="text-[#EAEAEA]">AUTONOMOUS WORKFLOWS.</span>
            </h1>
            <p className="font-inter text-[#999999] text-[15px] sm:text-[16px] leading-relaxed max-w-2xl mb-8">
              We design and implement custom AI agents, automated workflow pipelines, and private knowledge systems. 
              Practical technology engineered to eliminate repetitive manual work, streamline lead qualification, and scale your business operations safely.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact?division=agents"
                className="inline-flex items-center justify-center gap-2 px-6 h-[44px] rounded-md bg-[#39FF14] hover:bg-[#32e012] text-[#0B0C10] font-mono font-semibold text-[12px] uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(57,255,20,0.25)] group"
              >
                <span>Automate Your Operations</span>
                <ArrowUpRight size={14} className="text-[#0B0C10] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                href="/work?division=ai"
                className="inline-flex items-center gap-2 px-5 h-[44px] rounded-md border border-white/[0.15] hover:border-[#00E5FF] text-[#EAEAEA] hover:text-[#00E5FF] font-mono text-[12px] uppercase tracking-wider transition-colors"
              >
                <span>View Automation Systems</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities Grid ── */}
      <section className="py-20 border-b border-white/[0.08]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#00E5FF] mb-2">
                REAL-WORLD IMPLEMENTATION
              </p>
              <h2 className="font-manrope font-semibold text-[32px] sm:text-[42px] leading-tight text-[#00E5FF]">
                AI &amp; AUTOMATION SOLUTIONS
              </h2>
            </div>
            <p className="font-inter text-[#999999] text-[13.5px] max-w-md leading-relaxed">
              We do not sell vague AI hype. We build deterministic, monitored software systems that run in production with predictable outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_SERVICES.map((srv, idx) => {
              const Icon = srv.icon
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#12141A] border border-white/[0.08] hover:border-[#00E5FF]/40 transition-all duration-300 p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#0B0C10] border border-white/[0.08] flex items-center justify-center text-[#00E5FF] mb-5 group-hover:scale-105 transition-transform">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-manrope font-semibold text-[18px] text-[#EAEAEA] group-hover:text-[#00E5FF] transition-colors mb-2">
                      {srv.title}
                    </h3>
                    <p className="font-inter text-[#999999] text-[13px] leading-relaxed mb-6">
                      {srv.desc}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                    {srv.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-[#00E5FF] opacity-80 px-2.5 py-0.5 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Implementation Process ── */}
      <section className="py-20 border-b border-white/[0.08]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="mb-14">
            <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#00E5FF] mb-2">
              DISCIPLINE
            </p>
            <h2 className="font-manrope font-semibold text-[32px] sm:text-[42px] leading-tight text-[#00E5FF]">
              HOW WE SHIP AGENTIC SYSTEMS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AGENT_WORKFLOW_STEPS.map((proc) => (
              <div
                key={proc.step}
                className="rounded-xl bg-[#12141A] border border-white/[0.08] p-6 relative hover:border-[#00E5FF]/40 transition-colors"
              >
                <span className="font-mono text-[#00E5FF] text-[13px] font-bold block mb-4">
                  {proc.step}
                </span>
                <h3 className="font-manrope font-semibold text-[16px] text-[#EAEAEA] mb-2">
                  {proc.name}
                </h3>
                <p className="font-inter text-[#999999] text-[12.5px] leading-relaxed">
                  {proc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Callout ── */}
      <section className="py-20 bg-[#0B0C10]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 text-center">
          <h2 className="font-manrope font-semibold text-[32px] sm:text-[46px] text-[#00E5FF] mb-4">
            WHAT WORK SHOULD WE AUTOMATE FIRST?
          </h2>
          <p className="font-inter text-[#999999] text-[14px] max-w-lg mx-auto mb-8">
            Tell us about your team’s repetitive bottlenecks. We will evaluate feasibility and construct an autonomous proof of concept.
          </p>
          <Link
            href="/contact?division=agents"
            className="inline-flex items-center gap-2 px-7 h-[44px] rounded-md bg-[#39FF14] hover:bg-[#32e012] text-[#0B0C10] font-mono font-semibold text-[12px] uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(57,255,20,0.25)] group"
          >
            <span>Start an Automation Project</span>
            <ArrowUpRight size={14} className="text-[#0B0C10] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
