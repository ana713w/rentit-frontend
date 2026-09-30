import { getItem, listItemImages } from '../services'
import { useFetch } from './use-fetch'

// Datos de un objeto
export function useItem(id) {
  return useFetch(() => (id ? getItem(id) : Promise.resolve(null)), [id])
}

// la foto principal viene primero
export function usePrimaryImage(itemId) {
  const { data } = useFetch(() => (itemId ? listItemImages(itemId) : Promise.resolve([])), [itemId])
  return data?.[0]?.url ?? null
}
