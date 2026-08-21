import { useCallback, useSyncExternalStore } from 'react'

// La API no tiene favoritos: se guardan en este navegador (localStorage).
const STORAGE_KEY = 'rentit:favorites'
const listeners = new Set()
let cache = null

function read() {
  if (cache) return cache
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    cache = Array.isArray(parsed) ? parsed : []
  } catch {
    cache = []
  }
  return cache
}

function write(ids) {
  cache = ids
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Modo privado o almacenamiento lleno: se mantienen solo en memoria
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  const onStorage = (event) => {
    if (event.key !== STORAGE_KEY) return
    cache = null
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/**
 *   const { ids, isFavorite, toggle } = useFavorites()
 */
export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, read, () => [])

  const isFavorite = useCallback((id) => ids.includes(id), [ids])
  const toggle = useCallback((id) => {
    const current = read()
    write(current.includes(id) ? current.filter((fav) => fav !== id) : [id, ...current])
  }, [])

  return { ids, isFavorite, toggle }
}
