import { useId } from 'react'
import { cn } from '../../../lib/cn'
import Field from './field'
import { controlClasses } from './control-classes'

function Textarea({ label, hint, error, required, id, rows = 4, className, ...props }) {
  const autoId = useId()
  const inputId = id || props.name || autoId

  return (
    <Field label={label} htmlFor={inputId} hint={hint} error={error} required={required} className={className}>
      <textarea
        id={inputId}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={cn(controlClasses(error), 'resize-y py-2')}
        {...props}
      />
    </Field>
  )
}

export default Textarea
