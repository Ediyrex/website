import React from "react";
import { NotFoundBackground } from "./NotFoundBackground";
import { NotFoundHeader } from "./NotFoundHeader";
import { NotFoundMessage } from "./NotFoundMessage";
import { NotFoundActions } from "./NotFoundActions";
import { NotFoundDiagnostics } from "./NotFoundDiagnostics";
import { NotFoundSignature } from "./NotFoundSignature";

/**
 * Custom 404 — Signal Lost Experience.
 *
 * Cinematic Brutalism × Industrial Architecture × Technical Monitoring Interface.
 * Renders full-screen fixed over the viewport, with live typography,
 * interactive recovery CTAs, SSRF-safe diagnostic panel, and responsive layouts.
 */
export function NotFoundPage() {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto lg:overflow-hidden flex flex-col justify-between bg-[#08090A] text-[#F5F2EC] selection:bg-[#F06419]/30 selection:text-white">
      {/* Background Architectural Canvas & Overlays */}
      <NotFoundBackground />

      {/* 01. Global-Style Top Navigation */}
      <NotFoundHeader />

      {/* 02. Main Content & Diagnostic Stage */}
      <main
        id="error-main-stage"
        className="relative flex-1 w-full max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-14 flex flex-col justify-center py-8 lg:py-0"
      >
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          {/* Left Column: Error Number, Headline, Description, and Recovery Actions */}
          <div className="w-full max-w-[650px] space-y-6 sm:space-y-8 z-10">
            <NotFoundMessage />
            <NotFoundActions />
          </div>

          {/* Right Column: Diagnostic HUD Monitoring Panel */}
          {/* On Desktop: Positioned over right-hand dark concrete wall, preserving central portal and figure */}
          <div className="z-10 lg:pl-8 self-start lg:self-center">
            <NotFoundDiagnostics />
          </div>
        </div>
      </main>

      {/* 03. Bottom Studio Signature */}
      <NotFoundSignature />
    </div>
  );
}
