const currencyFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })
const priceFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})
const dateFormatter = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
const dateTimeFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' })

export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '—'
  return currencyFormatter.format(Number(value))
}

export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '—'
  const number = Number(value)
  return Number.isInteger(number) ? priceFormatter.format(number) : currencyFormatter.format(number)
}

export function getInitials(name = '') {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('') || '?'
  )
}

export function parseDate(value) {
  if (!value) return null
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatDate(value) {
  const date = parseDate(value)
  return date ? dateFormatter.format(date) : '—'
}

export function formatDateTime(value) {
  return value ? dateTimeFormatter.format(new Date(value)) : '—'
}

export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(value, days) {
  const date = typeof value === 'string' ? parseDate(value) : new Date(value)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

export function countNights(startDate, endDate) {
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  if (!start || !end) return 0
  return Math.max(0, Math.round((end - start) / 86_400_000))
}

export function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA
}

export function parseDateRange(range) {
  const match = /(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})/.exec(range || '')
  return match ? { startDate: match[1], endDate: match[2] } : { startDate: null, endDate: null }
}

export function normalizeReservation(reservation) {
  if (!reservation || reservation.start_date) return reservation
  const { startDate, endDate } = parseDateRange(reservation.date_range)
  return { ...reservation, start_date: startDate, end_date: endDate }
}
