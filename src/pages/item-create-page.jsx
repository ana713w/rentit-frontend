import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks'
import { createItem } from '../services'
import { ItemForm } from '../components/items'
import { Button, Card, EmptyState, PageHeader } from '../components/ui'

function ItemCreatePage() {
  const navigate = useNavigate()
  const { user } = useAuthContext()

  // La API exige dirección en el perfil para publicar (es donde se recogen los objetos)
  if (!user.address) {
    return (
      <div className="mx-auto max-w-2xl">
        <EmptyState
          icon="home_pin"
          title="Antes de publicar, añade tu dirección"
          description="Es donde se recogen y devuelven tus objetos. Solo tienes que hacerlo una vez."
          action={
            <Button to="/profile" icon="edit_location">
              Añadir dirección
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Subir objeto" subtitle="Después podrás añadir fotos y bloquear los días que no esté disponible." />
      <Card>
        <ItemForm
          submitLabel="Publicar objeto"
          onSubmit={createItem}
          onSuccess={(item) => navigate(`/items/${item.id}/edit`)}
        />
      </Card>
    </div>
  )
}

export default ItemCreatePage
