import { useAction, useFetch } from '../../../hooks'
import { getOnboardingStatus, redirectToOnboarding } from '../../../services'
import { Alert, AsyncContent, Badge, Button, Card } from '../../ui'

// Estado de la cuenta de cobros del dueño + botón "Configurar cobros"
function StripeOnboardingCard() {
  const { data: status, loading, error, reload } = useFetch(getOnboardingStatus, [])
  const start = useAction(redirectToOnboarding)
  const ready = status?.chargesEnabled

  return (
    <Card
      icon="account_balance"
      title="Cobros"
      subtitle="Para cobrar tus alquileres necesitas una cuenta de Stripe"
      actions={ready && <Badge tone="success">Cobros activos</Badge>}
    >
      <AsyncContent loading={loading} error={error} data={status} onRetry={reload}>
        {() =>
          ready ? (
            <p className="text-sm text-fg-muted">Tu cuenta está lista para cobrar alquileres y retener depósitos.</p>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-fg-muted">
                {status.onboarded || status.detailsSubmitted
                  ? 'Stripe todavía está revisando tus datos o falta información.'
                  : 'Aún no has configurado tus cobros.'}
              </p>
              <div>
                <Button onClick={() => start.run()} loading={start.loading}>
                  {status.detailsSubmitted ? 'Completar datos en Stripe' : 'Configurar cobros'}
                </Button>
              </div>
              <Alert error={start.error} />
            </div>
          )
        }
      </AsyncContent>
    </Card>
  )
}

export default StripeOnboardingCard
