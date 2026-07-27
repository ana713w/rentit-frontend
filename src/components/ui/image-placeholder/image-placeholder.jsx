import { cn } from '../../../lib/cn'

import Icon from '../icon/icon'

function ImagePlaceholder({ label = 'Sin fotos', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-1 bg-surface-muted text-sm text-fg-subtle', className)}>
      <Icon name="image" className="text-3xl" />
      {label}
    </div>
  )
}

export default ImagePlaceholder
