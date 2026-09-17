import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { resolveDispute } from '../../../services'
import { applyServerErrors } from '../../../lib/form-errors'
import { Alert, Button, Input, Select, Textarea } from '../../ui'

const DEPOSIT_ACTIONS = [
  { value: 'none', label: 'No tocar el depósito' },
  { value: 'release', label: 'Devolver el depósito al arrendatario' },
  { value: 'capture', label: 'Retener el depósito para el propietario' },
]

const ERROR_MESSAGES = {
  400: 'No hay pago asociado: resuelve sin acción sobre el depósito.',
  409: 'La disputa ya está resuelta o el depósito ya no está retenido.',
}

// Formulario de admin para resolver una disputa (con acción opcional sobre el depósito)
function ResolveDisputeForm({ dispute, onResolved, onCancel }) {
  const [serverError, setServerError] = useState(null)
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      resolution: '',
      depositAction: 'none',
      captureAmount: dispute.requested_capture_amount ?? '',
    },
  })

  const depositAction = useWatch({ control, name: 'depositAction' })

  const onSubmit = async (values) => {
    setServerError(null)
    try {
      const resolved = await resolveDispute(dispute.id, values)
      onResolved?.(resolved)
    } catch (error) {
      if (applyServerErrors(error, setError)) return
      setServerError(ERROR_MESSAGES[error.status] ? { message: `${ERROR_MESSAGES[error.status]} (${error.message})` } : error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 rounded-input bg-surface p-4">
      <Textarea
        label="Resolución"
        required
        rows={4}
        error={errors.resolution?.message}
        {...register('resolution', {
          required: 'Escribe la resolución',
          minLength: { value: 10, message: 'Mínimo 10 caracteres' },
          maxLength: { value: 2000, message: 'Máximo 2000 caracteres' },
        })}
      />
      <Select label="Depósito" options={DEPOSIT_ACTIONS} {...register('depositAction')} />
      {depositAction === 'capture' && (
        <Input
          label="Importe a retener (€)"
          type="number"
          step="0.01"
          min="0"
          hint={
            dispute.requested_capture_amount != null
              ? `Sugerido por quien abrió la disputa: ${dispute.requested_capture_amount} €. Vacío = todo el depósito.`
              : 'Vacío = todo el depósito'
          }
          error={errors.captureAmount?.message}
          {...register('captureAmount', {
            validate: (value) => value === '' || value === null || Number(value) > 0 || 'Debe ser mayor que 0',
          })}
        />
      )}
      <Alert error={serverError} />
      <div className="flex gap-2">
        <Button type="submit" loading={isSubmitting}>
          Resolver disputa
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}

export default ResolveDisputeForm
