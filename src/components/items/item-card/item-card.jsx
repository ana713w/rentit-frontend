import { Link } from 'react-router-dom'
import { usePrimaryImage } from '../../../hooks'
import { getCategory } from '../../../lib/constants'
import { formatDistance, formatPrice } from '../../../lib/format'
import { Badge, Icon, ImagePlaceholder } from '../../ui'
import FavoriteButton from '../favorite-button/favorite-button'

// Tarjeta de objeto para listados
function ItemCard({ item, actions }) {
  const imageUrl = usePrimaryImage(item.id)
  const category = getCategory(item.category)
  const distance = formatDistance(item.distance_km)

  return (
    <article className="group flex flex-col overflow-hidden rounded-card bg-surface shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
      <Link to={`/items/${item.id}`} className="flex flex-1 flex-col text-fg hover:text-fg">
        <div className="relative aspect-square overflow-hidden bg-surface-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder className="size-full" />
          )}
          <Badge tone="glass" className="absolute top-2.5 left-2.5 hidden sm:inline-flex">
            <Icon name={category.icon} className="text-sm" />
            {category.label}
          </Badge>
          <FavoriteButton itemId={item.id} className="absolute top-2.5 right-2.5" />
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
            <p className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-primary-strong sm:text-2xl">{formatPrice(item.price_per_day)}</span>
              <span className="text-xs text-fg-muted sm:text-sm">/ día</span>
            </p>
            <span className="hidden rounded-md bg-surface-muted px-1.5 py-0.5 text-xs font-semibold text-fg-muted sm:inline">
              Fianza {formatPrice(item.deposit_amount)}
            </span>
          </div>
          <h3 className="line-clamp-1 text-sm font-bold transition-colors group-hover:text-primary-strong sm:text-base">
            {item.title}
          </h3>
          <p className="flex items-center gap-1 text-xs text-fg-muted sm:text-sm">
            <Icon name={category.icon} className="text-base text-primary" />
            <span className="truncate">{category.label}</span>
          </p>
          {distance && (
            <p className="flex items-center gap-1 text-xs font-semibold text-primary-strong sm:text-sm">
              <Icon name="near_me" className="text-base" />
              {distance}
            </p>
          )}
        </div>
      </Link>
      {actions && <div className="flex flex-wrap gap-2 px-3 pb-3 sm:px-4 sm:pb-4">{actions}</div>}
    </article>
  )
}

export default ItemCard
