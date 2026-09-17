import { http } from '../lib/api'

export const createDispute = (reservationId, { reason, requestedCaptureAmount }) =>
  http.post(`/reservations/${reservationId}/disputes`, {
    reason,
    ...(requestedCaptureAmount ? { requestedCaptureAmount: Number(requestedCaptureAmount) } : {}),
  })

export const listReservationDisputes = (reservationId) => http.get(`/reservations/${reservationId}/disputes`)
export const getDispute = (id) => http.get(`/disputes/${id}`)

// Admin
export const listAllDisputes = () => http.get('/disputes')
export const startDisputeReview = (id) => http.patch(`/disputes/${id}/start-review`)

export const resolveDispute = (id, { resolution, depositAction = 'none', captureAmount }) =>
  http.patch(`/disputes/${id}/resolve`, {
    resolution,
    depositAction,
    ...(depositAction === 'capture' && captureAmount ? { captureAmount: Number(captureAmount) } : {}),
  })
