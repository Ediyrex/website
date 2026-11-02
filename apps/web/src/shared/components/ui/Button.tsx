import { cn } from '@/shared/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-[#D6B77A] text-[#08090B] font-semibold',
    'hover:bg-[#E8CFA0] active:bg-[#A88A52]',
    'shadow-[0_0_24px_rgba(214,183,122,0.2)]',
    'hover:shadow-[0_0_32px_rgba(214,183,122,0.35)]',
  ].join(' '),
  secondary: [
    'bg-transparent text-[#D6B77A] font-medium',
    'border border-[#D6B77A]/40',
    'hover:border-[#D6B77A] hover:bg-[#D6B77A]/8',
    'active:bg-[#D6B77A]/12',
  ].join(' '),
  ghost: [
    'bg-transparent text-[#F0EDE8] font-medium',
    'hover:bg-[#F0EDE8]/6 active:bg-[#F0EDE8]/10',
  ].join(' '),
  link: [
    'bg-transparent text-[#D6B77A] font-medium p-0 h-auto',
    'underline-offset-4 hover:underline',
  ].join(' '),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5 rounded-[0.5rem]',
  md: 'h-11 px-6 text-sm gap-2 rounded-[0.625rem]',
  lg: 'h-13 px-8 text-base gap-2.5 rounded-[0.75rem]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base
          'inline-flex items-center justify-center',
          'font-body tracking-wide',
          'transition-all duration-200 ease-out',
          'cursor-pointer select-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6B77A]',
          // Disabled
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          // Variant + size
          variantStyles[variant],
          variant !== 'link' && sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>Loading…</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

