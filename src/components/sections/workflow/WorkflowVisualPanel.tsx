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
    <div className="relative w-full h-full min-h-[360px] rounded-[20px] bg-[#121110] border border-white/10 p-5 sm:p-6 overflow-hidden flex flex-col justify-between text-white shadow-2xl">
      {/* Background Amber/Orange Radar Bloom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-[#FF6900]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 -top-10 w-48 h-48 rounded-full bg-[#FF9A48]/10 blur-2xl"
      />

      {/* Top Console Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6900] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6900]" />
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF9A48]">
            Intelligence Radar · Active
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/60 uppercase tracking-wider bg-white/[0.06] border border-white/10 rounded px-2 py-0.5">
          Signal: 99.4% Clarity
        </span>
      </div>

      {/* Center Radar Scope & Telemetry Signals */}
      <div className="relative z-10 my-auto py-2 flex flex-col items-center justify-center gap-4 sm:gap-5">
        {/* Radar Scanning Arena */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center shrink-0">
          {/* Outer Compass Degree Ring */}
          <div className="absolute inset-0 rounded-full border border-white/15" />
          <div className="absolute inset-1 rounded-full border border-dashed border-[#FF6900]/30 animate-[spin_40s_linear_infinite]" />

          {/* Range Circles */}
          <div className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-white/10" />
          <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#FF6900]/25" />
          <div className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/15" />

          {/* Crosshair Axes */}
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          {/* Rotating Radar Sweep Cone */}
          <div
            className="absolute inset-0 rounded-full animate-[spin_4s_linear_infinite] pointer-events-none"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(255, 105, 0, 0.35) 0deg, rgba(255, 105, 0, 0.08) 45deg, transparent 90deg, transparent 360deg)",
            }}
          />

          {/* Center Origin Reticle */}
          <div className="relative z-10 w-3 h-3 rounded-full bg-[#FF6900] shadow-[0_0_12px_#FF6900] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-white" />
          </div>

          {/* Target Blip 1: Market Opportunity */}
          <div className="absolute top-6 right-6 flex items-center gap-1.5 pointer-events-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9A48] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9A48]" />
            </span>
            <span className="font-mono text-[8.5px] text-[#FF9A48] tracking-widest uppercase bg-black/70 px-1 rounded border border-[#FF9A48]/30">
              TGT·01
            </span>
          </div>

          {/* Target Blip 2: Technical Feasibility */}
          <div className="absolute bottom-9 left-5 flex items-center gap-1.5 pointer-events-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-mono text-[8.5px] text-emerald-400 tracking-widest uppercase bg-black/70 px-1 rounded border border-emerald-500/30">
              TGT·02
            </span>
          </div>

          {/* Target Blip 3: Domain Variables */}
          <div className="absolute bottom-5 right-8 flex items-center gap-1.5 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
            <span className="font-mono text-[8.5px] text-white/80 tracking-widest uppercase bg-black/70 px-1 rounded border border-white/20">
              TGT·03
            </span>
          </div>

          {/* Constellation Vector Lines */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full pointer-events-none"
            fill="none"
          >
            <path
              d="M 148 38 L 100 100 L 42 142 M 100 100 L 142 154"
              stroke="rgba(255, 154, 72, 0.4)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          </svg>
        </div>

        {/* Intelligence Telemetry Feed Cards (Organized Cleanly Below Radar) */}
        <div className="w-full space-y-2 z-10">
          <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 transition-colors hover:border-[#FF6900]/40">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#FF6900]/15 border border-[#FF6900]/30 flex items-center justify-center text-[#FF9A48] shrink-0">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-[11px] text-white truncate">
                Market Opportunity
              </span>
            </div>
            <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-0.5 font-medium">
              Identified · High Alpha
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-[#FF6900]/40 px-3 py-2 shadow-[0_0_16px_rgba(255,105,0,0.08)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#FF6900] text-black flex items-center justify-center shrink-0">
                <Activity className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <span className="font-mono text-[11px] text-[#FF9A48] font-medium truncate">
                Technical Feasibility
              </span>
            </div>
            <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-wider text-[#FF9A48] bg-[#FF6900]/15 border border-[#FF6900]/40 rounded px-2 py-0.5 font-medium">
              Optimal · 0 Blockers
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 transition-colors hover:border-white/20">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-[11px] text-white truncate">
                Domain Audit
              </span>
            </div>
            <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-wider text-white/80 bg-white/10 border border-white/20 rounded px-2 py-0.5 font-medium">
              48 Variables Audited
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex items-center justify-between z-10 pt-3 border-t border-white/10 font-mono text-[11px] text-white/70 shrink-0">
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
