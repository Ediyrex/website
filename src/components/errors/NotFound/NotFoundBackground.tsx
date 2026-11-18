"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Cinematic Brutalist Architectural Background for 404 — Signal Lost.
 * Features:
 * - Monumental angular concrete structure with illuminated Signal Orange portal.
 * - Multi-layer directional overlays ensuring high-contrast typography readability
 *   while preserving the luminous focal portal and lone figure.
 * - Deep Charcoal fallback background (`#08090A`).
 */
export function NotFoundBackground() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#08090A]"
    >
      {/* Fallback architectural gradient while asset loads */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_55%,rgba(240,100,25,0.18)_0%,rgba(8,9,10,0.85)_50%,#08090A_100%)]" />

      {/* Main Photographic Asset */}
      <Image
        src="/images/404/edyrex-404-background.jpg"
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "object-cover object-center w-full h-full transition-opacity duration-700 ease-out select-none",
          isLoaded ? "opacity-90" : "opacity-0"
        )}
      />

      {/* Multi-layer Cinematic Overlays */}
      {/* 1. Left-to-right gradient to keep main text area dark and readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,9,10,0.94) 0%, rgba(8,9,10,0.82) 28%, rgba(8,9,10,0.35) 55%, rgba(8,9,10,0.7) 100%)",
        }}
      />

      {/* 2. Top-to-bottom vignette gradient for navigation and footer contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,9,10,0.78) 0%, transparent 22%, transparent 72%, rgba(8,9,10,0.92) 100%)",
        }}
      />

      {/* 3. Subtle corner radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(8,9,10,0.6)_100%)]" />
    </div>
  );
}
