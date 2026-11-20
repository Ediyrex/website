"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Layers,
  Building,
} from "lucide-react";
import Image from "next/image";

interface IndustryPreviewData {
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  description?: string;
  heroHeadline?: string;
  heroDescription?: string;
  ctaLabel?: string;
  deliverables?: string[];
  subIndustries?: string[];
  challenges?: { title: string; description: string }[];
  opportunities?: { title: string; description: string }[];
  solutions?: { title: string; description: string; serviceIds?: string[] }[];
  faqs?: { question: string; answer: string }[];
  status: string;
  isFeatured: boolean;
  isHeroFeatured?: boolean;
  displayOrder: number;
  coverImageUrl?: string;
  connectedServiceNames?: string[];
  connectedArchitectureNames?: string[];
}

interface PublicIndustryPreviewModalProps {
  open: boolean;
  onClose: () => void;
  industry: IndustryPreviewData;
}

export function PublicIndustryPreviewModal({
  open,
  onClose,
  industry,
}: PublicIndustryPreviewModalProps) {
  const [viewTab, setViewTab] = useState<"detail" | "directory" | "hero">("detail");

  if (!open) return null;

  const formattedNumber = String(industry.displayOrder || 1).padStart(2, "0");

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#090A0C] border border-[#292E35] shadow-2xl overflow-hidden text-[#F5F2EC]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#1E222A] bg-[#101216]">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#F06419]/15 border border-[#F06419]/30 text-[#F06419]">
              <Building className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#D9B875]">
                  Public Industry Simulation
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                    industry.status === "published"
                      ? "bg-[#54C99A]/15 text-[#54C99A] border-[#54C99A]/30"
                      : "bg-[#D9B875]/15 text-[#D9B875] border-[#D9B875]/30"
                  }`}
                >
                  {industry.status}
                </span>
                {industry.isFeatured && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F06419]/15 text-[#F06419] border border-[#F06419]/30">
                    Featured
                  </span>
                )}
                {industry.isHeroFeatured && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#D9B875]/15 text-[#D9B875] border border-[#D9B875]/30">
                    Hero Directory
                  </span>
                )}
              </div>
              <h2 className="text-sm font-semibold text-[#F5F2EC] truncate max-w-md">
                {industry.name || "Untitled Industry"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#171B21] border border-[#262C36] rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewTab("detail")}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  viewTab === "detail"
                    ? "bg-[#262C36] text-[#F5F2EC]"
                    : "text-[#8E95A2] hover:text-[#F5F2EC]"
                }`}
              >
                Detail Page
              </button>
              <button
                type="button"
                onClick={() => setViewTab("directory")}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  viewTab === "directory"
                    ? "bg-[#262C36] text-[#F5F2EC]"
                    : "text-[#8E95A2] hover:text-[#F5F2EC]"
                }`}
              >
                Directory Row
              </button>
              <button
                type="button"
                onClick={() => setViewTab("hero")}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  viewTab === "hero"
                    ? "bg-[#262C36] text-[#F5F2EC]"
                    : "text-[#8E95A2] hover:text-[#F5F2EC]"
                }`}
              >
                Hero Card
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8E95A2] hover:text-[#F5F2EC] hover:bg-[#1C2129] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-[#08090B]">
          {viewTab === "detail" && (
            <div className="space-y-8 max-w-3xl mx-auto">
              {/* Breadcrumb Simulation */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#777D87]">
                <span>Industries</span>
                <span>/</span>
                <span className="text-[#D9B875] uppercase">{industry.tagline || "Vertical"}</span>
                <span>/</span>
                <span className="text-[#F5F2EC]">{industry.name}</span>
              </div>

              {/* Header Manifesto */}
              <div className="space-y-3 border-b border-[#1E222A] pb-8">
                <span className="font-mono text-xs uppercase tracking-wider text-[#D9B875] font-semibold">
                  {industry.tagline || "SECTOR SPECIFICATION"}
                </span>
                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-[#F5F2EC]">
                  {industry.heroHeadline || industry.name}
                </h1>
                <p className="text-base sm:text-lg text-[#B4B9C2] leading-relaxed">
                  {industry.heroDescription || industry.shortDescription}
                </p>

                {/* Sub-industries tags */}
                {industry.subIndustries && industry.subIndustries.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {industry.subIndustries.map((sub, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#161A20] border border-[#262C36] text-[#9CA3AF]"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Cover visual if available */}
              {industry.coverImageUrl && (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#1E222A]">
                  <Image
                    src={industry.coverImageUrl}
                    alt={industry.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Sector Deliverables & Capabilities */}
              <div className="p-6 rounded-xl bg-[#101216] border border-[#1C2027] space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#D9B875]">
                  Domain Deliverables & Production Assets
                </h3>
                {industry.deliverables && industry.deliverables.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {industry.deliverables.map((deliv, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-[#B4B9C2]">
                        <CheckCircle2 className="w-4 h-4 text-[#F06419] shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#6B7280] italic">No deliverables added yet.</p>
                )}
              </div>

              {/* Industry Challenges */}
              {industry.challenges && industry.challenges.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-[#1E222A]">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#F06419] flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> Core Sector Challenges
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {industry.challenges.map((c, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-[#101216] border border-[#1C2027] space-y-1.5"
                      >
                        <h4 className="text-xs font-semibold text-[#F5F2EC]">{c.title}</h4>
                        <p className="text-xs text-[#8E95A2] leading-relaxed">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EDYREX Approach & Solutions */}
              {industry.solutions && industry.solutions.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-[#1E222A]">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#54C99A] flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5" /> EDYREX Approach & Solutions
                  </h3>
                  <div className="space-y-3">
                    {industry.solutions.map((s, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-[#101216] border border-[#1C2027] space-y-1.5"
                      >
                        <h4 className="text-xs font-semibold text-[#F5F2EC]">{s.title}</h4>
                        <p className="text-xs text-[#8E95A2] leading-relaxed">{s.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Industry FAQs */}
              {industry.faqs && industry.faqs.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-[#1E222A]">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#777D87] flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5" /> Sector Inquiries & FAQs
                  </h3>
                  <div className="space-y-3">
                    {industry.faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-[#101216] border border-[#1C2027] space-y-1.5"
                      >
                        <h4 className="text-xs font-semibold text-[#F5F2EC]">{faq.question}</h4>
                        <p className="text-xs text-[#8E95A2] leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Architectures and Services */}
              {(industry.connectedArchitectureNames?.length || industry.connectedServiceNames?.length) && (
                <div className="space-y-3 pt-4 border-t border-[#1E222A]">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#777D87]">
                    Integrated Studio Capabilities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {industry.connectedArchitectureNames?.map((a, i) => (
                      <span
                        key={`a-${i}`}
                        className="text-xs px-3 py-1 rounded-full bg-[#181C22] border border-[#F06419]/30 text-[#FFA266]"
                      >
                        {a}
                      </span>
                    ))}
                    {industry.connectedServiceNames?.map((s, i) => (
                      <span
                        key={`s-${i}`}
                        className="text-xs px-3 py-1 rounded-full bg-[#181C22] border border-[#262C36] text-[#B4B9C2]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Simulation */}
              <div className="pt-6 border-t border-[#1E222A] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F2EC]">Build for your domain</h4>
                  <p className="text-xs text-[#8E95A2]">Discuss challenges and system architecture directly with leads.</p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F06419] text-white text-xs font-semibold">
                  <span>{industry.ctaLabel || "Discuss Your Sector"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          )}

          {viewTab === "directory" && (
            /* Directory Row Simulation (exact replica of IndustriesRegister) */
            <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-[#0C0D0F] border border-[#252A32] shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-1 flex items-center justify-between">
                  <span className="font-heading font-extrabold text-5xl text-[#F06419]">
                    {formattedNumber}
                  </span>
                </div>
                <div className="lg:col-span-4 space-y-1">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-[#D9B875] font-semibold">
                    {industry.tagline}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-[#F5F2EC]">{industry.name}</h3>
                </div>
                <div className="lg:col-span-4">
                  <p className="text-xs text-[#9CA3AF] line-clamp-3 leading-relaxed">
                    {industry.shortDescription}
                  </p>
                </div>
                <div className="lg:col-span-3 flex justify-end">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F06419] text-xs font-semibold text-[#F06419]">
                    <span>{industry.ctaLabel || "Enquire"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {viewTab === "hero" && (
            /* Hero Card Simulation (exact replica of IndustriesHero card) */
            <div className="max-w-sm mx-auto p-5 rounded-xl bg-[#121417] border border-[#292E35] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F06419] font-bold">{formattedNumber}</span>
                <span className="text-[#D9B875] text-[10px] uppercase">{industry.tagline}</span>
              </div>
              <h3 className="text-base font-heading font-bold text-[#F5F2EC]">{industry.name}</h3>
              <p className="text-xs text-[#8E95A2] line-clamp-2 leading-relaxed">
                {industry.shortDescription}
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#F06419] font-semibold">
                <span>Explore vertical</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
