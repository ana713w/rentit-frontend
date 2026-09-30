import { useId } from 'react'
import { cn } from '../../../lib/cn'
import Field from './field'
import { controlClasses } from './control-classes'

// Compatible con react-hook-form
function Input({ label, hint, error, required, id, className, ...props }) {
  const autoId = useId()
  const inputId = id || props.name || autoId

  return (
    <Field label={label} htmlFor={inputId} hint={hint} error={error} required={required} className={className}>
      <input id={inputId} aria-invalid={Boolean(error)} className={cn(controlClasses(error), 'h-11')} {...props} />
    </Field>
  )
}

export default Input
