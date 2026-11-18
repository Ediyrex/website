"use client";

import React from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Compass,
  Cpu,
  Database,
  Eye,
  Film,
  Layers,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import type { WorkflowStageId } from "./workflow.data";

function DiscoverVisual() {
  return (
    <div className="relative w-full h-full min-h-[320px] rounded-[20px] bg-[#121110] border border-white/10 p-5 sm:p-6 overflow-hidden flex flex-col justify-between text-white shadow-2xl">
      {/* Background Amber/Orange Radar Bloom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#FF6900]/15 blur-3xl"
      />

      {/* Top Console Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6900] animate-pulse" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF9A48]">
            Intelligence Radar · Active
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/50 uppercase">
          Signal: 99.4% Clarity
        </span>
      </div>

      {/* Center Radar & Constellation Graph */}
      <div className="relative z-10 my-4 flex-1 flex items-center justify-center min-h-[170px]">
        {/* Radar Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          <div className="w-48 h-48 rounded-full border border-dashed border-[#FF6900]/40 animate-[spin_30s_linear_infinite]" />
          <div className="absolute w-32 h-32 rounded-full border border-white/20" />
          <div className="absolute w-16 h-16 rounded-full border border-[#FF6900]/50" />
        </div>

        {/* Constellation Nodes */}
        <svg
          viewBox="0 0 320 180"
          className="absolute inset-0 w-full h-full pointer-events-none"
          fill="none"
        >
          <path
            d="M 60 90 L 120 45 L 160 100 L 220 55 L 270 120 L 200 140 L 120 135 Z"
            stroke="rgba(255, 105, 0, 0.35)"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          <path
            d="M 120 45 L 220 55 M 160 100 L 200 140"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
          />
          <circle cx="60" cy="90" r="4" fill="#FF9A48" />
          <circle cx="120" cy="45" r="5" fill="#FF6900" />
          <circle cx="160" cy="100" r="6" fill="#FFFFFF" />
          <circle cx="220" cy="55" r="4.5" fill="#FF6900" />
          <circle cx="270" cy="120" r="5" fill="#FF9A48" />
          <circle cx="200" cy="140" r="4" fill="#FFFFFF" />
          <circle cx="120" cy="135" r="3.5" fill="#FF6900" />
        </svg>

        {/* Floating Intelligence Signals */}
        <div className="relative z-20 flex flex-wrap gap-2 justify-center max-w-[280px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 px-3 py-1 font-mono text-[10.5px] text-white">
            <Compass className="w-3.5 h-3.5 text-[#FF9A48]" />
            <span>Market Opportunity Identified</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6900]/15 backdrop-blur-md border border-[#FF6900]/40 px-3 py-1 font-mono text-[10.5px] text-[#FF9A48]">
            <Activity className="w-3.5 h-3.5 text-[#FF6900]" />
            <span>Technical Feasibility: Optimal</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 px-3 py-1 font-mono text-[10.5px] text-white">
            <Eye className="w-3.5 h-3.5 text-[#FF9A48]" />
            <span>48 Domain Variables Audited</span>
          </span>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex items-center justify-between z-10 pt-3 border-t border-white/10 font-mono text-[11px] text-white/70">
        <span>DELIVERABLE: INTELLIGENCE DOSSIER</span>
        <span className="text-[#FF9A48] font-bold">READY TO ARCHITECT</span>
      </div>
    </div>
  );
}

