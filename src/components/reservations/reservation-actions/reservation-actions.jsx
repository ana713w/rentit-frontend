import { acceptReservation, cancelReservation, rejectReservation } from '../../../services'
import { ConfirmButton } from '../../ui'

// Botones de cambio de estado segun rol y estado
function ReservationActions({ reservation, role, onChange, size = 'sm' }) {
  const { id, status } = reservation
  const isOwner = role === 'owner'
  const canDecide = isOwner && status === 'pending'
  const canCancel = status === 'pending' || status === 'confirmed'

  if (!canDecide && !canCancel) return null

  const run = (action) => async () => onChange?.(await action(id))

  return (
    <div className="flex flex-wrap gap-2">
      {canDecide && (
        <>
          <ConfirmButton
            variant="primary"
            size={size}
            title="¿Aceptar la reserva?"
            message="Las demás solicitudes pendientes que se solapen con estas fechas se rechazarán automáticamente."
            confirmLabel="Aceptar"
            onConfirm={run(acceptReservation)}
          >
            Aceptar
          </ConfirmButton>
          <ConfirmButton
            variant="secondary"
            size={size}
            title="¿Rechazar la reserva?"
            confirmLabel="Rechazar"
            confirmVariant="danger"
            onConfirm={run(rejectReservation)}
          >
            Rechazar
          </ConfirmButton>
        </>
      )}
      {canCancel && (
        <ConfirmButton
          variant="danger-outline"
          size={size}
          title="¿Cancelar la reserva?"
          message={status === 'confirmed' ? 'También se cancelarán los pagos asociados en Stripe.' : undefined}
          confirmLabel="Cancelar reserva"
          onConfirm={run(cancelReservation)}
        >
          Cancelar
        </ConfirmButton>
      )}
    </div>
  )
}

export default ReservationActions
