import { cn } from '../../../lib/cn'

/**
 * Rejilla de fotos con acciones opcionales por foto.
 *   <PhotoGrid
 *     photos={images}
 *     renderBadge={(img) => img.is_primary && <Badge>Principal</Badge>}
 *     renderActions={(img) => <Button size="sm">Borrar</Button>}
 *   />
 */
function PhotoGrid({ photos, renderBadge, renderActions, className }) {
  return (
    <ul className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4', className)}>
      {photos.map((photo) => {
        const badge = renderBadge?.(photo)
        const actions = renderActions?.(photo)
        return (
          <li key={photo.id} className="overflow-hidden rounded-input bg-surface shadow-card">
            <div className="relative aspect-[4/3] bg-surface-muted">
              <a href={photo.url} target="_blank" rel="noreferrer">
                <img src={photo.url} alt="" loading="lazy" className="size-full object-cover" />
              </a>
              {badge && <div className="absolute top-2 left-2">{badge}</div>}
            </div>
            {actions && <div className="flex flex-wrap gap-1 p-2">{actions}</div>}
          </li>
        )
      })}
    </ul>
  )
}

export default PhotoGrid
