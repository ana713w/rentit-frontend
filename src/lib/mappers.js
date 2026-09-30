// API (snake_case) a formulario (camelCase)
export function itemToFormValues(item) {
  if (!item) return undefined
  return {
    title: item.title ?? '',
    category: item.category ?? '',
    pricePerDay: item.price_per_day != null ? Number(item.price_per_day) : '',
    depositAmount: item.deposit_amount != null ? Number(item.deposit_amount) : '',
    description: item.description ?? '',
  }
}

const toCoord = (value) => (value === null || value === undefined || value === '' ? null : Number(value))

export function userToFormValues(user) {
  return {
    fullName: user?.full_name ?? '',
    phone: user?.phone ?? '',
    // direccion y coordenadas
    location: {
      address: user?.address ?? '',
      latitude: toCoord(user?.latitude),
      longitude: toCoord(user?.longitude),
    },
  }
}
