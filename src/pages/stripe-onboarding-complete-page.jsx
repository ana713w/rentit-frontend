import { useFetch } from '../hooks'
import { getOnboardingStatus } from '../services'
import { Alert, AsyncContent, Button, Card } from '../components/ui'

// Vuelta de Stripe tras el alta
function StripeOnboardingCompletePage() {
  const { data: status, loading, error, reload } = useFetch(getOnboardingStatus, [])

  return (
    <div className="mx-auto max-w-lg">
      <Card title="Configuración de cobros">
        <AsyncContent loading={loading} error={error} data={status} onRetry={reload}>
          {(s) => (
            <div className="flex flex-col gap-4">
              {s.chargesEnabled ? (
                <Alert tone="success" title="¡Todo listo!">
                  Ya puedes recibir pagos de tus reservas.
                </Alert>
              ) : (
                <Alert tone="warning" title="Aún no puedes cobrar">
                  Stripe está revisando tus datos o falta información. Puedes volver a intentarlo desde tu perfil.
                </Alert>
              )}
              <div>
                <Button to="/profile">Ir a mi perfil</Button>
              </div>
            </div>
          )}
        </AsyncContent>
      </Card>
    </div>
  )
}

export default StripeOnboardingCompletePage
