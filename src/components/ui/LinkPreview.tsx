"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

export interface LinkMetadata {
  url: string;
  hostname: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  favicon: string | null;
}

export interface LinkPreviewProps {
  url: string;
  className?: string;
  onMetadataLoaded?: (meta: LinkMetadata) => void;
}

/**
 * LinkPreview component with SSRF-protected metadata fetching.
 * Features:
 * - "skeletons no spinners"
 * - "no loader under 300ms"
 * - Progressive blur-in for remote thumbnails
 * - Graceful fallback on broken URLs or offline networks
 */
export function LinkPreview({ url, className, onMetadataLoaded }: LinkPreviewProps) {
  const [data, setData] = useState<LinkMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const trimmed = url?.trim();
    if (!trimmed) {
      setData(null);
      setError(null);
      setIsLoading(false);
      setShowLoading(false);
      return;
    }

    let normalized = trimmed;
    if (!/^https?:\/\//i.test(normalized)) {
      if (normalized.includes(".")) {
        normalized = `https://${normalized}`;
      } else {
        setData(null);
        return;
      }
    }

    try {
      const parsed = new URL(normalized);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setData(null);
        return;
      }
    } catch {
      setData(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    // "no loader under 300ms": only display loading skeleton if request takes > 300ms
    const loaderTimer = setTimeout(() => {
      if (isMounted) setShowLoading(true);
    }, 300);

    // Debounce network request by 450ms
    const debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/link-preview?url=${encodeURIComponent(normalized)}`);
        if (!res.ok) {
          throw new Error(`Failed to preview (${res.status})`);
        }
        const json = await res.json();
        if (isMounted) {
          if (json.success && json.data) {
            setData(json.data);
            onMetadataLoaded?.(json.data);
          } else {
            setData(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Preview unavailable");
          setData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setShowLoading(false);
        }
      }
    }, 450);

    return () => {
      isMounted = false;
      clearTimeout(loaderTimer);
      clearTimeout(debounceTimer);
    };
  }, [url, onMetadataLoaded]);

  if (!url || !url.trim()) return null;

  let normalizedUrl = url.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    if (normalizedUrl.includes(".")) {
      normalizedUrl = `https://${normalizedUrl}`;
    } else {
      return null;
    }
  }

  try {
    const p = new URL(normalizedUrl);
    if (p.protocol !== "http:" && p.protocol !== "https:") return null;
  } catch {
    return null;
  }

  // Loader state only after 300ms ("no loader under 300ms", "skeletons no spinners")
  if (isLoading && showLoading) {
    return (
      <div
        className={cn(
          "flex items-center gap-3.5 p-3 rounded-[10px] bg-[#0E1012] border border-[#252A32] animate-shimmer",
          className
        )}
        aria-label="Loading link preview"
      >
        <Skeleton className="w-16 h-16 rounded-[8px] flex-shrink-0 bg-[#16191E]" />
        <div className="flex-1 space-y-2 min-w-0">
          <Skeleton className="h-3 w-1/3 bg-[#1C2026]" />
          <Skeleton className="h-4 w-3/4 bg-[#1C2026]" />
          <Skeleton className="h-3 w-1/2 bg-[#1C2026]" />
        </div>
      </div>
    );
  }

  if (error || !data || (!data.title && !data.description && !data.image)) {
    return null;
  }

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex items-center gap-3.5 p-3 rounded-[10px] bg-[#0E1012]/90 hover:bg-[#12151A] border border-[#252A32] hover:border-[#D6B77A]/40 transition-all duration-200 text-left overflow-hidden",
        className
      )}
      title={`Open ${data.hostname}`}
    >
      {/* Thumbnail */}
      {data.image ? (
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-[8px] overflow-hidden bg-[#16191E] flex-shrink-0 border border-[#252A32]/60">
          <img
            src={data.image}
            alt={data.title || data.hostname}
            className={cn(
              "w-full h-full object-cover transition-all duration-300",
              imgLoaded ? "blur-0 scale-100 opacity-100" : "blur-sm scale-105 opacity-50"
            )}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement).style.display = "none";
            }}
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-[8px] bg-[#16191E] flex items-center justify-center flex-shrink-0 border border-[#252A32]/60 text-[#D6B77A]">
          <Globe className="w-5 h-5 opacity-70" />
        </div>
      )}

      {/* Text Meta */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center gap-1.5 mb-1">
          {data.favicon ? (
            <img
              src={data.favicon}
              alt=""
              className="w-3.5 h-3.5 rounded-sm object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <Globe className="w-3 h-3 text-[#D6B77A]" />
          )}
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#D6B77A] truncate">
            {data.siteName || data.hostname}
          </span>
        </div>

        {data.title && (
          <h4 className="text-xs sm:text-sm font-medium text-[#F5F3EE] truncate group-hover:text-[#F06419] transition-colors">
            {data.title}
          </h4>
        )}

        {data.description && (
          <p className="text-[11px] text-[#898D94] line-clamp-1 sm:line-clamp-2 mt-0.5 leading-snug">
            {data.description}
          </p>
        )}
      </div>

      {/* External Link Action Arrow */}
      <div className="absolute right-3 top-3 text-[#898D94] group-hover:text-[#D6B77A] transition-colors">
        <ExternalLink className="w-3.5 h-3.5" />
      </div>
    </a>
  );
}
