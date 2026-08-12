import { http } from '../lib/api'

// Objetos
export const listItems = () => http.get('/items')
export const getItem = (id) => http.get(`/items/${id}`)
export const createItem = (item) => http.post('/items', item)
export const updateItem = (id, item) => http.patch(`/items/${id}`, item)
export const deactivateItem = (id) => http.delete(`/items/${id}`)

// Imágenes
export const listItemImages = (id) => http.get(`/items/${id}/images`)

export const uploadItemImages = (id, files) => {
  const form = new FormData()
  files.forEach((file) => form.append('images', file))
  return http.post(`/items/${id}/images`, form)
}

export const setPrimaryImage = (id, imageId) => http.patch(`/items/${id}/images/${imageId}/primary`)
export const deleteItemImage = (id, imageId) => http.delete(`/items/${id}/images/${imageId}`)

// Fechas bloqueadas
export const listBlockedDates = (id) => http.get(`/items/${id}/blocked-dates`)
export const createBlockedDates = (id, block) => http.post(`/items/${id}/blocked-dates`, block)
export const deleteBlockedDates = (id, blockId) => http.delete(`/items/${id}/blocked-dates/${blockId}`)
