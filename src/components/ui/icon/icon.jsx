import { cn } from '../../../lib/cn'

/**
 * Icono de Material Symbols Outlined (la fuente se carga en styles/main.css).
 *   <Icon name="favorite" filled className="text-xl" />
 * Tamaño con text-*: los iconos son texto.
 */
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
