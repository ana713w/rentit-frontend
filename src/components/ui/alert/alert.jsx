import { cn } from '../../../lib/cn'
import Icon from '../icon/icon'

const TONES = {
  info: { classes: 'bg-info-soft text-info', icon: 'info' },
  success: { classes: 'bg-success-soft text-success', icon: 'check_circle' },
  warning: { classes: 'bg-warning-soft text-warning', icon: 'warning' },
  danger: { classes: 'bg-danger-soft text-danger', icon: 'error' },
}

// Mensaje destacado, acepta un error
function Alert({ tone = 'info', title, error, action, className, children }) {
  const finalTone = TONES[error ? 'danger' : tone]
  const content = children || error?.message
  if (!content && !title) return null

  return (
    <div role="alert" className={cn('flex flex-wrap items-center gap-3 rounded-input px-4 py-3 text-sm', finalTone.classes, className)}>
      <Icon name={finalTone.icon} className="self-start text-xl" />
      <div className="min-w-0 flex-1">
        {title && <p className="font-bold">{title}</p>}
        {content && <div>{content}</div>}
      </div>
      {action}
    </div>
  )
}

export default Alert
