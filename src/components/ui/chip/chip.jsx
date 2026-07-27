import { cn } from '../../../lib/cn'
import Icon from '../icon/icon'

/**
 * Chip de filtro en píldora. Activo = turquesa relleno.
 *   <Chip active={x === 'all'} onClick={() => setX('all')} count={3}>Todas</Chip>
 */
function Chip({ active = false, icon, count, onClick, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-control px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors',
        active
          ? 'bg-primary text-on-primary shadow-primary'
          : 'bg-surface text-fg-muted shadow-card hover:bg-surface-muted hover:text-fg',
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} className="text-lg" />}
      {children}
      {count !== undefined && (
        <span
          className={cn(
            'rounded-control px-1.5 text-xs',
            active ? 'bg-on-primary/25 text-on-primary' : 'bg-surface-muted text-fg-muted',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}

export default Chip
