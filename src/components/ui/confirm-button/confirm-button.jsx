import { useState } from 'react'
import Button from '../button/button'
import Modal from '../modal/modal'
import Alert from '../alert/alert'

// Boton con confirmacion en modal
function ConfirmButton({
  title = '¿Quieres continuar?',
  message,
  confirmLabel = 'Confirmar',
  confirmVariant,
  onConfirm,
  variant = 'secondary',
  size,
  disabled,
  children,
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const close = () => {
    if (loading) return
    setOpen(false)
    setError(null)
  }

  const confirm = async () => {
    setLoading(true)
    setError(null)
    try {
      await onConfirm()
      setOpen(false)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant={variant} size={size} disabled={disabled} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Modal
        open={open}
        onClose={close}
        title={title}
        footer={
          <>
            <Button variant="ghost" onClick={close} disabled={loading}>
              Volver
            </Button>
            <Button variant={confirmVariant || (variant.startsWith('danger') ? 'danger' : 'primary')} loading={loading} onClick={confirm}>
              {confirmLabel}
            </Button>
          </>
        }
      >
        {message}
        {error && <Alert error={error} className="mt-4" />}
      </Modal>
    </>
  )
}

export default ConfirmButton
