import { useCallback, useEffect, useState } from 'react'

// Carga datos segun dependencias, con reload y mutate
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
    // solo relanza al cambiar deps o con reload
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
