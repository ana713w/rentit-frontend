import { Link, useParams } from 'react-router-dom'
import { useAuthContext, useFetch, useItem, usePrimaryImage } from '../hooks'
import { getReservation } from '../services'
import { RESERVATION_ROLES, RESERVATION_STATUS } from '../lib/constants'
import { countNights, formatCurrency, formatDate } from '../lib/format'
import { fetchProgress, getFlow, getNextStep } from '../lib/reservation-flow'
import { ContactCard, ReservationActions, ReservationTimeline } from '../components/reservations'
import { PaymentSection } from '../components/payments'
import { ContractsSection } from '../components/contracts'
import { VerificationsSection } from '../components/verifications'
import { DisputesSection } from '../components/disputes'
import { Alert, AsyncContent, Card, DetailList, ImagePlaceholder, StatusBadge } from '../components/ui'

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
  // pago, contratos y verificaciones: deciden que paso esta disponible
  const progress = useFetch(() => fetchProgress(id), [id, reservation?.status])
  const bumpProgress = progress.reload

  if (error?.status === 403) return <Alert tone="danger">No tienes acceso a esta reserva.</Alert>

  return (
    <AsyncContent loading={loading} error={error} data={reservation} onRetry={reload}>
      {(r) => {
        const role = r.guest_id === user.id ? 'guest' : 'owner'
        const active = r.status === 'confirmed' || r.status === 'completed'
        const flow = getFlow(r, progress.data)
        const next = getNextStep(r, flow, role)

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

            <ReservationTimeline reservation={r} flow={flow} />

            {next && (
              <Alert tone={next.tone || 'info'} title={next.title}>
                {next.text}
              </Alert>
            )}

            <ReservationSummary reservation={r} item={item} role={role} />

            {r.counterpart && <ContactCard counterpart={r.counterpart} />}

            {active && (
              <>
                <PaymentSection reservation={r} role={role} flow={flow} onChange={bumpProgress} />
                <ContractsSection reservationId={r.id} role={role} flow={flow} onChange={bumpProgress} />
                <VerificationsSection
                  reservationId={r.id}
                  userId={user.id}
                  flow={flow}
                  onChange={bumpProgress}
                  onReservationChange={reload}
                />
                <DisputesSection reservationId={r.id} canOpen={flow.checkIn} />
              </>
            )}
          </div>
        )
      }}
    </AsyncContent>
  )
}

export default ReservationDetailPage
