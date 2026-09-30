import { useState } from 'react'
import { cn } from '../../../lib/cn'
import { toISODate } from '../../../lib/format'
import { Button, Icon } from '../../ui'

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })

// Fin excluido: del 10 al 15 ocupa del 10 al 14
const isInRange = (day, start, end) => Boolean(start && end) && day >= start && day < end

function MonthGrid({ year, month, today, blockedRanges, selectedRange }) {
  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => toISODate(new Date(year, month, i + 1)))

  return (
    <div className="flex-1">
      <p className="mb-2 text-center text-sm font-bold text-fg capitalize">
        {monthFormatter.format(new Date(year, month, 1))}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className="py-1 font-medium text-fg-subtle">
            {weekday}
          </span>
        ))}
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {days.map((day) => {
          const past = day < today
          const blocked = blockedRanges.some((range) => isInRange(day, range.start_date, range.end_date))
          const selected = isInRange(day, selectedRange?.startDate, selectedRange?.endDate)
          return (
            <span
              key={day}
              title={blocked ? 'No disponible' : undefined}
              className={cn(
                'rounded-control py-1.5 font-semibold',
                past && 'text-fg-subtle',
                !past && !blocked && !selected && 'text-fg',
                blocked && 'bg-danger-soft text-danger line-through',
                selected && !blocked && 'bg-primary text-on-primary',
                selected && blocked && 'bg-danger text-white',
              )}
            >
              {Number(day.slice(-2))}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// Calendario con fechas bloqueadas y rango elegido
function AvailabilityCalendar({ blockedRanges = [], selectedRange, months = 2 }) {
  const [offset, setOffset] = useState(0)
  const now = new Date()
  const today = toISODate(now)

  const visibleMonths = Array.from({ length: months }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() + offset + i, 1)
    return { year: date.getFullYear(), month: date.getMonth() }
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setOffset((o) => o - 1)} disabled={offset === 0} aria-label="Mes anterior">
          <Icon name="chevron_left" className="text-xl" />
        </Button>
        <div className="flex flex-wrap gap-4 text-xs text-fg-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-danger-soft" /> No disponible
          </span>
          {selectedRange && (
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-primary" /> Tu selección
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setOffset((o) => o + 1)} aria-label="Mes siguiente">
          <Icon name="chevron_right" className="text-xl" />
        </Button>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row">
        {visibleMonths.map(({ year, month }) => (
          <MonthGrid
            key={`${year}-${month}`}
            year={year}
            month={month}
            today={today}
            blockedRanges={blockedRanges}
            selectedRange={selectedRange}
          />
        ))}
      </div>
    </div>
  )
}

export default AvailabilityCalendar
