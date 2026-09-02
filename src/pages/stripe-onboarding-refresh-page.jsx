import { useEffect, useState } from 'react'
import { redirectToOnboarding } from '../services'
import { Alert, Button, Card, LoadingScreen } from '../components/ui'

// El enlace de Stripe caducó: pedimos uno nuevo y redirigimos
function StripeOnboardingRefreshPage() {
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    redirectToOnboarding().catch(setError)
  }, [attempt])

  if (!error) return <LoadingScreen message="Redirigiendo a Stripe..." />

  return (
    <div className="mx-auto max-w-lg">
      <Card title="Configuración de cobros">
        <Alert
          error={error}
          action={
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setError(null)
                setAttempt((n) => n + 1)
              }}
            >
              Reintentar
            </Button>
          }
        />
      </Card>
    </div>
  )
}

export default StripeOnboardingRefreshPage
