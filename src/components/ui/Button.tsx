import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  external,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-semibold rounded-[8px] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090B]";

  const sizeStyles = {
    sm: "h-9 px-4 text-xs gap-1.5",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-12 px-7 text-sm gap-2",
  };

  const variantStyles = {
    primary:
      "bg-[#D6B77A] text-[#17130B] hover:bg-[#E6CC99] hover:-translate-y-[1px] active:translate-y-0",
    secondary:
      "bg-[#12151A] text-[#F5F3EE] border border-[#252A32] hover:bg-[#191D23] hover:border-[#3A414B]",
    outline:
      "bg-transparent text-[#F5F3EE] border border-[#3A414B] hover:bg-[#12151A] hover:border-[#D6B77A]/60",
    ghost:
      "bg-transparent text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#12151A]",
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
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
