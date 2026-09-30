import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAuthContext } from '../../../contexts/auth-context'
import { updateMe } from '../../../services'
import { userToFormValues } from '../../../lib/mappers'
import { applyServerErrors, rules } from '../../../lib/form-errors'
import { AddressField, Alert, Button, Input } from '../../ui'

const LOCATION_FIELDS = ['address', 'latitude', 'longitude']

// Datos y direccion del usuario
function ProfileForm({ onSuccess }) {
  const { user, refresh } = useAuthContext()
  const [serverError, setServerError] = useState(null)
  const [saved, setSaved] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: userToFormValues(user) })

  const onSubmit = async ({ fullName, phone, location }) => {
    setServerError(null)
    setSaved(false)
    try {
      // los vacios no se envian
      await updateMe({
        fullName: fullName.trim(),
        phone: phone.trim(),
        ...(location.address.trim() ? { address: location.address.trim() } : {}),
        // sin coordenadas se borran las anteriores
        latitude: location.latitude ?? null,
        longitude: location.longitude ?? null,
      })
      // recarga la sesion para tener isAdmin
      const me = await refresh()
      setSaved(true)
      onSuccess?.(me)
    } catch (error) {
      if (!applyServerErrors(error, (field, err) => setError(LOCATION_FIELDS.includes(field) ? 'location' : field, err))) {
        setServerError(error)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nombre completo"
          required
          autoComplete="name"
          error={errors.fullName?.message}
          {...register('fullName', {
            required: rules.required(),
            maxLength: { value: 150, message: 'Máximo 150 caracteres' },
          })}
        />
        <Input
          label="Teléfono"
          type="tel"
          autoComplete="tel"
          hint="Se comparte con la otra parte cuando se acepta una reserva."
          error={errors.phone?.message}
          {...register('phone', { maxLength: { value: 30, message: 'Máximo 30 caracteres' } })}
        />
      </div>

      <Controller
        name="location"
        control={control}
        rules={{ validate: rules.address }}
        render={({ field, fieldState }) => (
          <AddressField
            label="Dirección de recogida"
            hint="Donde se recogen y devuelven tus objetos. Es obligatoria para publicar."
            error={fieldState.error?.message}
            {...field}
          />
        )}
      />

      <Alert error={serverError} />
      {saved && !serverError && <Alert tone="success">Perfil actualizado</Alert>}

      <div>
        <Button type="submit" loading={isSubmitting}>
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}

export default ProfileForm
