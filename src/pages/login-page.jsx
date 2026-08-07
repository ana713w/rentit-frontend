import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/users'
import { Card, LogoMark } from '../components/ui'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/'

  return (
    <div className="mx-auto max-w-md py-4">
      <Card className="sm:p-8">
        <LogoMark className="mx-auto mb-4 size-14" />
        <h1 className="mb-1 text-center text-2xl font-extrabold">¡Hola de nuevo!</h1>
        <p className="mb-6 text-center text-sm text-fg-muted">Entra para alquilar objetos o gestionar los tuyos.</p>
        <LoginForm onSuccess={() => navigate(redirectTo, { replace: true })} />
        <p className="mt-6 text-center text-sm text-fg-muted">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-bold">
            Regístrate
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default LoginPage
