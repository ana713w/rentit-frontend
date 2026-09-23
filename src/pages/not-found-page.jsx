import { Button, EmptyState } from '../components/ui'

function NotFoundPage() {
  return (
    <EmptyState
      title="Página no encontrada"
      description="La página que buscas no existe o se ha movido."
      action={<Button to="/">Volver al inicio</Button>}
    />
  )
}

export default NotFoundPage
