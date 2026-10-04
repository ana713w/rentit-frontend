import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { promoteAdmin } from '../services'
import { applyServerErrors, rules } from '../lib/form-errors'
import { Alert, Button, Card, Input, PageHeader } from '../components/ui'

const ERROR_MESSAGES = {
  400: 'Ese usuario ya es administrador.',
  404: 'No existe ningún usuario con ese email.',
}

function AdminPromotePage() {
  const [result, setResult] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '' } })

  const onSubmit = async ({ email }) => {
    setResult(null)
    try {
      const response = await promoteAdmin(email.trim())
      setResult({ tone: 'success', message: response?.message || 'Usuario promovido a administrador.' })
      reset()
    } catch (error) {
      if (applyServerErrors(error, setError)) return
      setResult({ tone: 'danger', message: ERROR_MESSAGES[error.status] || error.message })
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Administradores" subtitle="Da permisos de administración a otro usuario." />
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input
            label="Email del usuario"
            type="email"
            placeholder="usuario@ejemplo.com"
            hint="El usuario tiene que estar registrado."
            error={errors.email?.message}
            {...register('email', { required: rules.required(), pattern: rules.email })}
          />
          {result && <Alert tone={result.tone}>{result.message}</Alert>}
          <div>
            <Button type="submit" loading={isSubmitting}>
              Hacer administrador
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AdminPromotePage
