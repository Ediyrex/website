import { cn } from '@/shared/utils'

type BadgeVariant = 'accent' | 'surface' | 'outline' | 'mono'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  accent: 'bg-[#D6B77A]/12 text-[#D6B77A] border border-[#D6B77A]/20',
  surface: 'bg-[#12151A] text-[#9AA0AB] border border-[#252A33]',
  outline: 'bg-transparent text-[#9AA0AB] border border-[#252A33]',
  mono: 'bg-transparent text-[#D6B77A] border-none font-mono uppercase tracking-widest',
}

export function Badge({ variant = 'accent', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'text-xs font-medium',
        'px-3 py-1 rounded-full',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

