"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { buildOptimizedMediaUrl } from "@/lib/server/cloudinary";

export interface CloudinaryImageProps extends Omit<ImageProps, "src"> {
  src: string;
  width?: number;
  height?: number;
  alt: string;
  aspectRatio?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Reusable Cloudinary Image component that applies automatic format and quality optimization (f_auto, q_auto),
 * responsive scaling, and smooth loading transitions.
 */
export function CloudinaryImage({
  src,
  width,
  height,
  alt,
  aspectRatio,
  className = "",
  priority = false,
  ...rest
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Generate optimized delivery URL with f_auto,q_auto if on Cloudinary
  const optimizedSrc = buildOptimizedMediaUrl(src, width);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <Image
        src={optimizedSrc}
        alt={alt || "EDYREX media"}
        width={width || 800}
        height={height || 600}
        priority={priority}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
        }`}
        onLoad={() => setIsLoading(false)}
        {...rest}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-[#12151A] animate-pulse" />
      )}
    </div>
  );
}
