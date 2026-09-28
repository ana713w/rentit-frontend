export function applyServerErrors(error, setError) {
  if (!error?.details) return false

  let applied = false
  Object.entries(error.details).forEach(([field, messages]) => {
    const message = Array.isArray(messages) ? messages.join('. ') : String(messages)
    setError(field, { type: 'server', message })
    applied = true
  })
  return applied
}

export const rules = {
  required: (message = 'Este campo es obligatorio') => ({ value: true, message }),
  email: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Introduce un email válido',
  },
  password: (value) => {
    if (value.length < 8) return 'Mínimo 8 caracteres'
    if (!/[A-Z]/.test(value)) return 'Debe incluir al menos una mayúscula'
    if (!/\d/.test(value)) return 'Debe incluir al menos un número'
    return true
  },
  positive: (value) => Number(value) > 0 || 'Debe ser mayor que 0',
  // Para AddressField ({ address, latitude, longitude }): opcional, pero con 5 caracteres si se rellena
  address: ({ address }) => !address.trim() || address.trim().length >= 5 || 'Mínimo 5 caracteres',
  uuid: {
    value: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    message: 'Debe ser un UUID válido',
  },
}
