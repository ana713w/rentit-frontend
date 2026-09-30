import { useState } from 'react'
import { useAction, useFetch } from '../../../hooks'
import { createPayment, getPayment } from '../../../services'
import { Alert, AsyncContent, Button, Card } from '../../ui'
import StripePaymentForm from '../stripe-payment-form/stripe-payment-form'
import PaymentSummary from '../payment-summary/payment-summary'
import DepositActions from '../deposit-actions/deposit-actions'

// 404 = aun no hay pago
const fetchPayment = (reservationId) =>
  getPayment(reservationId).catch((error) => (error.status === 404 ? null : Promise.reject(error)))

// Pago de una reserva (arrendatario y dueño)
function PaymentSection({ reservation, role, onChange }) {
  const { data: payment, loading, error, reload } = useFetch(() => fetchPayment(reservation.id), [reservation.id])
  // los client secrets solo llegan en el POST
  const [secrets, setSecrets] = useState(null)
  const start = useAction(() => createPayment(reservation.id))

  // avisa al padre si cambia el pago
  const refresh = () => {
    reload()
    onChange?.()
  }

  const handleStart = async () => {
    const { ok, data } = await start.run()
    if (ok) {
      setSecrets(data)
      refresh()
    }
  }

  const handlePaid = () => {
    setSecrets(null)
    refresh()
  }

  // usa los secrets del GET si llegan
  const activeSecrets = secrets || (payment?.rent_status === 'pending' && payment?.rentClientSecret ? payment : null)

  const isGuest = role === 'guest'
  const canPay = isGuest && reservation.status === 'confirmed'

  return (
    <Card
      icon="payments"
      title="Pago"
      subtitle="El alquiler se cobra al pagar; el depósito solo se retiene hasta después del check-out."
      actions={
        payment && (
          <Button size="sm" variant="ghost" onClick={refresh} loading={loading}>
            Actualizar estado
          </Button>
        )
      }
    >
      <AsyncContent loading={loading} error={error} data={payment || (loading || error ? null : {})} onRetry={reload}>
        {() => (
          <div className="flex flex-col gap-4">
            {payment && <PaymentSummary payment={payment} showPlatformFee={!isGuest} />}

            {/* Arrendatario */}
            {canPay && activeSecrets && (
              <StripePaymentForm
                rentClientSecret={activeSecrets.rentClientSecret}
                depositClientSecret={activeSecrets.depositClientSecret}
                rentAmount={activeSecrets.rent_amount ?? payment?.rent_amount}
                depositAmount={activeSecrets.deposit_amount ?? payment?.deposit_amount}
                onPaid={handlePaid}
              />
            )}

            {canPay && !payment && !activeSecrets && (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-fg-muted">El propietario ha aceptado tu solicitud. Completa el pago para cerrarla.</p>
                <div>
                  <Button onClick={handleStart} loading={start.loading}>
                    Pagar ahora
                  </Button>
                </div>
              </div>
            )}

            {isGuest && payment?.rent_status === 'pending' && !activeSecrets && (
              <Alert tone="info">
                El pago está en proceso. Los estados se actualizan al recibir la confirmación de Stripe: pulsa «Actualizar
                estado» en unos segundos.
              </Alert>
            )}

            {start.error && (
              <Alert
                error={
                  start.error.status === 409
                    ? { message: 'Ya se inició un pago para esta reserva. Actualiza el estado para verlo.' }
                    : start.error
                }
              />
            )}

            {/* Dueño */}
            {!isGuest && !payment && <p className="text-sm text-fg-muted">Quien alquila todavía no ha pagado.</p>}

            {!isGuest && payment?.deposit_status === 'authorized' && reservation.status === 'completed' && (
              <DepositActions paymentId={payment.id} depositAmount={payment.deposit_amount} onChange={refresh} />
            )}

            {isGuest && !payment && !canPay && <p className="text-sm text-fg-muted">No hay pagos para esta reserva.</p>}
          </div>
        )}
      </AsyncContent>
    </Card>
  )
}

export default PaymentSection
