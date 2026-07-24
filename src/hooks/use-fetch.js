import { useCallback, useEffect, useState } from 'react'

/**
 * Carga datos al montar y cada vez que cambian las dependencias.
 *
 *   const { data, loading, error, reload, mutate } = useFetch(() => getProperty(id), [id])
 *
 * - reload() vuelve a pedir los datos sin vaciar los actuales (sin parpadeo).
 * - mutate(updater) modifica los datos en local, p. ej. tras borrar un elemento.
 * - Si cambian las dependencias, los datos anteriores se descartan.
 */
export function useFetch(fetcher, deps = []) {
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState({ depsKey: null, requestKey: null, data: null, error: null })

  const depsKey = JSON.stringify(deps)
  const requestKey = `${depsKey}#${reloadCount}`

  useEffect(() => {
    let active = true

    fetcher()
      .then((data) => active && setResult({ depsKey, requestKey, data, error: null }))
      .catch((error) => active && setResult((prev) => ({ ...prev, depsKey, requestKey, error })))

    return () => {
      active = false
    }
    // fetcher cambia en cada render: solo relanzamos cuando cambian las dependencias o se pide un reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  const mutate = useCallback(
    (updater) =>
      setResult((prev) => ({ ...prev, data: typeof updater === 'function' ? updater(prev.data) : updater })),
    [],
  )

  const sameDeps = result.depsKey === depsKey

  return {
    data: sameDeps ? result.data : null,
    error: sameDeps ? result.error : null,
    loading: result.requestKey !== requestKey,
    reload,
    mutate,
  }
}
