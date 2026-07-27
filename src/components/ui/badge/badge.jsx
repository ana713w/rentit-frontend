import { cn } from '../../../lib/cn'

// Los tonos son semánticos; sus colores se definen en styles/main.css
const TONES = {
  primary: 'bg-primary-soft text-primary-strong',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  neutral: 'bg-neutral-soft text-neutral',
  // Sobre fotos: blanco translúcido con desenfoque
  glass: 'bg-surface/90 text-primary-strong shadow-card backdrop-blur-md',
}

function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-control px-2.5 py-0.5 text-xs font-bold whitespace-nowrap',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/**
 * Badge a partir de un mapa de estados de lib/constants.js
 *   <StatusBadge status={reservation.status} map={RESERVATION_STATUS} />
 */
export function StatusBadge({ status, map, className }) {
  const config = map[status] || { label: status, tone: 'neutral' }
  return (
    <Badge tone={config.tone} className={className}>
      <span className="size-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  )
}

export default Badge
