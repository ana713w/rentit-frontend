import { useState } from 'react'
import { useFetch } from '../../../hooks'
import { listReservationDisputes } from '../../../services'
import { AsyncContent, Button, Card } from '../../ui'
import DisputeCard from '../dispute-card/dispute-card'
import DisputeForm from '../dispute-form/dispute-form'

// Disputas de una reserva, solo una abierta a la vez
function DisputesSection({ reservationId }) {
  const { data: disputes, loading, error, reload } = useFetch(
    () => listReservationDisputes(reservationId),
    [reservationId],
  )
  const [formOpen, setFormOpen] = useState(false)

  const hasUnresolved = (disputes || []).some((dispute) => dispute.status !== 'resolved')

  return (
    <Card
      icon="gavel"
      title="Disputas"
      subtitle="Si algo no ha ido bien, abre una disputa y un administrador la revisará."
      actions={
        !formOpen && (
          <Button
            size="sm"
            variant="secondary"
            disabled={hasUnresolved || !disputes}
            title={hasUnresolved ? 'Ya hay una disputa en curso' : undefined}
            onClick={() => setFormOpen(true)}
          >
            Abrir disputa
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        {formOpen && (
          <DisputeForm
            reservationId={reservationId}
            onCancel={() => setFormOpen(false)}
            onCreated={() => {
              setFormOpen(false)
              reload()
            }}
          />
        )}
        <AsyncContent
          loading={loading}
          error={error}
          data={disputes}
          onRetry={reload}
          isEmpty={disputes?.length === 0}
          empty={!formOpen && <p className="text-sm text-fg-muted">No hay disputas para esta reserva.</p>}
        >
          {(items) => (
            <div className="flex flex-col gap-3">
              {items.map((dispute) => (
                <DisputeCard key={dispute.id} dispute={dispute} />
              ))}
            </div>
          )}
        </AsyncContent>
      </div>
    </Card>
  )
}

export default DisputesSection
