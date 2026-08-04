import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth-context'
import { getMe, login as loginRequest, logout as logoutRequest } from '../services'
import { LoadingScreen } from '../components/ui'

export function AuthProvider({ children }) {
  // undefined = comprobando la sesión · null = anónimo · objeto = logueado
  const [user, setUser] = useState(undefined)

  const refresh = useCallback(
    () =>
      getMe()
        .then((me) => {
          setUser(me)
          return me
        })
        .catch(() => {
          setUser(null)
          return null
        }),
    [],
  )

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(
    async (credentials) => {
      await loginRequest(credentials)
      return refresh()
    },
    [refresh],
  )

  const logout = useCallback(async () => {
    await logoutRequest().catch(() => {})
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAdmin: Boolean(user?.isAdmin), login, logout, refresh }),
    [user, login, logout, refresh],
  )

  if (user === undefined) return <LoadingScreen />

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
