"use client";

import React, { useState } from "react";
import { Mic, MicOff, PhoneOff, Phone, Grid, CheckCircle2 } from "lucide-react";

export function VocalisVisualShowcase() {
  const [isMuted, setIsMuted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [showDialpad, setShowDialpad] = useState(false);

  const waveformHeights = [
    14, 22, 18, 36, 48, 28, 62, 78, 92, 108, 120, 134, 115, 96, 75, 84, 96, 68, 52, 38, 44, 30, 22, 16, 12,
  ];

  return (
    <div
      aria-label="Vocalis Live Workflow & Voice Runtime Visual Showcase"
      className="relative w-full h-[360px] sm:h-[420px] lg:h-[460px] flex items-center justify-center overflow-hidden rounded-[14px] bg-[#0A0B0D] select-none"
    >
      {/* Radiant Orange Atmospheric Ambient Back-Glow Behind Display */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-4 w-[520px] h-[380px] rounded-full bg-[radial-gradient(circle,_rgba(240,100,25,0.58)_0%,_rgba(240,100,25,0.22)_45%,_transparent_75%)] blur-3xl -z-0"
      />

      {/* Tilted High-Precision Laptop/Tablet Display Wrapper */}
      <div className="relative z-10 w-[96%] max-w-[560px] h-[310px] sm:h-[350px] lg:h-[370px] rounded-[16px] bg-[#0E1013] border border-[#F06419]/45 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85),0_0_45px_-5px_rgba(240,100,25,0.30)] p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden">
        {/* Top App Header / Navigation Bar */}
        <div className="flex items-center justify-between border-b border-[#20242B] pb-2.5">
          {/* Logo & Product Brand */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#F06419] flex items-center justify-center shadow-[0_0_14px_rgba(240,100,25,0.8)]">
              <span className="font-heading font-black text-[10px] text-[#0C0D0F]">V</span>
            </div>
            <span className="font-heading font-bold text-xs sm:text-[13px] text-[#F5F2EC] tracking-tight">
              Vocalis
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-mono">
            <span className="text-[#F5F2EC] font-semibold">Overview</span>
            <span className="text-[#898D94] hover:text-[#B8B9BC] transition-colors hidden sm:inline">
              Calls
            </span>
            <span className="text-[#898D94] hover:text-[#B8B9BC] transition-colors hidden sm:inline">
              Automation
            </span>
            <span className="text-[#898D94] hover:text-[#B8B9BC] transition-colors">
              Settings
            </span>
          </div>
        </div>

        {/* Main Work Area: 2-Column Interface (Audio Visualizer + Live Workflow) */}
        <div className="grid grid-cols-12 gap-3 sm:gap-4 flex-1 pt-3 items-center">
          {/* Left / Center Zone: Voice Activity & Inbound Call State */}
          <div className="col-span-7 sm:col-span-7 flex flex-col items-center justify-center space-y-2.5 sm:space-y-3">
            <span className="text-[10px] sm:text-[11px] font-mono text-[#898D94] uppercase tracking-wider">
              Call in progress
            </span>

            {/* Glowing Orange Audio Waveform Spectrum */}
            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-[2.5px] sm:gap-[3px] h-14 sm:h-16 px-1"
            >
              {waveformHeights.map((h, i) => (
                <span
                  key={i}
                  className="w-[2.5px] sm:w-[3px] rounded-full bg-gradient-to-t from-[#F06419] via-[#FF762F] to-[#FFA266] shadow-[0_0_10px_rgba(240,100,25,0.7),0_0_3px_#FFA266] transition-all duration-300"
                  style={{
                    height: `${Math.max(6, Math.round(h * 0.48))}px`,
                    opacity: i % 2 === 0 ? 1 : 0.85,
                  }}
                />
              ))}
            </div>

            {/* Operator Identifier & Subtitle */}
            <div className="text-center space-y-0.5">
              <h4 className="font-heading font-bold text-xs sm:text-sm text-[#F5F2EC] tracking-tight">
                {isEnded ? "Call Completed" : "AI Receptionist"}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-[#898D94] font-mono">
                {isEnded
                  ? "Transcribing summary to CRM..."
                  : isMuted
                  ? "Microphone muted"
                  : showDialpad
                  ? "Dialpad ready for DTMF input"
                  : "Handling customer inquiry..."}
              </p>
            </div>

            {/* Interaction Call Controls */}
            <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-colors flex items-center justify-center cursor-pointer ${
                  isMuted
                    ? "bg-[#D6B77A] border-[#D6B77A] text-black"
                    : "bg-[#1C2026] border-[#2B2F38] text-[#B8B9BC] hover:text-white"
                }`}
              >
                {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsEnded(!isEnded)}
                aria-label={isEnded ? "Reconnect call" : "End active call"}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white flex items-center justify-center transition-colors cursor-pointer ${
                  isEnded
                    ? "bg-[#56C58B] hover:bg-[#48b079] shadow-[0_0_16px_rgba(86,197,139,0.7)]"
                    : "bg-[#E04343] hover:bg-[#C93535] shadow-[0_0_16px_rgba(224,67,67,0.7)]"
                }`}
              >
                {isEnded ? <Phone className="w-3.5 h-3.5" /> : <PhoneOff className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setShowDialpad(!showDialpad)}
                aria-label={showDialpad ? "Close dialpad" : "Open dialpad"}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-colors flex items-center justify-center cursor-pointer ${
                  showDialpad
                    ? "bg-[#F06419] border-[#F06419] text-black"
                    : "bg-[#1C2026] border-[#2B2F38] text-[#B8B9BC] hover:text-white"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Zone: Live Workflow Panel */}
          <div className="col-span-5 sm:col-span-5 rounded-xl bg-[#14171C]/90 border border-[#262B34] p-2.5 sm:p-3 flex flex-col justify-between space-y-2 shadow-inner">
            <span className="font-heading font-bold text-[11px] sm:text-xs text-[#F5F2EC] tracking-tight block border-b border-[#20242C] pb-1.5">
              Live Workflow
            </span>

            <div className="space-y-2">
              {/* Step 1: Inbound Call */}
              <div className="flex items-start gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F06419] shrink-0 mt-0.5 drop-shadow-[0_0_6px_rgba(240,100,25,0.7)]" />
                <div className="min-w-0">
                  <span className="block text-[10px] sm:text-[11px] font-semibold text-[#F5F2EC] leading-tight">
                    Inbound Call
                  </span>
                  <span className="block text-[9px] font-mono text-[#F06419] font-medium">
                    Connected
                  </span>
                </div>
              </div>

              {/* Step 2: AI Interaction */}
              <div className="flex items-start gap-1.5 sm:gap-2">
                <div className="w-3.5 h-3.5 rounded-full border border-[#F06419] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(240,100,25,0.5)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F06419] animate-pulse" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] sm:text-[11px] font-semibold text-[#F5F2EC] leading-tight">
                    AI Interaction
                  </span>
                  <span className="block text-[9px] font-mono text-[#F06419] font-medium">
                    In Progress
                  </span>
                </div>
              </div>

              {/* Step 3: Capture Details */}
              <div className="flex items-start gap-1.5 sm:gap-2">
                <div className="w-3.5 h-3.5 rounded-full border border-[#444444] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="block text-[10px] sm:text-[11px] font-medium text-[#B8B9BC] leading-tight">
                    Capture Details
                  </span>
                  <span className="block text-[9px] font-mono text-[#666B73]">
                    Name, intent
                  </span>
                </div>
              </div>

              {/* Step 4: Schedule / Route */}
              <div className="flex items-start gap-1.5 sm:gap-2">
                <div className="w-3.5 h-3.5 rounded-full border border-[#444444] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="block text-[10px] sm:text-[11px] font-medium text-[#B8B9BC] leading-tight">
                    Schedule / Route
                  </span>
                  <span className="block text-[9px] font-mono text-[#666B73]">
                    Team handoff
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Slate Bedrock Floor Accent (Bottom Layer from the visual design) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 inset-x-0 h-16 bg-gradient-to-t from-[#0A0B0D] via-[#0E1013]/80 to-transparent"
      />
    </div>
  );
}
