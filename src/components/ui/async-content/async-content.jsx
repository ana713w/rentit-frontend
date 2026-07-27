import Alert from '../alert/alert'
import Button from '../button/button'
import Spinner from '../spinner/spinner'

/**
 * Resuelve los tres estados típicos de una carga con useFetch.
 *
 *   <AsyncContent loading={loading} error={error} data={data} onRetry={reload}
 *                 isEmpty={!data?.length} empty={<EmptyState title="Nada aquí" />}>
 *     {(items) => <List items={items} />}
 *   </AsyncContent>
 *
 * Mientras recarga con datos ya pintados, no muestra el spinner (sin parpadeo).
 */
function AsyncContent({ loading, error, data, onRetry, isEmpty = false, empty = null, children }) {
  if (loading && !data) {
    return (
      <div className="flex justify-center py-12 text-primary">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error && !data) {
    return (
      <Alert
        error={error}
        action={
          onRetry && (
            <Button size="sm" variant="secondary" onClick={onRetry}>
              Reintentar
            </Button>
          )
        }
      />
    )
  }

  if (isEmpty) return empty

  return typeof children === 'function' ? children(data) : children
}

export default AsyncContent
