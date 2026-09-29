import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../contexts/auth-context'
import { createReservation } from '../../../services'
import { countNights, formatCurrency, rangesOverlap, toISODate } from '../../../lib/format'
import { applyServerErrors } from '../../../lib/form-errors'
import { MAX_RENTAL_DAYS } from '../../../lib/constants'
import { Alert, Button, DateRangeFields } from '../../ui'

/**
 * Formulario de solicitud de alquiler del detalle del objeto.
 * onDatesChange permite al padre pintar la selección en el calendario.
 */
function ReservationRequestForm({ item, blockedDates = [], onDatesChange }) {
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState(null)

  const today = toISODate(new Date())
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { startDate: '', endDate: '' } })

  const [startDate, endDate] = useWatch({ control, name: ['startDate', 'endDate'] })
  const nights = endDate > startDate ? countNights(startDate, endDate) : 0
  const pricePerDay = Number(item.price_per_day)
  const overlapsBlocked = nights > 0 && blockedDates.some((b) => rangesOverlap(startDate, endDate, b.start_date, b.end_date))
  const tooLong = nights > MAX_RENTAL_DAYS

  const isOwner = user?.id === item.owner_id

  const onSubmit = async (values) => {
    setServerError(null)
    try {
      const reservation = await createReservation({ itemId: item.id, ...values })
      navigate(`/reservations/${reservation.id}`)
    } catch (error) {
      if (error.status === 409) {
        setServerError({ message: 'Esas fechas ya están ocupadas. Prueba con otras.' })
      } else if (!applyServerErrors(error, setError)) {
        setServerError(error)
      }
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-fg-muted">Inicia sesión para solicitar el alquiler.</p>
        <Button size="lg" onClick={() => navigate('/login', { state: { from: location } })} fullWidth>
          Iniciar sesión
        </Button>
      </div>
    )
  }

  if (isOwner) {
    return <Alert tone="info">Este objeto es tuyo. Gestiónalo desde «Mis objetos».</Alert>
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => onDatesChange?.(getValues())}
      noValidate
      className="flex flex-col gap-4"
    >
      <DateRangeFields register={register} errors={errors} min={today} startLabel="Recogida" endLabel="Devolución" />

      {nights > 0 && (
        <dl className="flex flex-col gap-2 rounded-input bg-surface-muted p-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-fg-muted">
              {formatCurrency(pricePerDay)} × {nights} {nights === 1 ? 'día' : 'días'}
            </dt>
            <dd className="font-bold">{formatCurrency(pricePerDay * nights)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-fg-muted">Fianza (se retiene y se devuelve)</dt>
            <dd className="font-bold">{formatCurrency(item.deposit_amount)}</dd>
          </div>
        </dl>
      )}

      {overlapsBlocked && <Alert tone="warning">Las fechas elegidas incluyen días no disponibles.</Alert>}
      {tooLong && (
        <Alert tone="warning">
          Un alquiler puede durar como máximo {MAX_RENTAL_DAYS} días: la fianza solo se puede retener durante una semana.
        </Alert>
      )}
      <Alert error={serverError} />

      <Button
        type="submit"
        size="lg"
        icon="send"
        loading={isSubmitting}
        disabled={overlapsBlocked || tooLong}
        fullWidth
      >
        Solicitar alquiler
      </Button>
      <p className="text-center text-xs text-fg-muted">
        No se cobra nada hasta que el propietario acepte. Máximo {MAX_RENTAL_DAYS} días por alquiler.
      </p>
    </form>
  )
}

export default ReservationRequestForm
