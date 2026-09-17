import { useState } from 'react'
import { useFetch } from '../hooks'
import { listAllDisputes, startDisputeReview } from '../services'
import { DISPUTE_STATUS } from '../lib/constants'
import { DisputeCard, ResolveDisputeForm } from '../components/disputes'
import { AsyncContent, Button, ConfirmButton, EmptyState, PageHeader, Tabs } from '../components/ui'

const FILTERS = [{ id: 'all', label: 'Todas' }, ...Object.entries(DISPUTE_STATUS).map(([id, s]) => ({ id, label: s.label }))]

function AdminDisputesPage() {
  const { data: disputes, loading, error, reload } = useFetch(listAllDisputes, [])
  const [filter, setFilter] = useState('open')
  const [resolvingId, setResolvingId] = useState(null)

  const count = (id) => (disputes || []).filter((d) => id === 'all' || d.status === id).length
  const visible = (disputes || []).filter((d) => filter === 'all' || d.status === filter)

  return (
    <>
      <PageHeader title="Disputas" subtitle="Revisa y resuelve las disputas entre arrendatarios y propietarios." />

      <Tabs tabs={FILTERS.map((f) => ({ ...f, count: disputes ? count(f.id) : undefined }))} value={filter} onChange={setFilter} />

      <AsyncContent
        loading={loading}
        error={error}
        data={disputes}
        onRetry={reload}
        isEmpty={visible.length === 0}
        empty={<EmptyState title="No hay disputas aquí" />}
      >
        <div className="flex flex-col gap-4">
          {visible.map((dispute) => (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              header={
                dispute.status !== 'resolved' && (
                  <div className="flex gap-2">
                    {dispute.status === 'open' && (
                      <ConfirmButton
                        size="sm"
                        title="¿Empezar la revisión?"
                        message="La disputa pasará a «En revisión»."
                        confirmLabel="Empezar"
                        onConfirm={async () => {
                          await startDisputeReview(dispute.id)
                          reload()
                        }}
                      >
                        Revisar
                      </ConfirmButton>
                    )}
                    {resolvingId !== dispute.id && (
                      <Button size="sm" onClick={() => setResolvingId(dispute.id)}>
                        Resolver
                      </Button>
                    )}
                  </div>
                )
              }
            >
              {resolvingId === dispute.id && (
                <ResolveDisputeForm
                  dispute={dispute}
                  onCancel={() => setResolvingId(null)}
                  onResolved={() => {
                    setResolvingId(null)
                    reload()
                  }}
                />
              )}
              <p className="text-xs text-fg-muted">Reserva {dispute.reservation_id}</p>
            </DisputeCard>
          ))}
        </div>
      </AsyncContent>
    </>
  )
}

export default AdminDisputesPage
