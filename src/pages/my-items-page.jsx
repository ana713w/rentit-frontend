import { Link } from 'react-router-dom'
import { useAuthContext, useFetch } from '../hooks'
import { listItems } from '../services'
import { ItemList } from '../components/items'
import { AsyncContent, Button, EmptyState, PageHeader } from '../components/ui'

function MyItemsPage() {
  const { user } = useAuthContext()
  const { data: items, loading, error, reload } = useFetch(listItems, [])

  // filtra por owner_id
  const mine = (items || []).filter((item) => item.owner_id === user.id)

  return (
    <>
      <PageHeader
        title="Mis objetos"
        subtitle={
          <>
            Gestiona tus anuncios, fotos y disponibilidad. Para cobrar, configura tus{' '}
            <Link to="/profile">cobros en el perfil</Link>.
          </>
        }
        actions={
          <Button to="/items/new" icon="add">
            Subir objeto
          </Button>
        }
      />

      <AsyncContent
        loading={loading}
        error={error}
        data={items}
        onRetry={reload}
        isEmpty={mine.length === 0}
        empty={
          <EmptyState
            title="Aún no has publicado nada"
            description="Publica tu primer objeto y empieza a ganar dinero con lo que no usas."
            action={
              <Button to="/items/new" icon="add">
                Subir objeto
              </Button>
            }
          />
        }
      >
        <ItemList
          items={mine}
          renderActions={(item) => (
            <Button size="sm" variant="soft" icon="edit" to={`/items/${item.id}/edit`} fullWidth>
              Gestionar
            </Button>
          )}
        />
      </AsyncContent>
    </>
  )
}

export default MyItemsPage
