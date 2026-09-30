import { useState } from 'react'

// Accion asincrona con estado de carga y error
export function useAction(action) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function run(...args) {
    setLoading(true)
    setError(null)
    try {
      const data = await action(...args)
      return { ok: true, data }
    } catch (err) {
      setError(err)
      return { ok: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  return { run, loading, error, clearError: () => setError(null) }
}
