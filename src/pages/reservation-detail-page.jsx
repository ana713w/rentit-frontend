import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuthContext, useFetch, useItem, usePrimaryImage } from '../hooks'
import { getReservation } from '../services'
import { RESERVATION_ROLES, RESERVATION_STATUS } from '../lib/constants'
import { countNights, formatCurrency, formatDate } from '../lib/format'
import { ReservationActions, ReservationTimeline } from '../components/reservations'
import { PaymentSection } from '../components/payments'
import { ContractsSection } from '../components/contracts'
import { VerificationsSection } from '../components/verifications'
import { DisputesSection } from '../components/disputes'
import { Alert, AsyncContent, Card, DetailList, ImagePlaceholder, StatusBadge } from '../components/ui'

// Mensaje de ayuda según estado y rol
const STATUS_HINTS = {
  pending: {
    guest: 'Tu solicitud está pendiente de que el propietario la acepte.',
    owner: 'Tienes una solicitud nueva: acéptala o recházala.',
  },
  confirmed: {
    guest: 'Solicitud aceptada. Paga, firma el contrato de entrega y haz el check-in con fotos al recoger el objeto.',
    owner: 'Solicitud aceptada. Firma el contrato y haz el check-in y el check-out con fotos.',
  },
  completed: {
    guest: 'Alquiler terminado. Si algo no fue bien, puedes abrir una disputa.',
    owner: 'Alquiler terminado. Decide qué hacer con la fianza.',
  },
}

function ReservationSummary({ reservation, item, role }) {
  const days = countNights(reservation.start_date, reservation.end_date)

  return (
    <Card icon="receipt_long" title="Resumen">
      <DetailList
        columns={3}
        items={[
          { label: 'Objeto', value: item ? <Link to={`/items/${item.id}`}>{item.title}</Link> : '—' },
          { label: 'Recogida', value: formatDate(reservation.start_date) },
          { label: 'Devolución', value: formatDate(reservation.end_date) },
          { label: 'Duración', value: `${days} ${days === 1 ? 'día' : 'días'}` },
          { label: 'Precio por día', value: formatCurrency(reservation.price_per_day) },
          { label: 'Total alquiler', value: formatCurrency(days * Number(reservation.price_per_day)) },
          { label: 'Fianza', value: formatCurrency(reservation.deposit_amount) },
          { label: 'Tu papel', value: RESERVATION_ROLES[role] },
        ]}
      />
    </Card>
  )
}

function ReservationDetailPage() {
  const { id } = useParams()
  const { user } = useAuthContext()
  const { data: reservation, loading, error, reload } = useFetch(() => getReservation(id), [id])
  const { data: item } = useItem(reservation?.item_id)
  const imageUrl = usePrimaryImage(reservation?.item_id)
  // Se incrementa cuando una sección cambia algo, para recalcular la línea de tiempo
  const [progressKey, setProgressKey] = useState(0)
  const bumpProgress = () => setProgressKey((key) => key + 1)

  if (error?.status === 403) return <Alert tone="danger">No tienes acceso a esta reserva.</Alert>

  return (
    <AsyncContent loading={loading} error={error} data={reservation} onRetry={reload}>
      {(r) => {
        const role = r.guest_id === user.id ? 'guest' : 'owner'
        const active = r.status === 'confirmed' || r.status === 'completed'
        const hint = STATUS_HINTS[r.status]?.[role]

        return (
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <header className="flex flex-wrap items-center gap-4">
              <div className="size-20 shrink-0 overflow-hidden rounded-card bg-surface-muted shadow-card">
                {imageUrl ? (
                  <img src={imageUrl} alt="" className="size-full object-cover" />
                ) : (
                  <ImagePlaceholder label="" className="size-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-extrabold sm:text-3xl">{item?.title || 'Reserva'}</h1>
                  <StatusBadge status={r.status} map={RESERVATION_STATUS} />
                </div>
                <p className="mt-1 text-sm text-fg-muted">
                  {formatDate(r.start_date)} → {formatDate(r.end_date)} · {RESERVATION_ROLES[role]}
                </p>
              </div>
              <ReservationActions reservation={r} role={role} onChange={reload} size="md" />
            </header>

            <ReservationTimeline reservation={r} refreshKey={progressKey} />

            {hint && <Alert tone="info">{hint}</Alert>}

            <ReservationSummary reservation={r} item={item} role={role} />

            {active && (
              <>
                <PaymentSection reservation={r} role={role} onChange={bumpProgress} />
                <ContractsSection reservationId={r.id} role={role} onChange={bumpProgress} />
                <VerificationsSection
                  reservationId={r.id}
                  userId={user.id}
                  onChange={bumpProgress}
                  onReservationChange={reload}
                />
                <DisputesSection reservationId={r.id} />
              </>
            )}
          </div>
        )
      }}
    </AsyncContent>
  )
}

export default ReservationDetailPage
