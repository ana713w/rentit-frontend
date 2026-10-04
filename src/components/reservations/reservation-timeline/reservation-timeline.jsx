import { buildSteps } from '../../../lib/reservation-flow'
import { cn } from '../../../lib/cn'
import { Card, Icon } from '../../ui'

// Linea de tiempo del alquiler, flow viene de getFlow
function ReservationTimeline({ reservation, flow }) {
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

  const steps = buildSteps(reservation, flow)
  const current = steps.findIndex((step) => !step.done)

  return (
    <Card padded={false} className="overflow-x-auto px-4 py-5 scrollbar-none sm:px-6">
      <ol className="flex min-w-[48rem] items-start">
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
