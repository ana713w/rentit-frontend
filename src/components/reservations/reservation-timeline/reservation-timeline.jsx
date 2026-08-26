import { useFetch } from '../../../hooks'
import { getPayment, listContracts, listVerifications } from '../../../services'
import { cn } from '../../../lib/cn'
import { Card, Icon } from '../../ui'

const FINAL_DEPOSIT_STATUSES = ['released', 'captured', 'canceled']

// El pago devuelve 404 mientras no exista: no es un error para la línea de tiempo
const fetchProgress = async (reservationId) => {
  const [contracts, payment, verifications] = await Promise.all([
    listContracts(reservationId).catch(() => []),
    getPayment(reservationId).catch(() => null),
    listVerifications(reservationId).catch(() => []),
  ])
  return { contracts, payment, verifications }
}

// Pasos de la reserva a partir de su estado, contratos, pago y verificaciones
function buildSteps(reservation, { contracts, payment, verifications }) {
  const rental = contracts.find((contract) => contract.contract_type === 'rental')
  const has = (type) => verifications.some((verification) => verification.verification_type === type)
  const accepted = ['confirmed', 'completed'].includes(reservation.status)

  return [
    { label: 'Solicitada', icon: 'send', done: true },
    { label: 'Aceptada', icon: 'thumb_up', done: accepted },
    { label: 'Contrato firmado', icon: 'contract_edit', done: Boolean(rental?.guest_signed_at && rental?.owner_signed_at) },
    { label: 'Pagada', icon: 'payments', done: payment?.rent_status === 'succeeded' },
    { label: 'Check-in', icon: 'login', done: has('check_in') },
    { label: 'Check-out', icon: 'logout', done: has('check_out') },
    {
      label: 'Finalizada',
      icon: 'verified',
      done: reservation.status === 'completed' && FINAL_DEPOSIT_STATUSES.includes(payment?.deposit_status),
    },
  ]
}

/**
 * Solicitada → Aceptada → Contrato firmado → Pagada → Check-in → Check-out → Finalizada.
 * refreshKey: el padre lo incrementa cuando una sección cambia algo, para recalcular.
 */
function ReservationTimeline({ reservation, refreshKey = 0 }) {
  const { data } = useFetch(() => fetchProgress(reservation.id), [reservation.id, reservation.status, refreshKey])

  if (['rejected', 'cancelled'].includes(reservation.status)) {
    return (
      <Card>
        <p className="flex items-center gap-2 text-sm font-semibold text-fg-muted">
          <Icon name="block" className="text-xl text-danger" />
          {reservation.status === 'rejected' ? 'El propietario rechazó esta solicitud.' : 'Esta reserva se canceló.'}
        </p>
      </Card>
    )
  }

  const steps = buildSteps(reservation, data || { contracts: [], payment: null, verifications: [] })
  const current = steps.findIndex((step) => !step.done)

  return (
    <Card padded={false} className="overflow-x-auto px-4 py-5 scrollbar-none sm:px-6">
      <ol className="flex min-w-[40rem] items-start">
        {steps.map((step, index) => {
          const isCurrent = index === current
          return (
            <li key={step.label} className="relative flex flex-1 flex-col items-center gap-2 text-center">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute top-5 right-1/2 h-0.5 w-full -translate-y-1/2',
                    step.done || isCurrent ? 'bg-primary' : 'bg-line',
                  )}
                />
              )}
              <span
                className={cn(
                  'relative z-10 flex size-10 items-center justify-center rounded-full transition-colors',
                  step.done && 'bg-primary text-on-primary',
                  isCurrent && 'bg-surface text-primary-strong ring-2 ring-primary',
                  !step.done && !isCurrent && 'bg-surface-muted text-fg-subtle',
                )}
              >
                <Icon name={step.done ? 'check' : step.icon} className="text-xl" />
              </span>
              <span
                className={cn(
                  'text-xs',
                  step.done ? 'font-bold text-fg' : isCurrent ? 'font-bold text-primary-strong' : 'font-semibold text-fg-muted',
                )}
              >
                {step.label}
              </span>
              <span className="sr-only">{step.done ? '(hecho)' : isCurrent ? '(paso actual)' : '(pendiente)'}</span>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

export default ReservationTimeline
