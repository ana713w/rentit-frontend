import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAction, useFetch } from '../../../hooks'
import { getPayment, redirectToCheckout } from '../../../services'
import { formatCurrency, formatDate } from '../../../lib/format'
import { Alert, AsyncContent, Button, Card } from '../../ui'
import PaymentSummary from '../payment-summary/payment-summary'
import DepositActions from '../deposit-actions/deposit-actions'

// 404 = aun no hay pago
const fetchPayment = (reservationId) =>
  getPayment(reservationId).catch((error) => (error.status === 404 ? null : Promise.reject(error)))

// Pago de una reserva (arrendatario y dueño)
// El inquilino paga en la pagina de Stripe (Checkout) y vuelve con ?payment=success|cancelled
function PaymentSection({ reservation, role, flow, onChange }) {
  const { data: payment, loading, error, reload } = useFetch(() => fetchPayment(reservation.id), [reservation.id])
  const checkout = useAction(() => redirectToCheckout(reservation.id))
  const [searchParams, setSearchParams] = useSearchParams()
  // resultado de la vuelta desde Stripe, se lee una vez y se limpia la URL
  const [returnStatus] = useState(() => searchParams.get('payment'))

  useEffect(() => {
    if (!searchParams.has('payment')) return
    setSearchParams(
      (params) => {
        params.delete('payment')
        return params
      },
      { replace: true },
    )
  }, [searchParams, setSearchParams])

  // avisa al padre si cambia el pago
  const refresh = () => {
    reload()
    onChange?.()
  }

  const isGuest = role === 'guest'
  // se paga desde el dia antes de la recogida
  const notYet = !payment && !flow.preparationOpen
  const rentPaid = payment?.rent_status === 'succeeded'
  const canPay = isGuest && reservation.status === 'confirmed' && !notYet && !rentPaid

  return (
    <Card
      icon="payments"
      title="Pago"
      subtitle="El alquiler se cobra al pagar; la fianza solo se retiene en la tarjeta hasta después del check-out."
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
            {isGuest && returnStatus === 'success' && rentPaid && payment?.deposit_status === 'authorized' && (
              <Alert tone="success" title="Pago completado">
                Se ha cobrado el alquiler y la fianza ha quedado retenida en tu tarjeta.
              </Alert>
            )}
            {isGuest && returnStatus === 'cancelled' && !rentPaid && (
              <Alert tone="warning">Has salido de la página de pago sin pagar. Puedes intentarlo de nuevo cuando quieras.</Alert>
            )}

            {payment && <PaymentSummary payment={payment} showPlatformFee={!isGuest} />}

            {notYet && reservation.status === 'confirmed' && (
              <Alert tone="info" title={`Disponible a partir del ${formatDate(flow.opensOn)}`}>
                {isGuest ? 'Podrás pagar' : 'Quien alquila podrá pagar'} el día antes de la recogida. Así la fianza queda
                retenida durante todo el alquiler (Stripe solo la mantiene unos 7 días).
              </Alert>
            )}

            {/* Arrendatario */}
            {canPay && (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-fg-muted">
                  Te llevamos a la página segura de Stripe para pagar el alquiler. En la misma tarjeta se retendrá una fianza
                  de {formatCurrency(reservation.deposit_amount)}, que no se cobra salvo que haya daños. Es necesario para
                  hacer el check-in.
                </p>
                <div>
                  <Button icon="open_in_new" onClick={() => checkout.run()} loading={checkout.loading}>
                    {payment ? 'Continuar con el pago' : 'Pagar con Stripe'}
                  </Button>
                </div>
              </div>
            )}

            {isGuest && rentPaid && payment?.deposit_status === 'pending' && (
              <Alert tone="info">
                Alquiler pagado. Estamos reteniendo la fianza: pulsa «Actualizar estado» en unos segundos.
              </Alert>
            )}

            {rentPaid && payment?.deposit_status === 'failed' && (
              <Alert tone="danger" title="No se pudo retener la fianza">
                El banco rechazó la retención de la fianza en la tarjeta. Sin ella no se puede hacer el check-in: contacta
                con un administrador.
              </Alert>
            )}

            <Alert error={checkout.error} />

            {/* Dueño */}
            {!isGuest && !payment && !notYet && <p className="text-sm text-fg-muted">Quien alquila todavía no ha pagado.</p>}

            {!isGuest && payment?.deposit_status === 'authorized' && reservation.status === 'completed' && (
              <DepositActions paymentId={payment.id} depositAmount={payment.deposit_amount} onChange={refresh} />
            )}

            {isGuest && !payment && !canPay && !notYet && <p className="text-sm text-fg-muted">No hay pagos para esta reserva.</p>}
          </div>
        )}
      </AsyncContent>
    </Card>
  )
}

export default PaymentSection
