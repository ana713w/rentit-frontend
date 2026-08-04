import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/auth-context'

// Login y registro: si ya hay sesión, no tiene sentido mostrarlos
function GuestRoute({ children }) {
  const { user } = useAuthContext()
  return user ? <Navigate to="/" replace /> : children
}

export default GuestRoute
