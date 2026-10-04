import { addDays } from '../../../lib/format'
import Input from './input'

// Fechas de inicio y fin, fin posterior a inicio
// startValue limita el calendario de fin: desde el dia siguiente y, con maxNights, hasta inicio + maxNights
function DateRangeFields({ register, errors, min, startValue, maxNights, startLabel = 'Desde', endLabel = 'Hasta', disabled }) {
  const endMin = startValue ? addDays(startValue, 1) : min && addDays(min, 1)
  const endMax = startValue && maxNights ? addDays(startValue, maxNights) : undefined

  return (
    <div className="grid grid-cols-2 gap-3">
      <Input
        label={startLabel}
        type="date"
        min={min}
        required
        disabled={disabled}
        error={errors.startDate?.message}
        {...register('startDate', {
          required: 'Elige una fecha',
          validate: (value) => !min || value >= min || 'La fecha ya ha pasado',
        })}
      />
      <Input
        label={endLabel}
        type="date"
        min={endMin}
        max={endMax}
        required
        disabled={disabled}
        error={errors.endDate?.message}
        {...register('endDate', {
          required: 'Elige una fecha',
          validate: (value, values) => {
            if (!values.startDate) return true
            if (value <= values.startDate) return 'Debe ser posterior al inicio'
            if (maxNights && value > addDays(values.startDate, maxNights)) return `Máximo ${maxNights} días`
            return true
          },
        })}
      />
    </div>
  )
}

export default DateRangeFields
