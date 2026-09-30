import { useFavorites } from '../../../hooks'
import { cn } from '../../../lib/cn'
import { Icon } from '../../ui'

// Boton de favorito sobre la foto
function FavoriteButton({ itemId, className }) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(itemId)

  return (
    <button
      type="button"
      aria-label={active ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      aria-pressed={active}
      onClick={(event) => {
        // evita navegar al hacer clic
        event.preventDefault()
        event.stopPropagation()
        toggle(itemId)
      }}
      className={cn(
        'flex size-9 items-center justify-center rounded-full bg-surface/85 shadow-card backdrop-blur-md transition-colors',
        active ? 'text-danger' : 'text-fg-muted hover:text-danger',
        className,
      )}
    >
      <Icon name="favorite" filled={active} className="text-xl" />
    </button>
  )
}

export default FavoriteButton
