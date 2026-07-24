// Convierte la respuesta de la API (snake_case) en valores del formulario (camelCase)
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

export function userToFormValues(user) {
  return {
    fullName: user?.full_name ?? '',
    phone: user?.phone ?? '',
    address: user?.address ?? '',
    latitude: user?.latitude ?? '',
    longitude: user?.longitude ?? '',
  }
}
