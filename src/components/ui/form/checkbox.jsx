import { useId } from 'react'
import { cn } from '../../../lib/cn'

function Checkbox({ label, error, id, className, ...props }) {
  const autoId = useId()
  const inputId = id || props.name || autoId

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={inputId} className="flex cursor-pointer items-start gap-2 text-sm text-fg">
        <input id={inputId} type="checkbox" className="mt-0.5 size-4 shrink-0 accent-primary" {...props} />
        <span>{label}</span>
      </label>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

export default Checkbox
