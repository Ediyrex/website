"use client";

import React, { useMemo, useState } from "react";
import {
  ExternalLink,
  Play,
  Film,
  Tv,
  Smartphone,
  Sparkles,
  Video,
} from "lucide-react";

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export type VideoPlatform =
  | "youtube"
  | "youtube_shorts"
  | "instagram"
  | "vimeo"
  | "direct"
  | "unknown";

export type FrameLayout = "smartphone" | "cinema_screen" | "minimal";

export interface SocialVideoFrameProps {
  url: string;
  title?: string;
  description?: string;
  layout?: FrameLayout;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

/**
 * Parses and extracts embed info from YouTube, Shorts, Instagram, Vimeo, or direct URLs.
 */
export function parseVideoUrl(url: string): {
  platform: VideoPlatform;
  embedUrl: string | null;
  directSrc: string | null;
  isVertical: boolean;
} {
  if (!url || typeof url !== "string") {
    return { platform: "unknown", embedUrl: null, directSrc: null, isVertical: false };
  }

  const clean = url.trim();

  // YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
  const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (shortsMatch && shortsMatch[1]) {
    return {
      platform: "youtube_shorts",
      embedUrl: `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`,
      directSrc: null,
      isVertical: true,
    };
  }

  // YouTube Standard: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
  const ytMatch = clean.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      platform: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      directSrc: null,
      isVertical: false,
    };
  }

  // Instagram Reels: https://www.instagram.com/reel/CODE/ or /p/CODE/
  const igMatch = clean.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch && igMatch[1]) {
    return {
      platform: "instagram",
      embedUrl: `https://www.instagram.com/reel/${igMatch[1]}/embed/captioned/`,
      directSrc: null,
      isVertical: true,
    };
  }

  // Vimeo: https://vimeo.com/VIDEO_ID
  const vimeoMatch = clean.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      platform: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      directSrc: null,
      isVertical: false,
    };
  }

  // Direct MP4 / WebM video file
  if (/\.(mp4|webm|mov)$/i.test(clean) || clean.includes("/video/upload/")) {
    return {
      platform: "direct",
      embedUrl: null,
      directSrc: clean,
      isVertical: false,
    };
  }

  return { platform: "unknown", embedUrl: null, directSrc: clean, isVertical: false };
}

export function SocialVideoFrame({
  url,
  title,
  description,
  layout,
  poster,
  autoPlay = false,
  className = "",
}: SocialVideoFrameProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const parsed = useMemo(() => parseVideoUrl(url), [url]);

  // Determine frame layout: if vertical and layout not forced, default to smartphone
  const activeLayout: FrameLayout =
    layout || (parsed.isVertical ? "smartphone" : "cinema_screen");

  const platformIcon = useMemo(() => {
    switch (parsed.platform) {
      case "youtube":
      case "youtube_shorts":
        return <YoutubeIcon className="w-4 h-4 text-[#FF0000]" />;
      case "instagram":
        return <InstagramIcon className="w-4 h-4 text-[#E4405F]" />;
      case "vimeo":
        return <Tv className="w-4 h-4 text-[#1AB7EA]" />;
      default:
        return <Film className="w-4 h-4 text-[#D6B77A]" />;
    }
  }, [parsed.platform]);

  // Smartphone Layout (9:16 Vertical for Reels & Shorts)
  if (activeLayout === "smartphone") {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        {/* Smartphone Hardware Frame */}
        <div className="relative w-full max-w-[320px] sm:max-w-[340px] rounded-[44px] p-3.5 bg-gradient-to-b from-[#2A2E36] to-[#12151A] border-2 border-[#3D4450] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
          {/* Top Notch & Camera Pill */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-1 rounded-full bg-black/90 border border-[#252A32]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A1D24] border border-[#333842]" />
            <div className="w-10 h-1.5 rounded-full bg-[#1A1D24]" />
          </div>

          {/* Inner Display Screen */}
          <div className="relative w-full aspect-[9/16] rounded-[32px] overflow-hidden bg-black border border-[#1E232B]">
            {isPlaying && parsed.embedUrl ? (
              <iframe
                src={parsed.embedUrl}
                title={title || "EDYREX Short Form Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : isPlaying && parsed.directSrc ? (
              <video
                src={parsed.directSrc}
                poster={poster}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                className="relative w-full h-full bg-[#08090B] flex flex-col justify-between p-5 cursor-pointer group"
                style={
                  poster
                    ? {
                        backgroundImage: `url(${poster})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/90 pointer-events-none" />

                {/* Top Platform Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#3A414B] text-[11px] font-mono text-[#F5F3EE]">
                    {platformIcon}
                    <span className="capitalize">
                      {parsed.platform === "youtube_shorts"
                        ? "Shorts"
                        : parsed.platform === "instagram"
                        ? "Reels"
                        : parsed.platform}
                    </span>
                  </span>

                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-full bg-black/60 text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                    title="Open in platform"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Center Play Button */}
                <div className="relative z-10 flex items-center justify-center my-auto">
                  <div className="w-16 h-16 rounded-full bg-[#F06419] text-[#12151A] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#FF762F] transition-transform">
                    <Play className="w-7 h-7 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom Meta */}
                <div className="relative z-10 space-y-1">
                  {title && (
                    <h4 className="text-sm font-bold text-[#F5F3EE] line-clamp-2">
                      {title}
                    </h4>
                  )}
                  {description && (
                    <p className="text-[11px] text-[#B2B4BA] line-clamp-2">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {title && (
          <div className="text-center mt-3 space-y-0.5 max-w-[320px]">
            <p className="text-xs font-mono text-[#D6B77A] font-semibold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>EDYREX REELS &amp; SHORTS</span>
            </p>
          </div>
        )}
      </div>
    );
  }

  // Cinema Screen Layout (16:9 Widescreen Studio Display)
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Studio Screen Display Frame */}
      <div className="relative rounded-2xl bg-[#0E1014] border border-[#252A32] shadow-2xl overflow-hidden group">
        {/* Top Screen Bezel Bar */}
        <div className="px-4 py-2.5 bg-[#12151A] border-b border-[#252A32] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/60" />
            </div>
            <span className="text-[#777D87] pl-2 hidden sm:inline">
              EDYREX STUDIO SHOWCASE / 4K
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-[#B2B4BA]">
              {platformIcon}
              <span className="capitalize">{parsed.platform}</span>
            </span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded text-[#777D87] hover:text-[#F5F3EE] transition-colors"
              title="Open video link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 16:9 Screen Surface */}
        <div className="relative w-full aspect-video bg-black">
          {isPlaying && parsed.embedUrl ? (
            <iframe
              src={parsed.embedUrl}
              title={title || "EDYREX Showcase Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : isPlaying && parsed.directSrc ? (
            <video
              src={parsed.directSrc}
              poster={poster}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full bg-[#08090B] flex items-center justify-center cursor-pointer group"
              style={
                poster
                  ? {
                      backgroundImage: `url(${poster})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs group-hover:bg-black/40 transition-colors" />

              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D6B77A] text-[#08090B] flex items-center justify-center shadow-2xl group-hover:scale-105 group-hover:bg-[#E5CCA0] transition-transform">
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </div>
                {title && (
                  <span className="text-sm sm:text-base font-heading font-bold text-[#F5F3EE] px-4 text-center max-w-lg line-clamp-1">
                    {title}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {description && (
        <p className="text-xs sm:text-sm text-[#B2B4BA] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
