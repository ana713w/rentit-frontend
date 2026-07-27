import { cn } from '../../../lib/cn'
import Icon from '../icon/icon'

function EmptyState({ title, description, action, icon = 'inventory_2', className }) {
  return (
    <div className={cn('flex flex-col items-center gap-2 rounded-card bg-surface px-6 py-14 text-center shadow-card', className)}>
      <span className="mb-2 flex size-14 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
        <Icon name={icon} className="text-3xl" />
      </span>
      <p className="font-heading text-lg font-bold text-fg">{title}</p>
      {description && <p className="max-w-md text-sm text-fg-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

export default EmptyState
