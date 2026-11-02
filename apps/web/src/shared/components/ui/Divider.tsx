import { cn } from '@/shared/utils'

interface DividerProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export function Divider({ className, orientation = 'horizontal' }: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px',
        'bg-[#252A33]',
        className
      )}
    />
  )
}

