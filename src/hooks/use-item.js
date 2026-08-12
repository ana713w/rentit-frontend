import { getItem, listItemImages } from '../services'
import { useFetch } from './use-fetch'

// Datos de un objeto (las listas de reservas no traen el título)
export function useItem(id) {
  return useFetch(() => (id ? getItem(id) : Promise.resolve(null)), [id])
}

// GET /items no trae la foto: la API devuelve las imágenes con la principal primero
export function usePrimaryImage(itemId) {
  const { data } = useFetch(() => (itemId ? listItemImages(itemId) : Promise.resolve([])), [itemId])
  return data?.[0]?.url ?? null
}
