import { cn } from '@/shared/utils'

interface SectionHeadingProps {
  label?: string
  title: string
  titleHighlight?: string // portion of title rendered in accent gradient
  description?: string
  align?: 'left' | 'center'
  size?: 'md' | 'lg'
  className?: string
}

export function SectionHeading({
  label,
  title,
  titleHighlight,
  description,
  align = 'left',
  size = 'lg',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center'

  // Split title around highlight if provided
  const renderTitle = () => {
    if (!titleHighlight) {
      return <span>{title}</span>
    }
    const parts = title.split(titleHighlight)
    return (
      <>
        {parts[0]}
        <span className="text-gradient-accent">{titleHighlight}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', centered && 'items-center text-center', className)}>
      {label && (
        <span className="label-mono inline-flex items-center gap-2">
          <span
            className="inline-block h-px w-6 bg-[#D6B77A]/50"
            aria-hidden="true"
          />
          {label}
        </span>
      )}

      <h2
        className={cn(
          'font-heading font-bold text-[#F0EDE8] tracking-tight',
          size === 'lg' && 'text-[clamp(1.875rem,4vw,3rem)]',
          size === 'md' && 'text-[clamp(1.375rem,2.5vw,2rem)]',
          centered ? 'max-w-3xl' : 'max-w-2xl'
        )}
      >
        {renderTitle()}
      </h2>

      {description && (
        <p
          className={cn(
            'text-[#9AA0AB] leading-relaxed',
            size === 'lg' && 'text-lg',
            size === 'md' && 'text-base',
            centered ? 'max-w-2xl' : 'max-w-xl'
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}

