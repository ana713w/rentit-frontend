import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/auth-context'

// Exige sesion, y admin si se indica
function PrivateRoute({ admin = false, children }) {
  const { user, isAdmin } = useAuthContext()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (admin && !isAdmin) return <Navigate to="/403" replace />

  return children
}

export default PrivateRoute
