import Alert from '../alert/alert'
import Button from '../button/button'
import Spinner from '../spinner/spinner'

// Estados de carga, error y vacio para useFetch
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
