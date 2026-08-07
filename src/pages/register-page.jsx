import { Link, useNavigate } from 'react-router-dom'
import { RegisterForm } from '../components/users'
import { Card, LogoMark } from '../components/ui'

function RegisterPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-md py-4">
      <Card className="sm:p-8">
        <LogoMark className="mx-auto mb-4 size-14" />
        <h1 className="mb-1 text-center text-2xl font-extrabold">Crea tu cuenta</h1>
        <p className="mb-6 text-center text-sm text-fg-muted">Compra menos, alquila más. Empieza en un minuto.</p>
        <RegisterForm onSuccess={() => navigate('/', { replace: true })} />
        <p className="mt-6 text-center text-sm text-fg-muted">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-bold">
            Inicia sesión
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default RegisterPage
