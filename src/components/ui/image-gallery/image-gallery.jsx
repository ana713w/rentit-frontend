import { useState } from 'react'
import { cn } from '../../../lib/cn'
import ImagePlaceholder from '../image-placeholder/image-placeholder'

// Galería con imagen grande y miniaturas. images: [{ id, url }]
function ImageGallery({ images = [], alt = '' }) {
  const [selectedId, setSelectedId] = useState(null)

  if (!images.length) return <ImagePlaceholder className="aspect-[4/3] rounded-card" />

  const selected = images.find((image) => image.id === selectedId) || images[0]

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[4/3] overflow-hidden rounded-card bg-surface-muted shadow-card">
        <img src={selected.url} alt={alt} className="size-full object-cover" />
      </div>
      {images.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image) => (
            <li key={image.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setSelectedId(image.id)}
                className={cn(
                  'block size-16 overflow-hidden rounded-input border-2 transition-opacity',
                  image.id === selected.id ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100',
                )}
              >
                <img src={image.url} alt="" className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ImageGallery
