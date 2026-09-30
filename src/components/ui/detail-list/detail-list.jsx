import { cn } from '../../../lib/cn'

// items: [{ label, value }]
function DetailList({ items, columns = 2, className }) {
  return (
    <dl className={cn('grid gap-x-6 gap-y-4', columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3', className)}>
      {items.filter(Boolean).map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-xs font-semibold text-fg-muted">{item.label}</dt>
          <dd className="mt-0.5 text-sm font-semibold break-words text-fg">{item.value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  )
}

export default DetailList
