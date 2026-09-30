import { cn } from '../../../lib/cn'

// Icono de Material Symbols, tamaño con text-*
function Icon({ name, filled = false, className, label }) {
  return (
    <span
      className={cn('icon', filled && 'icon-filled', className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      {name}
    </span>
  )
}

export default Icon
