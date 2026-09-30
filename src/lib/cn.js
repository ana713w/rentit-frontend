// Une clases ignorando falsy
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
