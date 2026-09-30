import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuthContext, useFetch } from '../hooks'
import { deactivateItem, getItem, updateItem } from '../services'
import { itemToFormValues } from '../lib/mappers'
import { BlockedDatesManager, ItemForm, ItemImagesManager } from '../components/items'
import { AsyncContent, Button, Card, ConfirmButton, PageHeader } from '../components/ui'

// Gestion completa del objeto
function ItemEditPage() {
  const { id } = useParams()
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const { data: item, loading, error, reload, mutate } = useFetch(() => getItem(id), [id])

  return (
    <AsyncContent loading={loading} error={error} data={item} onRetry={reload}>
      {(it) =>
        it.owner_id !== user.id ? (
          <Navigate to="/403" replace />
        ) : (
          <div className="mx-auto flex max-w-4xl flex-col gap-6">
            <PageHeader
              title={it.title}
              subtitle="Gestiona tu objeto"
              actions={
                <Button variant="secondary" icon="visibility" to={`/items/${it.id}`}>
                  Ver anuncio
                </Button>
              }
            />

            <Card icon="edit" title="Datos del objeto">
              <ItemForm
                defaultValues={itemToFormValues(it)}
                onSubmit={(values) => updateItem(it.id, values)}
                onSuccess={(updated) => updated && mutate(updated)}
              />
            </Card>

            <ItemImagesManager itemId={it.id} />
            <BlockedDatesManager itemId={it.id} />

            <Card icon="visibility_off" title="Retirar objeto" subtitle="Dejará de aparecer en el listado y no se podrá alquilar.">
              <ConfirmButton
                variant="danger"
                title="¿Retirar el objeto?"
                message="Dejará de aparecer en el listado. Esta acción no se puede deshacer desde la app."
                confirmLabel="Retirar"
                onConfirm={async () => {
                  await deactivateItem(it.id)
                  navigate('/my-items')
                }}
              >
                Retirar objeto
              </ConfirmButton>
            </Card>
          </div>
        )
      }
    </AsyncContent>
  )
}

export default ItemEditPage
