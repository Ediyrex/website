"use client";

import React, { useState } from "react";
import { X, ExternalLink, Sparkles, Check, ArrowRight, Layers, Clock, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface ServicePreviewData {
  title: string;
  slug: string;
  summary: string;
  description: string;
  categoryLabel?: string | null;
  divisionName?: string;
  divisionSlug?: string;
  deliverables?: string[];
  features?: string[];
  processStages?: { title: string; description: string; iconName?: string; displayOrder?: number }[];
  showPricing?: boolean;
  startingPrice?: string | null;
  status: string;
  isFeatured: boolean;
  coverAssetUrl?: string | null;
  industryNames?: string[];
}

interface PublicServicePreviewModalProps {
  open: boolean;
  onClose: () => void;
  service: ServicePreviewData;
}

export function PublicServicePreviewModal({
  open,
  onClose,
  service,
}: PublicServicePreviewModalProps) {
  const [viewTab, setViewTab] = useState<"card" | "detail">("detail");

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#090A0C] border border-[#292E35] shadow-2xl overflow-hidden text-[#F5F2EC]">
        {/* Top Editorial Utility Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#1E222A] bg-[#101216]">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#F06419]/15 border border-[#F06419]/30 text-[#F06419]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#D9B875]">
                  Public Experience Simulation
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                    service.status === "published"
                      ? "bg-[#54C99A]/15 text-[#54C99A] border-[#54C99A]/30"
                      : "bg-[#D9B875]/15 text-[#D9B875] border-[#D9B875]/30"
                  }`}
                >
                  {service.status}
                </span>
                {service.isFeatured && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F06419]/15 text-[#F06419] border border-[#F06419]/30">
                    Featured Placement
                  </span>
                )}
              </div>
              <h2 className="text-sm font-semibold text-[#F5F2EC] truncate max-w-md">
                {service.title || "Untitled Service"}
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
                Service Page
              </button>
              <button
                type="button"
                onClick={() => setViewTab("card")}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  viewTab === "card"
                    ? "bg-[#262C36] text-[#F5F2EC]"
                    : "text-[#8E95A2] hover:text-[#F5F2EC]"
                }`}
              >
                Directory Card
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

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-[#08090B]">
          {viewTab === "detail" ? (
            <div className="space-y-8 max-w-3xl mx-auto">
              {/* Breadcrumb Simulation */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#777D87]">
                <span>Services</span>
                <span>/</span>
                <span className="text-[#D9B875] uppercase">{service.divisionName || "Division"}</span>
                <span>/</span>
                <span className="text-[#F5F2EC]">{service.title}</span>
              </div>

              {/* Service Hero */}
              <div className="space-y-4 border-b border-[#1E222A] pb-8">
                {service.categoryLabel && (
                  <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-[#F06419] bg-[#F06419]/10 border border-[#F06419]/25 px-2.5 py-1 rounded-full">
                    {service.categoryLabel}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-[#F5F2EC]">
                  {service.title}
                </h1>
                <p className="text-base sm:text-lg text-[#B4B9C2] leading-relaxed">
                  {service.summary || "No summary provided."}
                </p>

                {service.showPricing && service.startingPrice && (
                  <div className="flex items-center gap-2 pt-2 text-sm font-mono text-[#D9B875]">
                    <span className="text-[#777D87]">Starting from:</span>
                    <span className="font-semibold">{service.startingPrice}</span>
                  </div>
                )}
              </div>

              {/* Cover Asset if available */}
              {service.coverAssetUrl && (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#1E222A]">
                  <Image
                    src={service.coverAssetUrl}
                    alt={service.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Long Description */}
              {service.description && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#D9B875]">
                    Service Overview
                  </h3>
                  <div className="text-sm text-[#B4B9C2] leading-relaxed whitespace-pre-line bg-[#101216] p-5 rounded-xl border border-[#1C2027]">
                    {service.description}
                  </div>
                </div>
              )}

              {/* Capabilities & Deliverables Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-5 rounded-xl bg-[#101216] border border-[#1C2027]">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#54C99A] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Capabilities
                  </h3>
                  {service.features && service.features.length > 0 ? (
                    <ul className="space-y-2 text-xs text-[#B4B9C2]">
                      {service.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#54C99A]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#6B7280] italic">No capabilities specified.</p>
                  )}
                </div>

                <div className="space-y-3 p-5 rounded-xl bg-[#101216] border border-[#1C2027]">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#D9B875] flex items-center gap-2">
                    <Check className="w-3.5 h-3.5" /> Client Deliverables
                  </h3>
                  {service.deliverables && service.deliverables.length > 0 ? (
                    <ul className="space-y-2 text-xs text-[#B4B9C2]">
                      {service.deliverables.map((deliv, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#D9B875] shrink-0 mt-0.5" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#6B7280] italic">No deliverables specified.</p>
                  )}
                </div>
              </div>

              {/* Process Stages */}
              {service.processStages && service.processStages.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-[#1E222A]">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#F06419]">
                    Execution Methodology
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {service.processStages.map((stage, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-[#101216] border border-[#1C2027] space-y-1.5"
                      >
                        <span className="text-[10px] font-mono text-[#F06419] font-bold">
                          {String(i + 1).padStart(2, "0")}.
                        </span>
                        <h4 className="text-xs font-semibold text-[#F5F2EC]">{stage.title}</h4>
                        <p className="text-[11px] text-[#8E95A2] leading-normal">{stage.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Industries */}
              {service.industryNames && service.industryNames.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#1E222A]">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#777D87]">
                    Relevant Sectors & Industries
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {service.industryNames.map((name, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full bg-[#181C22] border border-[#262C36] text-[#B4B9C2]"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Simulation */}
              <div className="pt-6 border-t border-[#1E222A] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F2EC]">Interested in this capability?</h4>
                  <p className="text-xs text-[#8E95A2]">Initiate a direct studio brief with your requirements.</p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F06419] text-white text-xs font-semibold">
                  <span>Start Project Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ) : (
            /* Directory Card Simulation */
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#101216] border border-[#222730] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#D9B875]/10 border border-[#D9B875]/25 text-[#D9B875]">
                  {service.divisionName || "Division"}
                </span>
                {service.categoryLabel && (
                  <span className="text-[10px] font-mono text-[#777D87]">
                    {service.categoryLabel}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-heading font-bold text-[#F5F2EC]">{service.title}</h3>
                <p className="text-xs text-[#9CA3AF] line-clamp-3 leading-relaxed">
                  {service.summary}
                </p>
              </div>

              {service.deliverables && service.deliverables.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-[#1C2027]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#777D87]">
                    Key Deliverables:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.deliverables.slice(0, 3).map((d, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181C22] border border-[#262C36] text-[#B4B9C2]"
                      >
                        {d}
                      </span>
                    ))}
                    {service.deliverables.length > 3 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 text-[#777D87]">
                        +{service.deliverables.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#1C2027] flex items-center justify-between text-xs">
                <span className="text-[#8E95A2] flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#D9B875]" />
                  <span>Production Ready</span>
                </span>
                <span className="text-[#F06419] font-medium flex items-center gap-1">
                  <span>Explore service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
