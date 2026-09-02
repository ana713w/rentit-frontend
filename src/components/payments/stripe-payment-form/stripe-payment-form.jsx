import { useState } from 'react'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { getCardElementStyle, stripePromise } from '../../../lib/stripe'
import { formatCurrency } from '../../../lib/format'
import { Alert, Button } from '../../ui'

function CardPaymentForm({ rentClientSecret, depositClientSecret, rentAmount, depositAmount, onPaid }) {
  const stripe = useStripe()
  const elements = useElements()
  const [rentPaid, setRentPaid] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError(null)
    const card = elements.getElement(CardElement)

    // 1. Alquiler (se cobra). Si ya se cobró en un intento anterior, no se repite.
    if (!rentPaid) {
      const rent = await stripe.confirmCardPayment(rentClientSecret, { payment_method: { card } })
      if (rent.error) {
        setError(rent.error)
        setProcessing(false)
        return
      }
      setRentPaid(true)
    }

    // 2. Depósito (solo se retiene)
    const deposit = await stripe.confirmCardPayment(depositClientSecret, { payment_method: { card } })
    setProcessing(false)
    if (deposit.error) {
      setError(deposit.error)
      return
    }

    onPaid?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <dl className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-fg-muted">Alquiler (se cobra ahora)</dt>
          <dd className="font-medium">{formatCurrency(rentAmount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-fg-muted">Depósito (solo se retiene)</dt>
          <dd className="font-medium">{formatCurrency(depositAmount)}</dd>
        </div>
      </dl>

      <div className="rounded-input border border-line-strong bg-surface px-3.5 py-3.5">
        <CardElement options={{ style: getCardElementStyle(), hidePostalCode: true }} />
      </div>

      {rentPaid && <Alert tone="success">Alquiler pagado. Falta confirmar la retención del depósito.</Alert>}
      <Alert error={error} />

      <Button type="submit" loading={processing} disabled={!stripe}>
        {rentPaid ? 'Confirmar depósito' : 'Pagar'}
      </Button>
      <p className="text-xs text-fg-muted">Modo prueba: tarjeta 4242 4242 4242 4242, cualquier fecha futura y CVC.</p>
    </form>
  )
}

/**
 * Pago con tarjeta de los dos cargos de una reserva (alquiler + depósito) con la misma tarjeta.
 */
function StripePaymentForm(props) {
  if (!stripePromise) {
    return <Alert tone="warning">Falta VITE_STRIPE_PUBLISHABLE_KEY en el archivo .env</Alert>
  }

  return (
    <Elements stripe={stripePromise}>
      <CardPaymentForm {...props} />
    </Elements>
  )
}

export default StripePaymentForm
