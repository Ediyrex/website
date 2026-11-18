"use client";

import React, { useEffect } from "react";
import { X, ArrowRight, Play, CheckCircle2, Cpu, Mic, Database, Calendar } from "lucide-react";

interface SystemFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
}

export function SystemFlowModal({
  isOpen,
  onClose,
  projectTitle,
}: SystemFlowModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${projectTitle} — System Architecture & Workflow Flow`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-[18px] bg-[#0E1013] border border-[#2B2F38] shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(240,100,25,0.15)] p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luminous Top Edge Shine */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFA266] to-transparent opacity-90"
        />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#252A32] pb-4 mb-6">
          <div className="space-y-1">
            <span className="font-mono text-xs text-[#F06419] uppercase tracking-wider font-semibold">
              SYSTEM ARCHITECTURE / WORKFLOW SPEC
            </span>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#F5F2EC]">
              {projectTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close system flow modal"
            className="w-8 h-8 rounded-full border border-[#444444] text-[#B8B9BC] flex items-center justify-center hover:border-[#F06419] hover:text-[#F06419] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Architecture Flow Diagram */}
        <div className="space-y-6">
          <p className="text-xs sm:text-sm text-[#B8B9BC] leading-relaxed">
            Real-time conversational pipeline engineered for &lt;380ms end-to-end voice latency. Audio streams enter via WebRTC, are parsed via low-latency STT, routed through tool-calling agents, and synthesized with dynamic prosody.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Step 1: Telephony / Ingest */}
            <div className="rounded-xl bg-[#14171D] border border-[#282E39] p-4 flex flex-col justify-between space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-md bg-[#F06419]/20 text-[#F06419] font-mono text-xs flex items-center justify-center font-bold">
                  01
                </span>
                <Mic className="w-4 h-4 text-[#898D94]" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#F5F2EC]">
                  Audio Ingestion
                </h4>
                <p className="text-[11px] font-mono text-[#898D94] mt-1">
                  Twilio SIP / WebRTC live audio streaming with Silero VAD
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#56C58B]">
                <CheckCircle2 className="w-3 h-3" /> 20ms Latency
              </span>
            </div>

            {/* Step 2: Speech-to-Text */}
            <div className="rounded-xl bg-[#14171D] border border-[#282E39] p-4 flex flex-col justify-between space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-md bg-[#D9B875]/20 text-[#D9B875] font-mono text-xs flex items-center justify-center font-bold">
                  02
                </span>
                <Cpu className="w-4 h-4 text-[#898D94]" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#F5F2EC]">
                  Intent Engine
                </h4>
                <p className="text-[11px] font-mono text-[#898D94] mt-1">
                  Streaming Deepgram Whisper + Gemini 1.5 Flash agent router
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#D9B875]">
                <Play className="w-3 h-3 fill-[#D9B875]" /> Semantic Parse
              </span>
            </div>

            {/* Step 3: Tool Execution */}
            <div className="rounded-xl bg-[#14171D] border border-[#282E39] p-4 flex flex-col justify-between space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-md bg-[#68A9FF]/20 text-[#68A9FF] font-mono text-xs flex items-center justify-center font-bold">
                  03
                </span>
                <Database className="w-4 h-4 text-[#898D94]" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#F5F2EC]">
                  Action Execution
                </h4>
                <p className="text-[11px] font-mono text-[#898D94] mt-1">
                  Calendar booking, CRM lead creation, webhook triggers
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#68A9FF]">
                <Calendar className="w-3 h-3" /> Live Tool Call
              </span>
            </div>

            {/* Step 4: TTS Response Stream */}
            <div className="rounded-xl bg-[#14171D] border border-[#282E39] p-4 flex flex-col justify-between space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-md bg-[#F06419]/20 text-[#F06419] font-mono text-xs flex items-center justify-center font-bold">
                  04
                </span>
                <Play className="w-4 h-4 text-[#898D94]" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#F5F2EC]">
                  Voice Synthesis
                </h4>
                <p className="text-[11px] font-mono text-[#898D94] mt-1">
                  Ultra-low-latency Cartesia TTS streaming back to user
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#56C58B]">
                <CheckCircle2 className="w-3 h-3" /> &lt;280ms Output
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-[#252A32] flex items-center justify-between">
          <span className="text-xs font-mono text-[#898D94]">
            EDYREX STUDIO R&amp;D BLUEPRINT
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#F06419] text-[#171717] font-mono font-bold text-xs uppercase tracking-wide hover:bg-[#E05308] transition-colors"
          >
            Close Flow
          </button>
        </div>
      </div>
    </div>
  );
}