function BlueprintVisual() {
  return (
    <div className="relative w-full h-full min-h-[320px] rounded-[20px] bg-[#121110] border border-white/10 p-5 sm:p-6 overflow-hidden flex flex-col justify-between text-white shadow-2xl">
      {/* Background Cyan/Orange Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 -top-10 w-64 h-64 rounded-full bg-[#FF6900]/12 blur-3xl"
      />

      {/* Top Console Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#FF9A48]" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF9A48]">
            System Blueprint · Orthogonal Architecture
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/50 uppercase">
          Schema: 100% Type-Safe
        </span>
      </div>

      {/* Connected Architecture Nodes Diagram */}
      <div className="relative z-10 my-4 flex-1 flex flex-col justify-center gap-3">
        {/* Tier 1: UI & Brand Design System */}
        <div className="flex items-center justify-between rounded-[12px] bg-white/[0.05] border border-white/12 p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FF6900]/20 border border-[#FF6900]/40 flex items-center justify-center text-[#FF9A48]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-heading text-[12px] font-bold text-white leading-tight">
                Design System &amp; Tokens
              </div>
              <div className="font-mono text-[10px] text-white/50">
                Figma Code Connect · Tailored Components
              </div>
            </div>
          </div>
          <span className="font-mono text-[9.5px] uppercase rounded bg-white/10 px-2 py-0.5 text-white/80">
            UI Tier
          </span>
        </div>

        {/* Tier 2: Full-Stack Code & APIs */}
        <div className="flex items-center justify-between rounded-[12px] bg-white/[0.07] border border-[#FF6900]/40 p-3 shadow-[0_0_20px_rgba(255,105,0,0.12)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FF6900] text-black flex items-center justify-center font-bold">
              <Code2 className="w-4 h-4 text-[#121110] stroke-[2.2]" />
            </div>
            <div>
              <div className="font-heading text-[12px] font-bold text-white leading-tight">
                Modular API &amp; App Core
              </div>
              <div className="font-mono text-[10px] text-[#FF9A48]">
                Next.js / Node.js · OpenAPI Contracts
              </div>
            </div>
          </div>
          <span className="font-mono text-[9.5px] uppercase rounded bg-[#FF6900]/20 border border-[#FF6900]/40 px-2 py-0.5 text-[#FF9A48]">
            Logic Tier
          </span>
        </div>

        {/* Tier 3: Database & AI Agents */}
        <div className="flex items-center justify-between rounded-[12px] bg-white/[0.05] border border-white/12 p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Database className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="font-heading text-[12px] font-bold text-white leading-tight">
                PostgreSQL &amp; Vector Data
              </div>
              <div className="font-mono text-[10px] text-white/50">
                Drizzle ORM · Vector Embeddings · n8n
              </div>
            </div>
          </div>
          <span className="font-mono text-[9.5px] uppercase rounded bg-white/10 px-2 py-0.5 text-white/80">
            Data Tier
          </span>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex items-center justify-between z-10 pt-3 border-t border-white/10 font-mono text-[11px] text-white/70">
        <span>DELIVERABLE: SYSTEM BLUEPRINT</span>
        <span className="text-[#FF9A48] font-bold">SPEC APPROVED</span>
      </div>
    </div>
  );
}

