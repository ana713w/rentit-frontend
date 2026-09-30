import { useEffect, useRef } from 'react'

// Modal basado en <dialog>
function Modal({ open, onClose, title, footer, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-card bg-surface p-0 text-fg shadow-raised backdrop:bg-overlay backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="flex flex-col gap-4 p-6">
          {title && <h2 className="text-lg">{title}</h2>}
          <div className="text-sm text-fg-muted">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-2">{footer}</div>}
        </div>
      )}
    </dialog>
  )
}

export default Modal
