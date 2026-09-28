import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAuthContext } from '../../../contexts/auth-context'
import { register as registerRequest } from '../../../services'
import { applyServerErrors, rules } from '../../../lib/form-errors'
import { AddressField, Alert, Button, Input } from '../../ui'

const LOCATION_FIELDS = ['address', 'latitude', 'longitude']

function RegisterForm({ onSuccess }) {
  const { login } = useAuthContext()
  const [serverError, setServerError] = useState(null)
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      location: { address: '', latitude: null, longitude: null },
      password: '',
    },
  })

  const onSubmit = async ({ phone, location, ...data }) => {
    setServerError(null)
    try {
      // Los opcionales vacíos no se envían (la API valida longitud mínima si llegan)
      await registerRequest({
        ...data,
        ...(phone ? { phone } : {}),
        ...(location.address.trim() ? { address: location.address.trim() } : {}),
        ...(location.latitude != null ? { latitude: location.latitude, longitude: location.longitude } : {}),
      })
      // El registro no inicia sesión: hacemos login con los mismos datos
      const user = await login({ email: data.email, password: data.password })
      onSuccess?.(user)
    } catch (error) {
      if (error.status === 409) {
        setError('email', { message: 'Ya existe una cuenta con este email' })
      } else if (!applyServerErrors(error, (field, err) => setError(LOCATION_FIELDS.includes(field) ? 'location' : field, err))) {
        setServerError(error)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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
        label="Email"
        type="email"
        required
        autoComplete="email"
        error={errors.email?.message}
        {...register('email', { required: rules.required(), pattern: rules.email })}
      />
      <Input
        label="Teléfono"
        type="tel"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register('phone', { maxLength: { value: 30, message: 'Máximo 30 caracteres' } })}
      />
      <Controller
        name="location"
        control={control}
        rules={{ validate: rules.address }}
        render={({ field, fieldState }) => (
          <AddressField
            label="Dirección"
            hint="Opcional. Es donde se recogen tus objetos; la necesitas para publicar."
            error={fieldState.error?.message}
            {...field}
          />
        )}
      />
      <Input
        label="Contraseña"
        type="password"
        required
        autoComplete="new-password"
        hint="Mínimo 8 caracteres, con una mayúscula y un número"
        error={errors.password?.message}
        {...register('password', { required: rules.required(), validate: rules.password })}
      />
      <Alert error={serverError} />
      <Button type="submit" size="lg" loading={isSubmitting} fullWidth>
        Crear cuenta
      </Button>
    </form>
  )
}

export default RegisterForm
