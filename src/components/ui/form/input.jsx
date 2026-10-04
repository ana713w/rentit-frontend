import { useId, useState } from 'react'
import { cn } from '../../../lib/cn'
import Icon from '../icon/icon'
import Field from './field'
import { controlClasses } from './control-classes'

// Compatible con react-hook-form
// type="password" añade un boton para mostrar u ocultar la contraseña
function Input({ label, hint, error, required, id, className, type, ...props }) {
  const autoId = useId()
  const inputId = id || props.name || autoId
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'

  const input = (
    <input
      id={inputId}
      type={isPassword && visible ? 'text' : type}
      aria-invalid={Boolean(error)}
      className={cn(controlClasses(error), 'h-11', isPassword && 'pr-11')}
      {...props}
    />
  )

  return (
    <Field label={label} htmlFor={inputId} hint={hint} error={error} required={required} className={className}>
      {isPassword ? (
        <div className="relative">
          {input}
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={visible}
            className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-control text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg"
          >
            <Icon name={visible ? 'visibility_off' : 'visibility'} className="text-xl" />
          </button>
        </div>
      ) : (
        input
      )}
    </Field>
  )
}

export default Input
