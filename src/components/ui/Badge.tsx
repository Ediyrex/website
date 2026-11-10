import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "concept" | "featured" | "accent" | "outline" | "branding" | "media" | "digital" | "ai";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-[#12151A] text-[#B2B4BA] border-[#252A32]",
    concept: "bg-[#E9B86A]/10 text-[#E9B86A] border-[#E9B86A]/30",
    featured: "bg-[#54C99A]/10 text-[#54C99A] border-[#54C99A]/30",
    accent: "bg-[#D6B77A]/10 text-[#D6B77A] border-[#D6B77A]/30",
    outline: "bg-transparent text-[#B2B4BA] border-[#252A32]",
    branding: "bg-[#D6B77A]/10 text-[#D6B77A] border-[#D6B77A]/30",
    media: "bg-[#E58A76]/10 text-[#E58A76] border-[#E58A76]/30",
    digital: "bg-[#7BA9F5]/10 text-[#7BA9F5] border-[#7BA9F5]/30",
    ai: "bg-[#B5A0F5]/10 text-[#B5A0F5] border-[#B5A0F5]/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
