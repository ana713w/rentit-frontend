import { Link } from 'react-router-dom'
import { useItem, usePrimaryImage } from '../../../hooks'
import { RESERVATION_STATUS } from '../../../lib/constants'
import { countNights, formatCurrency, formatDate } from '../../../lib/format'
import { Icon, ImagePlaceholder, StatusBadge } from '../../ui'

/**
 * Fila de reserva para los listados. Las listas no traen el título del objeto,
 * así que lo pide con useItem. actions: botones opcionales (aceptar/rechazar...).
 */
function ReservationCard({ reservation, actions }) {
  const { data: item, error } = useItem(reservation.item_id)
  const imageUrl = usePrimaryImage(reservation.item_id)
  const days = countNights(reservation.start_date, reservation.end_date)
  const total = days * Number(reservation.price_per_day)

  return (
    <article className="flex flex-col gap-3 rounded-card bg-surface p-3 shadow-card transition-shadow hover:shadow-card-hover sm:flex-row sm:items-center sm:gap-4">
      <Link to={`/reservations/${reservation.id}`} className="flex min-w-0 flex-1 items-center gap-4 text-fg hover:text-fg">
        <div className="size-20 shrink-0 overflow-hidden rounded-input bg-surface-muted">
          {imageUrl ? (
            <img src={imageUrl} alt="" loading="lazy" className="size-full object-cover" />
          ) : (
            <ImagePlaceholder label="" className="size-full" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base">{item?.title || (error ? 'Objeto no disponible' : 'Cargando...')}</h3>
            <StatusBadge status={reservation.status} map={RESERVATION_STATUS} />
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-fg-muted">
            <Icon name="calendar_month" className="text-base" />
            {formatDate(reservation.start_date)} → {formatDate(reservation.end_date)}
          </p>
          <p className="mt-0.5 text-sm text-fg-muted">
            {days} {days === 1 ? 'día' : 'días'} ·{' '}
            <span className="font-bold text-primary-strong">{formatCurrency(total)}</span>
          </p>
        </div>
      </Link>
      {actions && <div className="shrink-0 sm:pr-2">{actions}</div>}
    </article>
  )
}

export default ReservationCard
