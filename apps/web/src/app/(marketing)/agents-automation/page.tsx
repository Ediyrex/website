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
    <div className="bg-[#08090B] min-h-screen text-[#F5F3EE] pt-[72px]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-b border-[#292929]/70">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="max-w-3xl">
            <p className="font-inter font-medium text-[10.5px] tracking-[2px] uppercase text-[#B5A0F5] mb-4">
              DIVISION 03 — AGENTS & AUTOMATION
            </p>
            <h1 className="font-manrope font-extrabold text-[42px] sm:text-[56px] lg:text-[68px] leading-[0.96] tracking-[-2.5px] uppercase mb-6">
              INTELLIGENT AGENTS.
              <br />
              <span className="text-[#B5A0F5]">AUTONOMOUS</span> WORKFLOWS.
            </h1>
            <p className="font-inter text-[#B2B4BA] text-[15px] sm:text-[16px] leading-relaxed max-w-2xl mb-8">
              We design and implement custom AI agents, automated workflow pipelines, and private knowledge systems. 
              Practical technology engineered to eliminate repetitive manual work, streamline lead qualification, and scale your business operations safely.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact?division=agents"
                className="inline-flex items-center justify-center gap-2 px-6 h-[42px] rounded-[10px] bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[12px] transition-colors"
              >
                <span>Automate Your Operations</span>
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>
              <Link
                href="/work?division=ai"
                className="inline-flex items-center gap-2 px-5 h-[42px] rounded-[10px] border border-[#3A414B] hover:border-[#F5F3EE] text-[#F5F3EE] font-inter font-medium text-[12px] transition-colors"
              >
                <span>View Automation Systems</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities Grid ── */}
      <section className="py-20 border-b border-[#292929]/60">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="font-inter font-medium text-[10px] tracking-[2px] uppercase text-[#777D87] mb-2">
                REAL-WORLD IMPLEMENTATION
              </p>
              <h2 className="font-manrope font-extrabold text-[32px] sm:text-[42px] leading-tight uppercase">
                AI & AUTOMATION SOLUTIONS
              </h2>
            </div>
            <p className="font-inter text-[#B2B4BA] text-[13.5px] max-w-md leading-relaxed">
              We do not sell vague AI hype. We build deterministic, monitored software systems that run in production with predictable outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_SERVICES.map((srv, idx) => {
              const Icon = srv.icon
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#B5A0F5]/50 transition-all duration-300 p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#141820] border border-[#252A32] flex items-center justify-center text-[#B5A0F5] mb-5 group-hover:scale-105 transition-transform">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-manrope font-bold text-[18px] uppercase text-[#F5F3EE] mb-2">
                      {srv.title}
                    </h3>
                    <p className="font-inter text-[#B2B4BA] text-[13px] leading-relaxed mb-6">
                      {srv.desc}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#1C2028]">
                    {srv.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-inter text-[#8C92A4] px-2.5 py-0.5 rounded-full border border-[#252A32]"
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
      <section className="py-20 border-b border-[#292929]/60">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="mb-14">
            <p className="font-inter font-medium text-[10px] tracking-[2px] uppercase text-[#777D87] mb-2">
              DISCIPLINE
            </p>
            <h2 className="font-manrope font-extrabold text-[32px] sm:text-[42px] leading-tight uppercase">
              HOW WE SHIP AGENTIC SYSTEMS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AGENT_WORKFLOW_STEPS.map((proc) => (
              <div
                key={proc.step}
                className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-6 relative"
              >
                <span className="font-mono text-[#B5A0F5] text-[13px] font-bold block mb-4">
                  {proc.step}
                </span>
                <h3 className="font-manrope font-bold text-[16px] text-[#F5F3EE] mb-2 uppercase">
                  {proc.name}
                </h3>
                <p className="font-inter text-[#B2B4BA] text-[12.5px] leading-relaxed">
                  {proc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Callout ── */}
      <section className="py-20 bg-[#0A0C0F]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 text-center">
          <h2 className="font-manrope font-extrabold text-[32px] sm:text-[46px] uppercase text-[#F5F3EE] mb-4">
            WHAT WORK SHOULD WE AUTOMATE FIRST?
          </h2>
          <p className="font-inter text-[#B2B4BA] text-[14px] max-w-lg mx-auto mb-8">
            Tell us about your team’s repetitive bottlenecks. We will evaluate feasibility and construct an autonomous proof of concept.
          </p>
          <Link
            href="/contact?division=agents"
            className="inline-flex items-center gap-2 px-7 h-[44px] rounded-[10px] bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[12px] uppercase tracking-wide transition-colors"
          >
            <span>Start an Automation Project</span>
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  )
}

