import { Button, EmptyState } from '../components/ui'

function ForbiddenPage() {
  return (
    <EmptyState
      title="No tienes permiso"
      description="Tu cuenta no tiene acceso a esta página."
      action={<Button to="/">Volver al inicio</Button>}
    />
  )
}

export default ForbiddenPage
