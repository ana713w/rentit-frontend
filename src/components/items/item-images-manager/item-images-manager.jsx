import { useAction, useFetch } from '../../../hooks'
import { deleteItemImage, listItemImages, setPrimaryImage, uploadItemImages } from '../../../services'
import { Alert, AsyncContent, Badge, Button, Card, ConfirmButton, EmptyState, FileUploader, PhotoGrid } from '../../ui'

// Gestión de fotos de un objeto (solo dueño): subir, marcar principal y borrar
function ItemImagesManager({ itemId }) {
  const { data: images, loading, error, reload } = useFetch(() => listItemImages(itemId), [itemId])

  const primary = useAction((imageId) => setPrimaryImage(itemId, imageId))

  const makePrimary = async (imageId) => {
    const { ok } = await primary.run(imageId)
    if (ok) reload()
  }

  return (
    <Card icon="photo_library" title="Fotos" subtitle="La foto principal es la que aparece en las tarjetas del listado">
      <div className="flex flex-col gap-6">
        <FileUploader onUpload={(files) => uploadItemImages(itemId, files)} onUploaded={reload} />
        <Alert error={primary.error} />

        <AsyncContent
          loading={loading}
          error={error}
          data={images}
          onRetry={reload}
          isEmpty={images?.length === 0}
          empty={
            <EmptyState
              icon="add_a_photo"
              title="Aún no hay fotos"
              description="Los objetos con foto se alquilan mucho más. La primera que subas será la principal."
              className="shadow-none"
            />
          }
        >
          {(items) => (
            <PhotoGrid
              photos={items}
              renderBadge={(image) => image.is_primary && <Badge tone="glass">Principal</Badge>}
              renderActions={(image) => (
                <>
                  {!image.is_primary && (
                    <Button size="sm" variant="ghost" disabled={primary.loading} onClick={() => makePrimary(image.id)}>
                      Hacer principal
                    </Button>
                  )}
                  <ConfirmButton
                    size="sm"
                    variant="danger-outline"
                    title="¿Borrar esta foto?"
                    message={image.is_primary ? 'Es la principal: pasará a serlo la más antigua.' : undefined}
                    confirmLabel="Borrar"
                    onConfirm={async () => {
                      await deleteItemImage(itemId, image.id)
                      reload()
                    }}
                  >
                    Borrar
                  </ConfirmButton>
                </>
              )}
            />
          )}
        </AsyncContent>
      </div>
    </Card>
  )
}

export default ItemImagesManager
