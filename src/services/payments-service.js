import { http } from '../lib/api'

// Stripe Connect (dueño)
export const startOnboarding = () => http.post('/payments/onboarding')
// Enlace de alta y redireccion a Stripe
export const redirectToOnboarding = async () => {
  const { url } = await startOnboarding()
  window.location.href = url
}

export const getOnboardingStatus = () => http.get('/payments/onboarding/status')

// Ojo: :id en capture/release es el del pago
export const createPayment = (reservationId) => http.post(`/reservations/${reservationId}/payments`)
export const getPayment = (reservationId) => http.get(`/reservations/${reservationId}/payments`)

export const captureDeposit = (paymentId, amountToCapture) =>
  http.post(`/payments/${paymentId}/capture-deposit`, amountToCapture ? { amountToCapture: Number(amountToCapture) } : {})

export const releaseDeposit = (paymentId) => http.post(`/payments/${paymentId}/release-deposit`)
