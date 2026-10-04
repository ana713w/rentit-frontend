import { useAction, useFetch } from '../../../hooks'
import { createContract, listContracts } from '../../../services'
import { CONTRACT_TYPES } from '../../../lib/constants'
import { formatDate } from '../../../lib/format'
import { Alert, AsyncContent, Button, Card } from '../../ui'
import ContractCard from '../contract-card/contract-card'

const isFullySigned = (contract) => Boolean(contract?.guest_signed_at && contract?.owner_signed_at)

// Contratos de entrega y devolucion
// entrega: desde el dia antes de la recogida, firmado antes del check-in
// devolucion: tras el check-in, firmado antes del check-out
// onChange avisa al padre tras generar o firmar
function ContractsSection({ reservationId, role, flow, onChange }) {
  const { data: contracts, loading, error, reload } = useFetch(() => listContracts(reservationId), [reservationId])
  const create = useAction((type) => createContract(reservationId, type))

  const refresh = () => {
    reload()
    onChange?.()
  }

  const byType = Object.fromEntries((contracts || []).map((contract) => [contract.contract_type, contract]))

  // motivo por el que aun no se puede generar
  const lockReason = (type) => {
    if (type === 'rental') {
      return flow.preparationOpen ? null : `Disponible a partir del ${formatDate(flow.opensOn)}, el día antes de la recogida.`
    }
    if (!isFullySigned(byType.rental)) return 'Disponible cuando ambas partes firmen el contrato de entrega.'
    if (!flow.checkIn) return 'Disponible después del check-in, al devolver el objeto.'
    return null
  }

  const handleCreate = async (type) => {
    const { ok } = await create.run(type)
    if (ok) refresh()
  }

  return (
    <Card
      icon="contract_edit"
      title="Contratos"
      subtitle="El de entrega se firma antes del check-in y el acta de devolución antes del check-out. Cada parte firma con un código que recibe por email."
    >
      <AsyncContent loading={loading} error={error} data={contracts} onRetry={reload}>
        {() => (
          <div className="flex flex-col gap-4">
            {Object.entries(CONTRACT_TYPES).map(([type, label]) => {
              const contract = byType[type]
              if (contract) return <ContractCard key={type} contract={contract} role={role} onChange={refresh} />

              const blocked = lockReason(type)
              return (
                <div
                  key={type}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-input border-2 border-dashed border-line p-4"
                >
                  <div>
                    <p className="font-bold">{label}</p>
                    <p className="text-sm text-fg-muted">{blocked || 'Aún no se ha generado.'}</p>
                  </div>
                  <Button size="sm" variant="secondary" disabled={Boolean(blocked)} loading={create.loading} onClick={() => handleCreate(type)}>
                    Generar
                  </Button>
                </div>
              )
            })}
            <Alert error={create.error} />
          </div>
        )}
      </AsyncContent>
    </Card>
  )
}

export default ContractsSection
