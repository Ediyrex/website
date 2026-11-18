"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Database,
  PanelsTopLeft,
  Server,
  ShieldCheck,
  Smartphone,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TECH_STACK_MODES = [
  {
    id: "web-saas",
    name: "Web & SaaS",
    layers: [
      {
        id: "frontend",
        label: "Frontend",
        tech: "Next.js · React · Vue",
        Icon: PanelsTopLeft,
      },
      {
        id: "backend",
        label: "Backend",
        tech: "TypeScript · Node · Go",
        Icon: Server,
      },
      {
        id: "database",
        label: "Database",
        tech: "PostgreSQL · Supabase · Redis",
        Icon: Database,
      },
      {
        id: "handover",
        label: "Ownership",
        tech: "100% Source & IP Handover",
        Icon: ShieldCheck,
      },
    ],
  },
  {
    id: "ai-systems",
    name: "AI & Agents",
    layers: [
      {
        id: "frontend",
        label: "Interface",
        tech: "DADV Dashboards · React",
        Icon: PanelsTopLeft,
      },
      {
        id: "backend",
        label: "AI Engine",
        tech: "Python · FastAPI · n8n · LangChain",
        Icon: Cpu,
      },
      {
        id: "database",
        label: "Vector & DB",
        tech: "Vector DB · Pinecone · PostgreSQL",
        Icon: Database,
      },
      {
        id: "handover",
        label: "Ownership",
        tech: "Private Prompts & Workflows",
        Icon: ShieldCheck,
      },
    ],
  },
  {
    id: "mobile-cloud",
    name: "Mobile & Cloud",
    layers: [
      {
        id: "frontend",
        label: "Client Apps",
        tech: "React Native · Flutter · Web",
        Icon: Smartphone,
      },
      {
        id: "backend",
        label: "Cloud Ops",
        tech: "Docker · AWS · Cloudflare",
        Icon: Server,
      },
      {
        id: "database",
        label: "Realtime",
        tech: "Edge KV · SQLite · Firebase",
        Icon: Database,
      },
      {
        id: "handover",
        label: "Ownership",
        tech: "App Store & Clean Repos",
        Icon: ShieldCheck,
      },
    ],
  },
] as const;

export function OwnershipLayers() {
  const [activeStackIndex, setActiveStackIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-cycle through the multiple stacks every 3 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveStackIndex((prev) => (prev + 1) % TECH_STACK_MODES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const currentStack = TECH_STACK_MODES[activeStackIndex];

  return (
    <div
      aria-label="Multi-tech stack architecture"
      className="flex w-full sm:w-[270px] md:w-[290px] shrink-0 flex-col gap-2 mx-auto sm:mx-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Multi-Stack Mode Switcher Tabs */}
      <div className="flex items-center justify-between gap-1 rounded-[10px] bg-[#F2ECE5] p-1 border border-[#E5DED5]">
        {TECH_STACK_MODES.map((mode, idx) => {
          const isActive = activeStackIndex === idx;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveStackIndex(idx)}
              className={cn(
                "flex-1 rounded-[7px] py-1 px-1.5 text-center font-mono text-[9.5px] uppercase tracking-[0.06em] font-semibold transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-[#FFFDFC] text-[#FF6900] shadow-[0_2px_8px_rgba(255,105,0,0.15)] border border-[#FF6900]/30"
                  : "text-[#5C5650] hover:text-[#111111] hover:bg-white/60"
              )}
            >
              {mode.name}
            </button>
          );
        })}
      </div>

      {/* Stacked Architecture Layers */}
      <div className="flex flex-col gap-1.5">
        {currentStack.layers.map(({ id, label, tech, Icon }, idx) => (
          <div
            key={id}
            className={cn(
              "flex items-center justify-between gap-2.5 rounded-[10px] border border-[#E5DED5] border-l-[3px] border-l-[#FF6900] bg-[#FAF6F0] px-3 py-2 text-[#111111] shadow-[0_2px_6px_rgba(0,0,0,0.02)] transition-all duration-250 hover:border-[#FF9A48] hover:bg-[#FFF0E3] hover:-translate-y-0.5",
              idx === 0 && "sm:mr-2",
              idx === 1 && "sm:ml-1 sm:mr-1",
              idx === 2 && "sm:ml-2",
              idx === 3 && "sm:ml-1"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Icon className="h-3.5 w-3.5 shrink-0 text-[#FF6900] stroke-[1.8]" />
              <span className="font-heading text-[11px] font-semibold text-[#111111] shrink-0">
                {label}
              </span>
            </div>
            <span className="font-mono text-[9.5px] font-medium text-[#655F59] truncate text-right">
              {tech}
            </span>
          </div>
        ))}
      </div>

      {/* Multi-Stack Agnostic Micro-Footnote */}
      <div className="flex items-center justify-between px-1 text-[9.5px] font-mono text-[#817A72]">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6900] animate-pulse" />
          <span className="uppercase tracking-wider font-semibold text-[#111111]">
            Multi-Stack Agnostic
          </span>
        </span>
        <span className="uppercase tracking-wider text-[9px] text-[#817A72]">
          Zero Vendor Lock-In
        </span>
      </div>
    </div>
  );
}
