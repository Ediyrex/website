'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: 1,
    division: 'media',
    divisionLabel: 'Media Production',
    quote:
      'Ediyrex delivered a cinematic brand film that completely redefined how enterprise clients perceive our positioning. Their visual direction, camera mastery, and audio engineering are unmatched.',
    author: 'Marcus Vance',
    title: 'Chief Marketing Officer',
    company: 'Lumina Origin',
    metric: '4.2M+ Views & 48% Lift in Inbound Demos',
  },
  {
    id: 2,
    division: 'web',
    divisionLabel: 'Web & Digital',
    quote:
      'Finding a studio that can execute both world-class UI design and resilient Next.js/TypeScript architecture is virtually impossible. Ediyrex built our full platform from scratch in 6 weeks without compromise.',
    author: 'Elena Rostova',
    title: 'VP of Product',
    company: 'Aegis Platform',
    metric: '99.99% Uptime & 220ms Global Page Load',
  },
  {
    id: 3,
    division: 'ai',
    divisionLabel: 'AI & Automation',
    quote:
      'The custom RAG agent and n8n workflows built by Ediyrex eliminated over 30 hours of weekly manual reporting across our operations team. It was the highest-ROI software investment we made this fiscal year.',
    author: 'Devon Wright',
    title: 'Founder & Managing Director',
    company: 'Synthesis Operations',
    metric: '32 hrs/week saved & zero operational drift',
  },
  {
    id: 4,
    division: 'media',
    divisionLabel: 'Media Production',
    quote:
      'Their production crew operated with surgical efficiency. From initial concept storyboard to 4K color grade and motion graphics package, they delivered ahead of schedule and beyond our expectations.',
    author: 'Sophia Chen',
    title: 'Creative Director',
    company: 'Vortex Identity Group',
    metric: 'Full Brand Campaign across 6 Global Markets',
  },
  {
    id: 5,
    division: 'web',
    divisionLabel: 'Web & Digital',
    quote:
      'Ediyrex redesigned our entire digital conversion funnel. Conversion rate increased by 64% within the first 14 days post-launch. Clean typography, blistering speed, and effortless user journeys.',
    author: 'Julian Thorne',
    title: 'Head of Growth',
    company: 'Horizon SaaS Labs',
    metric: '+64% Trial Signup Conversion Rate',
  },
  {
    id: 6,
    division: 'ai',
    divisionLabel: 'AI & Automation',
    quote:
      'Unlike typical agencies who pitch vaporware AI, Ediyrex delivered practical, hardened autonomous voice and chat systems integrated straight into our CRM and ticketing stack.',
    author: 'Aria Patel',
    title: 'Operations Principal',
    company: 'Kinetix Global',
    metric: '78% First-Contact Resolution Rate',
  },
]

const TABS = [
  { label: 'All Reviews', value: 'all' },
  { label: 'Media Production', value: 'media' },
  { label: 'Web & Digital', value: 'web' },
  { label: 'AI & Automation', value: 'ai' },
]

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState('all')

  const filtered =
    activeTab === 'all'
      ? TESTIMONIALS
      : TESTIMONIALS.filter((t) => t.division === activeTab)

  return (
    <div className="bg-[#000000] pt-28 pb-24 text-white">
      {/* Top Header */}
      <section className="pt-8 pb-16 border-b border-neutral-800">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">
              CLIENT TESTIMONIALS &amp; REPUTATION
            </span>
          </div>

          <h1
            className="font-manrope font-extrabold uppercase text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-4xl"
            style={{ lineHeight: 1.05 }}
          >
            VERIFIED OUTCOMES ACROSS
            <br />
            FILM, CODE &amp; INTELLIGENCE.
          </h1>

          <p className="font-inter text-neutral-400 text-base max-w-2xl mt-5 leading-relaxed">
            Direct feedback from founders, CMOs, and product leaders who rely on Ediyrex Studio as their integrated creative and technology partner.
          </p>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 mt-12 border-t border-neutral-800">
            <div>
              <p className="font-manrope font-extrabold text-3xl lg:text-4xl text-white">4.9 / 5.0</p>
              <div className="flex items-center gap-1 my-1 text-white">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-white stroke-white" />
                ))}
              </div>
              <p className="font-mono text-xs text-neutral-400">Average Client Rating</p>
            </div>

            <div>
              <p className="font-manrope font-extrabold text-3xl lg:text-4xl text-white">99.2%</p>
              <p className="font-mono text-xs text-neutral-400 mt-2">Client Recommendation Rate</p>
            </div>

            <div>
              <p className="font-manrope font-extrabold text-3xl lg:text-4xl text-white">3.4x</p>
              <p className="font-mono text-xs text-neutral-400 mt-2">Average ROI on Engagements</p>
            </div>

            <div>
              <p className="font-manrope font-extrabold text-3xl lg:text-4xl text-white">34+</p>
              <p className="font-mono text-xs text-neutral-400 mt-2">High-Standard Projects Shipped</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="mt-12 flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 rounded-md text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-semibold'
                      : 'bg-[#080808] text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-600'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between rounded-xl bg-[#080808] border border-neutral-800 p-8 hover:border-neutral-600 transition-colors duration-200"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                    {t.divisionLabel}
                  </span>
                  <Quote size={16} className="text-neutral-600" />
                </div>

                <p className="font-inter text-sm text-neutral-200 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <p className="font-mono text-xs font-semibold text-white">
                  {t.metric}
                </p>
                <div className="mt-3">
                  <p className="font-manrope font-bold text-sm text-white">
                    {t.author}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {t.title}, <span className="text-neutral-300">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Conversion Prompt */}
      <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 mt-24">
        <div className="p-10 md:p-14 rounded-2xl bg-[#080808] border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-manrope font-extrabold text-2xl md:text-3xl text-white">
              Ready to achieve measurable results?
            </h3>
            <p className="text-neutral-400 text-sm mt-2 max-w-lg">
              Partner with Ediyrex Studio for your next commercial film, web software platform, or autonomous AI deployment.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-white hover:bg-neutral-200 text-black font-inter font-semibold text-xs px-6 py-3 transition-colors shrink-0 uppercase tracking-wider"
          >
            <span>Start a Project</span>
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  )
}

