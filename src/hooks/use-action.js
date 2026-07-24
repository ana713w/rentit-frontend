import { useState } from 'react'

/**
 * Envuelve una acción asíncrona (aceptar, borrar, pagar...) con estado de carga y error.
 *
 *   const accept = useAction(() => acceptReservation(id))
 *   const { ok } = await accept.run()
 *   <Button loading={accept.loading}>Aceptar</Button>
 *   {accept.error && <Alert tone="danger">{accept.error.message}</Alert>}
 */
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
