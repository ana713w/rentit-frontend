import Input from './input'

/**
 * Par de fechas inicio/fin para react-hook-form, con la regla "fin posterior a inicio".
 *   <DateRangeFields register={register} errors={errors} min={today} />
 * Los campos se llaman startDate y endDate (como espera la API).
 */
function DateRangeFields({ register, errors, min, startLabel = 'Desde', endLabel = 'Hasta', disabled }) {
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
        min={min}
        required
        disabled={disabled}
        error={errors.endDate?.message}
        {...register('endDate', {
          required: 'Elige una fecha',
          validate: (value, values) => !values.startDate || value > values.startDate || 'Debe ser posterior al inicio',
        })}
      />
    </div>
  )
}

export default DateRangeFields
