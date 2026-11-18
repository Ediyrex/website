"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export interface BlurImageProps extends ImageProps {
  containerClassName?: string;
  aspectRatio?: string;
}

/**
 * Image component with progressive blur-in transition ("blur images in").
 * Mounts in a low-resolution blur state (`blur(14px) scale(1.03)`) and
 * transitions cleanly into sharp focus when loaded, with no layout shifts.
 */
export function BlurImage({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio,
  onLoad,
  priority = false,
  ...rest
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden bg-[#12151A]", containerClassName)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <Image
        src={src}
        alt={alt || "EDYREX visual asset"}
        priority={priority}
        className={cn(
          "w-full h-full object-cover transition-all duration-350 ease-out",
          isLoaded
            ? "blur-0 scale-100 opacity-100"
            : "blur-md scale-[1.04] opacity-50",
          className
        )}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
        {...rest}
      />
    </div>
  );
}
