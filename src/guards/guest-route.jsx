import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/auth-context'

// Solo sin sesion
function GuestRoute({ children }) {
  const { user } = useAuthContext()
  return user ? <Navigate to="/" replace /> : children
}

export default GuestRoute
