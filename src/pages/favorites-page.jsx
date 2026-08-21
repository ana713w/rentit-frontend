import { useFavorites, useFetch } from '../hooks'
import { listItems } from '../services'
import { ItemList } from '../components/items'
import { AsyncContent, Button, EmptyState, PageHeader } from '../components/ui'

// Favoritos guardados en este navegador (la API no tiene favoritos)
function FavoritesPage() {
  const { ids } = useFavorites()
  const { data: items, loading, error, reload } = useFetch(listItems, [])

  // En el orden en que se marcaron; los objetos retirados desaparecen solos
  const favorites = ids.map((id) => (items || []).find((item) => item.id === id)).filter(Boolean)

  return (
    <>
      <PageHeader title="Favoritos" subtitle="Los objetos que has guardado en este dispositivo." />
      <AsyncContent
        loading={loading}
        error={error}
        data={items}
        onRetry={reload}
        isEmpty={favorites.length === 0}
        empty={
          <EmptyState
            icon="favorite"
            title="Aún no tienes favoritos"
            description="Pulsa el corazón de cualquier objeto para guardarlo aquí."
            action={<Button to="/">Explorar objetos</Button>}
          />
        }
      >
        <ItemList items={favorites} />
      </AsyncContent>
    </>
  )
}

export default FavoritesPage
