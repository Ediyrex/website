import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Code2, Layout, Database, ShieldCheck, Gauge, Layers, Cpu } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Web & Digital Engineering — EDIYREX®',
  description:
    'Modern, scalable web applications, bespoke digital platforms, and high-performance websites engineered with React, Next.js, and TypeScript.',
}

const WEB_SERVICES = [
  {
    icon: Layout,
    title: 'Modern Web Applications & SaaS',
    desc: 'Complex, performant web platforms built with React, Next.js App Router, and TypeScript designed for scale, speed, and clean maintenance.',
    tags: ['Next.js 15', 'TypeScript', 'React Server Components'],
  },
  {
    icon: Code2,
    title: 'Custom Brand & Editorial Websites',
    desc: 'Bespoke marketing and studio sites with fluid responsive typography, micro-interactions, and cinematic dark editorial aesthetics.',
    tags: ['Tailwind CSS', 'Framer Motion', 'Pixel Perfection'],
  },
  {
    icon: Gauge,
    title: 'High-Conversion Landing Pages',
    desc: 'Laser-focused landing pages engineered for speed, sub-second LCP, zero layout shifts, and measurable visitor conversion.',
    tags: ['Core Web Vitals', 'CRO Architecture', 'A/B Testing'],
  },
  {
    icon: Database,
    title: 'Business Dashboards & Internal Tools',
    desc: 'Data-dense, intuitive administration panels and workflow hubs with role-based access control, analytics, and operational automation.',
    tags: ['PostgreSQL', 'REST & GraphQL APIs', 'RBAC Security'],
  },
  {
    icon: Layers,
    title: 'UI/UX Design & Design Systems',
    desc: 'Comprehensive Figma component architectures, design token specifications, accessible typography scales, and interactive prototypes.',
    tags: ['Design Systems', 'WCAG 2.2 AA', 'Figma Libraries'],
  },
  {
    icon: ShieldCheck,
    title: 'API Integrations & Custom Extensions',
    desc: 'Robust backend connections linking payment gateways, CRM engines, webhooks, authentication providers, and third-party SaaS tools.',
    tags: ['Stripe / Cal.com', 'Webhooks', 'Cloudflare Edge'],
  },
]

const TECH_STACK = [
  { category: 'Frontend', items: ['Next.js App Router', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Motion'] },
  { category: 'Backend & Data', items: ['Node.js', 'Express / Fastify', 'PostgreSQL', 'Prisma / Drizzle', 'Redis'] },
  { category: 'Infrastructure', items: ['Vercel', 'AWS / Cloudflare', 'Docker', 'Sentry Monitoring', 'CI/CD Pipelines'] },
]

export default function WebPage() {
  return (
    <div className="bg-[#08090B] min-h-screen text-[#F5F3EE] pt-[72px]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-b border-[#292929]/70">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="max-w-3xl">
            <p className="font-inter font-medium text-[10.5px] tracking-[2px] uppercase text-[#7BA9F5] mb-4">
              DIVISION 02 — WEB & DIGITAL
            </p>
            <h1 className="font-manrope font-extrabold text-[42px] sm:text-[56px] lg:text-[68px] leading-[0.96] tracking-[-2.5px] uppercase mb-6">
              SCALABLE DIGITAL EXPERIENCES.
              <br />
              <span className="text-[#7BA9F5]">ENGINEERED</span> FOR IMPACT.
            </h1>
            <p className="font-inter text-[#B2B4BA] text-[15px] sm:text-[16px] leading-relaxed max-w-2xl mb-8">
              We design and build modern digital products, responsive web applications, and high-performance online experiences. 
              Built with clean TypeScript architecture, accessible semantic code, and uncompromising aesthetic execution.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact?division=web"
                className="inline-flex items-center justify-center gap-2 px-6 h-[42px] rounded-[10px] bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[12px] transition-colors"
              >
                <span>Start a Web Project</span>
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>
              <Link
                href="/work?division=web"
                className="inline-flex items-center gap-2 px-5 h-[42px] rounded-[10px] border border-[#3A414B] hover:border-[#F5F3EE] text-[#F5F3EE] font-inter font-medium text-[12px] transition-colors"
              >
                <span>View Digital Work</span>
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
                CORE CAPABILITIES
              </p>
              <h2 className="font-manrope font-extrabold text-[32px] sm:text-[42px] leading-tight uppercase">
                WEB DEVELOPMENT & PRODUCT DESIGN
              </h2>
            </div>
            <p className="font-inter text-[#B2B4BA] text-[13.5px] max-w-md leading-relaxed">
              Every project is engineered for long-term scalability, strict type safety, and blazing fast performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEB_SERVICES.map((srv, idx) => {
              const Icon = srv.icon
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#7BA9F5]/50 transition-all duration-300 p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#141820] border border-[#252A32] flex items-center justify-center text-[#7BA9F5] mb-5 group-hover:scale-105 transition-transform">
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

      {/* ── Technology Architecture ── */}
      <section className="py-20 border-b border-[#292929]/60">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="mb-14">
            <p className="font-inter font-medium text-[10px] tracking-[2px] uppercase text-[#777D87] mb-2">
              FOUNDATIONS
            </p>
            <h2 className="font-manrope font-extrabold text-[32px] sm:text-[42px] leading-tight uppercase">
              OUR TECHNOLOGY STACK
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TECH_STACK.map((col) => (
              <div
                key={col.category}
                className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-6"
              >
                <h3 className="font-manrope font-bold text-[15px] uppercase text-[#7BA9F5] mb-4">
                  {col.category}
                </h3>
                <ul className="space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[13px] text-[#D0CFCC] font-inter">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3A414B]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Callout ── */}
      <section className="py-20 bg-[#0A0C0F]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 text-center">
          <h2 className="font-manrope font-extrabold text-[32px] sm:text-[46px] uppercase text-[#F5F3EE] mb-4">
            READY TO BUILD YOUR DIGITAL PRODUCT?
          </h2>
          <p className="font-inter text-[#B2B4BA] text-[14px] max-w-lg mx-auto mb-8">
            Whether you need a bespoke marketing website or a full-stack SaaS platform, let us architect the right solution.
          </p>
          <Link
            href="/contact?division=web"
            className="inline-flex items-center gap-2 px-7 h-[44px] rounded-[10px] bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[12px] uppercase tracking-wide transition-colors"
          >
            <span>Start a Project</span>
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  )
}
