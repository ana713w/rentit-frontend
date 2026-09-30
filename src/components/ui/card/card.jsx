import { cn } from '../../../lib/cn'
import Icon from '../icon/icon'

// Contenedor base con cabecera opcional
function Card({ title, subtitle, icon, actions, padded = true, className, children, as: Tag = 'section' }) {
  const hasHeader = title || subtitle || actions

  return (
    <Tag className={cn('rounded-card bg-surface shadow-card', padded && 'p-5 sm:p-6', className)}>
      {hasHeader && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
                <Icon name={icon} className="text-xl" />
              </span>
            )}
            <div className="min-w-0">
              {title && <h2 className="text-lg">{title}</h2>}
              {subtitle && <p className="mt-0.5 text-sm text-fg-muted">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </Tag>
  )
}

export default Card
