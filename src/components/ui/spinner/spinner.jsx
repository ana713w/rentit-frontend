import { cn } from '../../../lib/cn'

const SIZES = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-10 border-3',
}

function Spinner({ size = 'md', className }) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={cn('inline-block animate-spin rounded-full border-current border-t-transparent', SIZES[size], className)}
    />
  )
}

export default Spinner
