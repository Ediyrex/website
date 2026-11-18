"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Camera,
  CheckCircle2,
  Code2,
  Film,
  Globe,
  Layout,
  LayoutDashboard,
  Mail,
  Megaphone,
  MessageSquareCode,
  Package,
  Palette,
  PhoneCall,
  Puzzle,
  Scissors,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  Workflow,
} from "lucide-react";
import { ServiceDivision } from "@/types";
import { SERVICES_DATA } from "@/features/services/data";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Bot,
  Camera,
  Code2,
  Film,
  Globe,
  Layout,
  LayoutDashboard,
  Mail,
  Megaphone,
  MessageSquareCode,
  Package,
  Palette,
  PhoneCall,
  Puzzle,
  Scissors,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  Workflow,
};

const DIVISION_ACCENT: Record<ServiceDivision, string> = {
  branding: "#D6B77A",
  media: "#E58A76",
  digital: "#7BA9F5",
  ai: "#B5A0F5",
};

const DIVISION_LABEL: Record<ServiceDivision, string> = {
  branding: "Branding / Marketing",
  media: "Media",
  digital: "Web Dev",
  ai: "Agents & Automation",
};

export function ServiceDivisionTabs() {
  const [activeTab, setActiveTab] = useState<ServiceDivision | "all">("all");

  const filteredServices =
    activeTab === "all"
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.division === activeTab);

  const countByDivision = (div: ServiceDivision) =>
    SERVICES_DATA.filter((s) => s.division === div).length;

  return (
    <section
      id="services"
      className="py-16 md:py-24 bg-[#08090B] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="accent">Service Directory</Badge>
            <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.14]">
              {SERVICES_DATA.length} capabilities across Branding, Media, Web Dev &amp; AI
            </h2>
            <p className="text-[#B2B4BA] text-sm sm:text-base leading-relaxed">
              Every service can be commissioned independently or orchestrated together under one unified engagement.
            </p>
          </div>

          {/* Division Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#12151A] border border-[#252A32] rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer",
                activeTab === "all"
                  ? "bg-[#D6B77A] text-[#17130B] font-semibold"
                  : "text-[#B2B4BA] hover:text-[#F5F3EE]"
              )}
            >
              All ({SERVICES_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("branding")}
              className={cn(
                "px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer",
                activeTab === "branding"
                  ? "bg-[#D6B77A]/20 text-[#D6B77A] border border-[#D6B77A]/40"
                  : "text-[#B2B4BA] hover:text-[#F5F3EE]"
              )}
            >
              Branding / Marketing ({countByDivision("branding")})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className={cn(
                "px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer",
                activeTab === "media"
                  ? "bg-[#E58A76]/20 text-[#E58A76] border border-[#E58A76]/40"
                  : "text-[#B2B4BA] hover:text-[#F5F3EE]"
              )}
            >
              Media ({countByDivision("media")})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("digital")}
              className={cn(
                "px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer",
                activeTab === "digital"
                  ? "bg-[#7BA9F5]/20 text-[#7BA9F5] border border-[#7BA9F5]/40"
                  : "text-[#B2B4BA] hover:text-[#F5F3EE]"
              )}
            >
              Web Dev ({countByDivision("digital")})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ai")}
              className={cn(
                "px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer",
                activeTab === "ai"
                  ? "bg-[#B5A0F5]/20 text-[#B5A0F5] border border-[#B5A0F5]/40"
                  : "text-[#B2B4BA] hover:text-[#F5F3EE]"
              )}
            >
              Agents &amp; Automation ({countByDivision("ai")})
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = ICON_MAP[service.iconName] || Sparkles;
            const accent = DIVISION_ACCENT[service.division];

            return (
              <div
                key={service.id}
                id={service.slug}
                className="group relative p-6 md:p-7 rounded-2xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] transition-colors duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl border border-[#252A32] bg-[#0D0F12] flex items-center justify-center shrink-0">
                      <Icon
                        className="w-5 h-5"
                        style={{ color: accent }}
                        strokeWidth={1.75}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {service.featured && <Badge variant="accent">Core</Badge>}
                      <span
                        className="text-[11px] font-mono uppercase tracking-wider text-right"
                        style={{ color: accent }}
                      >
                        {DIVISION_LABEL[service.division]}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading font-semibold text-lg text-[#F5F3EE] group-hover:text-[#D6B77A] transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#B2B4BA] leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#252A32] space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#777D87]">
                      Deliverables &amp; Scope
                    </span>
                    <ul className="space-y-1">
                      {service.capabilities.map((cap) => (
                        <li
                          key={cap}
                          className="flex items-center gap-2 text-xs text-[#B2B4BA]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#777D87] shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-[#252A32]">
                  <Link
                    href={`/contact?service=${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D6B77A] hover:text-[#E6CC99] transition-colors"
                  >
                    <span>Enquire about this service</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