function ExecuteVisual() {
  return (
    <div className="relative w-full h-full min-h-[320px] rounded-[20px] bg-[#121110] border border-white/10 p-5 sm:p-6 overflow-hidden flex flex-col justify-between text-white shadow-2xl">
      {/* Background Burst */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/4 w-72 h-72 rounded-full bg-[#FF6900]/15 blur-3xl"
      />

      {/* Top Console Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#FF6900] fill-[#FF6900]" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF9A48]">
            Multi-Discipline Engine · In Flight
          </span>
        </div>
        <span className="font-mono text-[10px] rounded bg-green-500/20 border border-green-500/40 px-2 py-0.5 text-green-400 font-semibold">
          3 Sprints Active
        </span>
      </div>

      {/* 3 Concurrent Execution Lanes */}
      <div className="relative z-10 my-4 flex-1 flex flex-col justify-center gap-2.5">
        {/* Lane 1: Code Build */}
        <div className="rounded-[12px] bg-[#1A1816]/90 border border-white/12 p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Terminal className="w-4 h-4 text-[#FF9A48] shrink-0" />
            <span className="font-mono text-[11px] text-white truncate">
              git commit: feat(runtime): type-safe orchestrator
            </span>
          </div>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-green-400 bg-green-950/60 border border-green-700/50 rounded px-1.5 py-0.5">
            Compiled · 0 err
          </span>
        </div>

        {/* Lane 2: Media Asset Studio */}
        <div className="rounded-[12px] bg-[#1A1816]/90 border border-[#FF6900]/30 p-2.5 flex items-center justify-between shadow-[0_0_16px_rgba(255,105,0,0.1)]">
          <div className="flex items-center gap-2 min-w-0">
            <Film className="w-4 h-4 text-[#FF6900] shrink-0" />
            <span className="font-mono text-[11px] text-[#FF9A48] truncate">
              render: 4K Commercial Reel &amp; Brand System
            </span>
          </div>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-[#FF9A48] bg-[#FF6900]/15 border border-[#FF6900]/40 rounded px-1.5 py-0.5">
            4K 60fps · Graded
          </span>
        </div>

        {/* Lane 3: AI Agent Runtimes */}
        <div className="rounded-[12px] bg-[#1A1816]/90 border border-white/12 p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Bot className="w-4 h-4 text-white/80 shrink-0" />
            <span className="font-mono text-[11px] text-white truncate">
              agent: n8n workflow synthesis &amp; tool dispatch
            </span>
          </div>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-white/80 bg-white/10 border border-white/20 rounded px-1.5 py-0.5">
            84ms · Latency
          </span>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex items-center justify-between z-10 pt-3 border-t border-white/10 font-mono text-[11px] text-white/70">
        <span>SPRINT STATUS: RAPID EXECUTION</span>
        <span className="text-green-400 font-bold">ALL PIPELINES GREEN</span>
      </div>
    </div>
  );
}

function DeliverVisual() {
  return (
    <div className="relative w-full h-full min-h-[320px] rounded-[20px] bg-[#121110] border border-[#FF6900]/40 p-5 sm:p-6 overflow-hidden flex flex-col justify-between text-white shadow-[0_24px_50px_rgba(255,105,0,0.14)]">
      {/* Background Vibrant Orange Radiant Core */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 bottom-0 h-44 rounded-full bg-[#FF6900]/22 blur-3xl"
      />

      {/* Top Console Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-[#FF9A48]" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF9A48]">
            Production Release &amp; Full Handover
          </span>
        </div>
        <span className="font-mono text-[10px] rounded bg-[#FF6900] text-black px-2 py-0.5 font-bold uppercase">
          Shipped to Client
        </span>
      </div>

      {/* Central Launch & Handover Certification Shield */}
      <div className="relative z-10 my-4 flex-1 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6900] to-[#E85D00] p-0.5 shadow-[0_0_30px_rgba(255,105,0,0.5)] flex items-center justify-center text-white">
          <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div>
          <h4 className="font-heading text-[18px] sm:text-[20px] font-bold text-white tracking-[-0.02em]">
            100% Intellectual Property Handover
          </h4>
          <p className="font-mono text-[11px] text-[#FF9A48] mt-0.5">
            Full Codebase · Design Systems · Private Model Weights · Clean Repos
          </p>
        </div>

        {/* 4 Verified Checkmarks */}
        <div className="grid grid-cols-2 gap-2 text-left w-full max-w-[340px] pt-1">
          <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-white/85">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
            <span>Automated CI/CD Live</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-white/85">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
            <span>Zero Vendor Lock-in</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-white/85">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
            <span>Operational Runbooks</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-white/85">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
            <span>Team Onboarding Ready</span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex items-center justify-between z-10 pt-3 border-t border-white/10 font-mono text-[11px] text-white/70">
        <span>FINAL STATUS: PRODUCTION READY</span>
        <span className="text-[#FF9A48] font-bold">CLIENT OWNS 100%</span>
      </div>
    </div>
  );
}

export function WorkflowVisualPanel({
  activeStageId,
}: {
  activeStageId: WorkflowStageId;
}) {
  switch (activeStageId) {
    case "discover":
      return <DiscoverVisual />;
    case "define":
      return <BlueprintVisual />;
    case "create":
      return <ExecuteVisual />;
    case "deliver":
      return <DeliverVisual />;
  }
}
