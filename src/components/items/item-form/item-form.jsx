import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { ITEM_CATEGORIES } from '../../../lib/constants'
import { cn } from '../../../lib/cn'
import { applyServerErrors, rules } from '../../../lib/form-errors'
import { Alert, Button, Icon, Input, Textarea } from '../../ui'

const EMPTY_VALUES = { title: '', category: '', pricePerDay: '', depositAmount: '', description: '' }

// Regla de negocio del backend: la fianza entre 3 y 365 veces el precio por día
const validateDeposit = (value, values) => {
  if (!(value > 0)) return 'Debe ser mayor que 0'
  const price = values.pricePerDay
  if (price > 0 && (value < price * 3 || value > price * 365)) {
    return `Entre ${price * 3} € y ${price * 365} € (de 3 a 365 veces el precio por día)`
  }
  return true
}

/**
 * Formulario de crear y editar objeto.
 *   <ItemForm onSubmit={createItem} submitLabel="Publicar" />
 *   <ItemForm defaultValues={itemToFormValues(item)} onSubmit={(v) => updateItem(item.id, v)} />
 * onSubmit recibe el body listo para la API; si la API devuelve un error, sus details se pintan en los campos.
 */
function ItemForm({ defaultValues, onSubmit, onSuccess, submitLabel = 'Guardar' }) {
  const [serverError, setServerError] = useState(null)
  const [saved, setSaved] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaultValues || EMPTY_VALUES })

  const selectedCategory = useWatch({ control, name: 'category' })

  const submit = async (values) => {
    setServerError(null)
    setSaved(false)
    try {
      const result = await onSubmit(values)
      setSaved(true)
      onSuccess?.(result)
    } catch (error) {
      if (!applyServerErrors(error, setError)) setServerError(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-5">
      <Input
        label="Título"
        required
        placeholder="Taladro percutor Bosch 750W"
        error={errors.title?.message}
        {...register('title', {
          required: rules.required(),
          minLength: { value: 3, message: 'Mínimo 3 caracteres' },
          maxLength: { value: 150, message: 'Máximo 150 caracteres' },
        })}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-semibold text-fg">
          Categoría<span className="ml-0.5 text-danger">*</span>
        </legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {ITEM_CATEGORIES.map((category) => {
            const active = selectedCategory === category.value
            return (
              <label
                key={category.value}
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-1 rounded-input border-2 px-2 py-3 text-center text-xs font-bold transition-colors',
                  'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary',
                  active
                    ? 'border-primary bg-primary-soft text-primary-strong'
                    : 'border-line bg-surface text-fg-muted hover:border-line-strong hover:text-fg',
                )}
              >
                <input
                  type="radio"
                  value={category.value}
                  className="sr-only"
                  {...register('category', { required: 'Elige una categoría' })}
                />
                <Icon name={category.icon} className="text-2xl" />
                {category.label}
              </label>
            )
          })}
        </div>
        {errors.category && (
          <p role="alert" className="text-xs text-danger">
            {errors.category.message}
          </p>
        )}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Precio por día (€)"
          type="number"
          step="0.01"
          min="0"
          required
          error={errors.pricePerDay?.message}
          {...register('pricePerDay', {
            required: rules.required(),
            valueAsNumber: true,
            validate: rules.positive,
          })}
        />
        <Input
          label="Fianza (€)"
          type="number"
          step="0.01"
          min="0"
          required
          hint="Entre 3 y 365 veces el precio por día. Se retiene y se devuelve al terminar."
          error={errors.depositAmount?.message}
          {...register('depositAmount', {
            required: rules.required(),
            valueAsNumber: true,
            deps: ['pricePerDay'],
            validate: validateDeposit,
          })}
        />
      </div>

      <Textarea
        label="Descripción"
        rows={5}
        placeholder="Estado, accesorios incluidos, instrucciones de uso..."
        error={errors.description?.message}
        {...register('description', { maxLength: { value: 2000, message: 'Máximo 2000 caracteres' } })}
      />

      <Alert error={serverError} />
      {saved && !serverError && <Alert tone="success">Cambios guardados</Alert>}

      <div>
        <Button type="submit" size="lg" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default ItemForm
