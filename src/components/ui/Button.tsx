"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
}

/**
 * High-performance EDYREX Button:
 * - "Replay in 100 ms": duration-75 active:scale-[0.97] for instant tactile recovery
 * - "Press before the lift": initiates prefetching/action on pointerdown
 * - "preload the next tap": prefetches linked routes on hover and pointerdown
 */
export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  external,
  children,
  onPointerDown,
  onPointerEnter,
  ...props
}: ButtonProps) {
  const router = useRouter();
  const prefetchedRef = useRef(false);

  const prefetchTarget = () => {
    if (href && !external && !prefetchedRef.current && href.startsWith("/")) {
      router.prefetch(href);
      prefetchedRef.current = true;
    }
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    prefetchTarget();
    if (onPointerDown) {
      onPointerDown(e as unknown as React.PointerEvent<HTMLButtonElement>);
    }
  };

  const handlePointerEnter = (
    e: React.PointerEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    prefetchTarget();
    if (onPointerEnter) {
      onPointerEnter(e as unknown as React.PointerEvent<HTMLButtonElement>);
    }
  };

  const baseStyles =
    "inline-flex items-center justify-center font-sans font-semibold rounded-[8px] transition-all duration-120 ease-out active:scale-[0.97] active:scale-y-[0.95] cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090B] touch-manipulation select-none";

  const sizeStyles = {
    sm: "h-9 min-h-[38px] px-4 text-xs gap-1.5 touch-target-expansion",
    md: "h-11 min-h-[44px] px-5 text-sm gap-2",
    lg: "h-12 min-h-[48px] px-7 text-sm gap-2",
  };

  const variantStyles = {
    primary:
      "bg-[#F06419] text-[#090A0D] font-bold hover:bg-[#ff762b] hover:-translate-y-[1px] active:translate-y-0.5 shadow-md shadow-[#F06419]/20",
    secondary:
      "bg-[#12151A] text-[#F5F3EE] border border-[#252A32] hover:bg-[#191D23] hover:border-[#3A414B] hover:-translate-y-[1px] active:translate-y-0",
    outline:
      "bg-transparent text-[#F5F2EC] border border-[#F06419] hover:bg-[#F06419]/10 hover:-translate-y-[1px] active:translate-y-0",
    ghost:
      "bg-transparent text-[#B2B4BA] hover:text-[#F5F2EC] hover:bg-[#12151A] active:scale-[0.98]",
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
          onPointerDown={handlePointerDown}
          onPointerEnter={handlePointerEnter}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={combinedClasses}
        onPointerDown={handlePointerDown}
        onPointerEnter={handlePointerEnter}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={combinedClasses}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      {...props}
    >
      {children}
    </button>
  );
}
