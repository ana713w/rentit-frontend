import { cn } from '../../../lib/cn'

// Control segmentado
function Tabs({ tabs, value, onChange, className }) {
  return (
    <div
      role="tablist"
      className={cn('mb-6 inline-flex max-w-full gap-1 overflow-x-auto rounded-control bg-surface p-1 shadow-card scrollbar-none', className)}
    >
      {tabs.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 rounded-control px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors',
              active ? 'bg-primary text-on-primary' : 'text-fg-muted hover:bg-surface-muted hover:text-fg',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'rounded-control px-1.5 text-xs',
                  active ? 'bg-on-primary/25 text-on-primary' : 'bg-surface-muted text-fg-muted',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
