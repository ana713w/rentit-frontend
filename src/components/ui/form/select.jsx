import { useId } from 'react'
import { cn } from '../../../lib/cn'
import Field from './field'
import { controlClasses } from './control-classes'

// options: [{ value, label }]
function Select({ label, hint, error, required, id, options = [], className, ...props }) {
  const autoId = useId()
  const inputId = id || props.name || autoId

  return (
    <Field label={label} htmlFor={inputId} hint={hint} error={error} required={required} className={className}>
      <select id={inputId} aria-invalid={Boolean(error)} className={cn(controlClasses(error), 'h-11')} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export default Select
