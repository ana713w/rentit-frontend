import { http } from '../lib/api'

export const createVerification = (reservationId, verification) =>
  http.post(`/reservations/${reservationId}/verifications`, verification)

export const listVerifications = (reservationId) => http.get(`/reservations/${reservationId}/verifications`)
export const getVerification = (id) => http.get(`/verifications/${id}`)

export const updateVerificationNotes = (id, notes) => http.patch(`/verifications/${id}`, { notes })

export const listVerificationPhotos = (id) => http.get(`/verifications/${id}/photos`)

export const uploadVerificationPhotos = (id, files) => {
  const form = new FormData()
  files.forEach((file) => form.append('images', file))
  return http.post(`/verifications/${id}/photos`, form)
}

export const deleteVerificationPhoto = (id, photoId) => http.delete(`/verifications/${id}/photos/${photoId}`)
