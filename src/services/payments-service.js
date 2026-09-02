import { http } from '../lib/api'

// Stripe Connect (dueño)
export const startOnboarding = () => http.post('/payments/onboarding')
// Pide el enlace de alta (o de retomarla si caducó) y redirige a Stripe
export const redirectToOnboarding = async () => {
  const { url } = await startOnboarding()
  window.location.href = url
}

export const getOnboardingStatus = () => http.get('/payments/onboarding/status')

// Pago de una reserva. Ojo: :id en capture/release es el id del PAGO, no de la reserva.
export const createPayment = (reservationId) => http.post(`/reservations/${reservationId}/payments`)
export const getPayment = (reservationId) => http.get(`/reservations/${reservationId}/payments`)

export const captureDeposit = (paymentId, amountToCapture) =>
  http.post(`/payments/${paymentId}/capture-deposit`, amountToCapture ? { amountToCapture: Number(amountToCapture) } : {})

export const releaseDeposit = (paymentId) => http.post(`/payments/${paymentId}/release-deposit`)
