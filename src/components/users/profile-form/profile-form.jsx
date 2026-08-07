import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthContext } from '../../../contexts/auth-context'
import { updateMe } from '../../../services'
import { userToFormValues } from '../../../lib/mappers'
import { applyServerErrors, rules } from '../../../lib/form-errors'
import { Alert, Button, Input } from '../../ui'

const optionalNumber = (value) => (value === '' || value === null ? undefined : Number(value))

// Datos del usuario y su dirección (donde se recogen y devuelven sus objetos) → PATCH /auth/me
function ProfileForm({ onSuccess }) {
  const { user, refresh } = useAuthContext()
  const [serverError, setServerError] = useState(null)
  const [saved, setSaved] = useState(false)
  const [locating, setLocating] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: userToFormValues(user) })

  const fillMyLocation = () => {
    if (!navigator.geolocation) {
      setServerError({ message: 'Tu navegador no permite obtener la ubicación.' })
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setValue('latitude', Number(coords.latitude.toFixed(6)), { shouldDirty: true })
        setValue('longitude', Number(coords.longitude.toFixed(6)), { shouldDirty: true })
        setLocating(false)
      },
      () => {
        setServerError({ message: 'No se pudo obtener tu ubicación. Revisa los permisos del navegador.' })
        setLocating(false)
      },
    )
  }

  const onSubmit = async ({ fullName, phone, address, latitude, longitude }) => {
    setServerError(null)
    setSaved(false)
    try {
      // La API valida la longitud mínima de la dirección: los vacíos no se envían
      await updateMe({
        fullName: fullName.trim(),
        phone: phone.trim(),
        ...(address.trim() ? { address: address.trim() } : {}),
        ...(latitude !== undefined ? { latitude } : {}),
        ...(longitude !== undefined ? { longitude } : {}),
      })
      // PATCH /auth/me no devuelve isAdmin: recargamos la sesión completa
      const me = await refresh()
      setSaved(true)
      onSuccess?.(me)
    } catch (error) {
      if (!applyServerErrors(error, setError)) setServerError(error)
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
          error={errors.phone?.message}
          {...register('phone', { maxLength: { value: 30, message: 'Máximo 30 caracteres' } })}
        />
      </div>

      <Input
        label="Dirección de recogida"
        autoComplete="street-address"
        placeholder="Calle, número y ciudad"
        hint="Donde se recogen y devuelven tus objetos. Es obligatoria para publicar."
        error={errors.address?.message}
        {...register('address', {
          validate: (value) => !value.trim() || value.trim().length >= 5 || 'Mínimo 5 caracteres',
          maxLength: { value: 255, message: 'Máximo 255 caracteres' },
        })}
      />

      <div className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <Input
          label="Latitud"
          type="number"
          step="any"
          error={errors.latitude?.message}
          {...register('latitude', {
            setValueAs: optionalNumber,
            validate: (value) => value === undefined || (value >= -90 && value <= 90) || 'Entre -90 y 90',
          })}
        />
        <Input
          label="Longitud"
          type="number"
          step="any"
          error={errors.longitude?.message}
          {...register('longitude', {
            setValueAs: optionalNumber,
            validate: (value) => value === undefined || (value >= -180 && value <= 180) || 'Entre -180 y 180',
          })}
        />
        <Button variant="soft" icon="my_location" onClick={fillMyLocation} loading={locating}>
          Usar mi ubicación
        </Button>
      </div>

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
