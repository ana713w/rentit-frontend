import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

// { user, isAdmin, login, logout, refresh }
export function useAuthContext() {
  return useContext(AuthContext)
}
