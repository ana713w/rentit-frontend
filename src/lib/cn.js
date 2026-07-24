// Une clases CSS ignorando valores falsy (false, null, undefined, '')
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
