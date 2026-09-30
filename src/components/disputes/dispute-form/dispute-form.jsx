import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { createDispute } from '../../../services'
import { applyServerErrors } from '../../../lib/form-errors'
import { Alert, Button, Input, Textarea } from '../../ui'

// Abrir disputa sobre una reserva
function DisputeForm({ reservationId, onCreated, onCancel }) {
  const [serverError, setServerError] = useState(null)
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { reason: '', requestedCaptureAmount: '' } })

  const reasonLength = useWatch({ control, name: 'reason' })?.length || 0

  const onSubmit = async (values) => {
    setServerError(null)
    try {
      const dispute = await createDispute(reservationId, values)
      onCreated?.(dispute)
    } catch (error) {
      if (error.status === 409) setServerError({ message: 'Ya hay una disputa abierta para esta reserva.' })
      else if (!applyServerErrors(error, setError)) setServerError(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 rounded-input bg-surface-muted p-4">
      <Textarea
        label="Motivo"
        required
        rows={4}
        hint={`${reasonLength}/2000 · Explica qué ha pasado con el mayor detalle posible`}
        error={errors.reason?.message}
        {...register('reason', {
          required: 'Explica el motivo',
          minLength: { value: 10, message: 'Mínimo 10 caracteres' },
          maxLength: { value: 2000, message: 'Máximo 2000 caracteres' },
        })}
      />
      <Input
        label="Importe del depósito que reclamas (€, opcional)"
        type="number"
        step="0.01"
        min="0"
        error={errors.requestedCaptureAmount?.message}
        {...register('requestedCaptureAmount', {
          validate: (value) => value === '' || Number(value) > 0 || 'Debe ser mayor que 0',
        })}
      />
      <Alert error={serverError} />
      <div className="flex gap-2">
        <Button type="submit" loading={isSubmitting}>
          Abrir disputa
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

export default DisputeForm
