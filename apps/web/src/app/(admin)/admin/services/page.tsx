'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react'

const DIVISIONS = [
  {
    id: 'media',
    name: 'Media Production',
    accent: '#E58A76',
    services: [
      'Commercials and Brand Films',
      'Short-Form & Social Media Content',
      'Commercial Photography',
      'Post-Production & Editing',
      'Motion Graphics & Animation',
      'Podcast Production',
    ],
  },
  {
    id: 'web',
    name: 'Web & Digital Products',
    accent: '#7BA9F5',
    services: [
      'Modern Web Applications & SaaS',
      'Custom Brand & Editorial Websites',
      'High-Conversion Landing Pages',
      'Business Dashboards & Admin Portals',
      'UI/UX Design Systems',
      'API Integrations & Extensions',
    ],
  },
  {
    id: 'agents',
    name: 'Agents & Automation',
    accent: '#B5A0F5',
    services: [
      'Custom AI Autonomous Agents',
      'n8n Event-Driven Workflows',
      'RAG & Private Knowledge Systems',
      'AI Voice & Conversational Bots',
      'Document & Data Extraction',
      'Operational AI Feasibility Strategy',
    ],
  },
]

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div>
        <h1 className="font-manrope font-extrabold text-[22px] uppercase text-[#F5F3EE]">
          SERVICE DIVISIONS &amp; CAPABILITIES
        </h1>
        <p className="font-inter text-[13px] text-[#8C92A4] mt-0.5">
          Manage services offered across Ediyrex Studio’s three integrated divisions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {DIVISIONS.map((div) => (
          <div
            key={div.id}
            className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1C2028]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: div.accent }}
                  />
                  <h2 className="font-manrope font-bold text-[16px] uppercase text-[#F5F3EE]">
                    {div.name}
                  </h2>
                </div>
                <Link
                  href={`/${div.id === 'agents' ? 'agents-automation' : div.id}`}
                  target="_blank"
                  className="text-[11px] font-mono text-[#777D87] hover:text-[#F5F3EE] transition-colors"
                >
                  View ↗
                </Link>
              </div>

              <ul className="space-y-2.5">
                {div.services.map((srv, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-[12.5px] font-inter text-[#B2B4BA]"
                  >
                    <CheckCircle2 size={13} className="text-[#3A414B] shrink-0" />
                    <span>{srv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#1C2028]">
              <span className="text-[11px] font-mono text-[#8C92A4]">
                Status: <span className="text-emerald-400 font-semibold">Active &bull; Synced</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

