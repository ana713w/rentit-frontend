import { ITEM_CATEGORIES } from '../../../lib/constants'
import { cn } from '../../../lib/cn'
import { Icon } from '../../ui'

// Carrusel de categorias, pulsar la activa la desmarca
function CategoryPicker({ value, onChange }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pt-1 pb-2 scrollbar-none sm:gap-4">
      {ITEM_CATEGORIES.map((category) => {
        const active = category.value === value
        return (
          <button
            key={category.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active ? '' : category.value)}
            className="group flex min-w-[4.75rem] flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                'flex size-14 items-center justify-center rounded-full transition-all group-hover:scale-105',
                active
                  ? 'bg-primary text-on-primary shadow-primary'
                  : 'bg-surface text-fg-muted shadow-card group-hover:bg-surface-strong group-hover:text-primary-strong',
              )}
            >
              <Icon name={category.icon} className="text-[1.625rem]" />
            </span>
            <span className={cn('text-sm', active ? 'font-bold text-fg' : 'font-semibold text-fg-muted group-hover:text-fg')}>
              {category.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryPicker
