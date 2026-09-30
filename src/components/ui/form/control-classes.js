import { cn } from '../../../lib/cn'

// Clases comunes de input, select y textarea
export const controlClasses = (hasError) =>
  cn(
    'w-full rounded-input border bg-surface px-3.5 text-sm text-fg transition-colors',
    'placeholder:text-fg-subtle focus:outline-none focus:ring-3 focus:ring-primary/20',
    'disabled:cursor-not-allowed disabled:bg-surface-muted',
    hasError ? 'border-danger focus:border-danger' : 'border-line-strong focus:border-primary',
  )
