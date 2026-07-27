import Spinner from '../spinner/spinner'

function LoadingScreen({ message = 'Cargando...' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-primary">
      <Spinner size="lg" />
      <p className="text-sm text-fg-muted">{message}</p>
    </div>
  )
}

export default LoadingScreen
