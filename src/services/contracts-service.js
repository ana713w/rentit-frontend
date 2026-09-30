import { http } from '../lib/api'

export const createContract = (reservationId, contractType) =>
  http.post(`/reservations/${reservationId}/contracts`, { contractType })

export const listContracts = (reservationId) => http.get(`/reservations/${reservationId}/contracts`)
export const getContract = (id) => http.get(`/contracts/${id}`)

export const requestContractOtp = (id) => http.post(`/contracts/${id}/otp`)

// OTP como string por los ceros iniciales
export const signContract = (id, otp) => http.post(`/contracts/${id}/sign`, { otp: String(otp), accepted: true })
