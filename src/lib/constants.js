export const ITEM_CATEGORIES = [
  { value: 'bricolaje', label: 'Bricolaje', icon: 'handyman' },
  { value: 'jardin', label: 'Jardín', icon: 'yard' },
  { value: 'deporte', label: 'Deporte', icon: 'directions_bike' },
  { value: 'camping', label: 'Camping', icon: 'camping' },
  { value: 'electronica', label: 'Electrónica', icon: 'devices' },
  { value: 'fotografia', label: 'Fotografía', icon: 'photo_camera' },
  { value: 'fiesta', label: 'Fiesta', icon: 'celebration' },
  { value: 'bebe', label: 'Bebé', icon: 'stroller' },
  { value: 'otros', label: 'Otros', icon: 'category' },
]

export function getCategory(value) {
  return (
    ITEM_CATEGORIES.find((category) => category.value === value) || {
      value,
      label: value || 'Otros',
      icon: 'category',
    }
  )
}

// Navegacion principal
export const NAV_LINKS = [
  { to: '/', label: 'Inicio', icon: 'home', end: true },
  { to: '/favorites', label: 'Favoritos', icon: 'favorite' },
  { to: '/reservations', label: 'Reservas', icon: 'event_available' },
  { to: '/profile', label: 'Perfil', icon: 'person' },
]

export const RESERVATION_ROLES = {
  guest: 'Arrendatario',
  owner: 'Propietario',
}

export const RESERVATION_STATUS = {
  pending: { label: 'Pendiente', tone: 'warning' },
  confirmed: { label: 'Confirmada', tone: 'success' },
  completed: { label: 'Completada', tone: 'info' },
  rejected: { label: 'Rechazada', tone: 'danger' },
  cancelled: { label: 'Cancelada', tone: 'neutral' },
}

export const RENT_STATUS = {
  pending: { label: 'Pendiente', tone: 'warning' },
  succeeded: { label: 'Pagado', tone: 'success' },
  failed: { label: 'Fallido', tone: 'danger' },
  refunded: { label: 'Reembolsado', tone: 'neutral' },
}

export const DEPOSIT_STATUS = {
  pending: { label: 'Pendiente', tone: 'warning' },
  authorized: { label: 'Retenido', tone: 'info' },
  captured: { label: 'Capturado', tone: 'danger' },
  released: { label: 'Liberado', tone: 'success' },
  canceled: { label: 'Cancelado', tone: 'neutral' },
  failed: { label: 'Fallido', tone: 'danger' },
}

export const DISPUTE_STATUS = {
  open: { label: 'Abierta', tone: 'warning' },
  under_review: { label: 'En revisión', tone: 'info' },
  resolved: { label: 'Resuelta', tone: 'success' },
}

export const CONTRACT_TYPES = {
  rental: 'Contrato de entrega',
  return: 'Contrato de devolución',
}

export const VERIFICATION_TYPES = {
  check_in: 'Check-in',
  check_out: 'Check-out',
}

export const UPLOAD_LIMITS = {
  maxFiles: 10,
  maxSizeMB: 5,
}

// Maximo de dias por la preautorizacion de Stripe (~7 dias)
export const MAX_RENTAL_DAYS = Number(import.meta.env.VITE_MAX_RENTAL_DAYS || 6)
