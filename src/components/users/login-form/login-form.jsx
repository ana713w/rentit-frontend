import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthContext } from '../../../contexts/auth-context'
import { applyServerErrors, rules } from '../../../lib/form-errors'
import { Alert, Button, Input } from '../../ui'

function LoginForm({ defaultEmail = '', onSuccess }) {
  const { login } = useAuthContext()
  const [serverError, setServerError] = useState(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: defaultEmail, password: '' } })

  const onSubmit = async (credentials) => {
    setServerError(null)
    try {
      const user = await login(credentials)
      onSuccess?.(user)
    } catch (error) {
      if (!applyServerErrors(error, setError)) {
        setServerError(error.status === 401 ? { message: 'Email o contraseña incorrectos' } : error)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email', { required: rules.required(), pattern: rules.email })}
      />
      <Input
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password', { required: rules.required() })}
      />
      <Alert error={serverError} />
      <Button type="submit" size="lg" loading={isSubmitting} fullWidth>
        Iniciar sesión
      </Button>
    </form>
  )
}

export default LoginForm
