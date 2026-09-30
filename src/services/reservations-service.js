import { http } from '../lib/api'
import { normalizeReservation } from '../lib/format'

export const createReservation = (reservation) => http.post('/reservations', reservation)

export const listMyReservations = () => http.get('/reservations/mine')
export const listOwnerReservations = () => http.get('/reservations/owner')

// normaliza date_range a start_date/end_date
export const getReservation = (id) => http.get(`/reservations/${id}`).then(normalizeReservation)

export const acceptReservation = (id) => http.patch(`/reservations/${id}/accept`)
export const rejectReservation = (id) => http.patch(`/reservations/${id}/reject`)
export const cancelReservation = (id) => http.patch(`/reservations/${id}/cancel`)
