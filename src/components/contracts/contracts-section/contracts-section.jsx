import { useAction, useFetch } from '../../../hooks'
import { createContract, listContracts } from '../../../services'
import { CONTRACT_TYPES } from '../../../lib/constants'
import { Alert, AsyncContent, Button, Card } from '../../ui'
import ContractCard from '../contract-card/contract-card'

const isFullySigned = (contract) => Boolean(contract?.guest_signed_at && contract?.owner_signed_at)

// Contratos de entrega (rental) y devolución (return) de una reserva.
// onChange: avisa al padre tras generar o firmar (p. ej. para la línea de tiempo)
function ContractsSection({ reservationId, role, onChange }) {
  const { data: contracts, loading, error, reload } = useFetch(() => listContracts(reservationId), [reservationId])
  const create = useAction((type) => createContract(reservationId, type))

  const refresh = () => {
    reload()
    onChange?.()
  }

  const byType = Object.fromEntries((contracts || []).map((contract) => [contract.contract_type, contract]))

  const handleCreate = async (type) => {
    const { ok } = await create.run(type)
    if (ok) refresh()
  }

  return (
    <Card icon="contract_edit" title="Contratos" subtitle="Cada parte firma con un código que recibe por email. Al firmar ambas se genera el PDF.">
      <AsyncContent loading={loading} error={error} data={contracts} onRetry={reload}>
        {() => (
          <div className="flex flex-col gap-4">
            {Object.entries(CONTRACT_TYPES).map(([type, label]) => {
              const contract = byType[type]
              if (contract) return <ContractCard key={type} contract={contract} role={role} onChange={refresh} />

              const blocked = type === 'return' && !isFullySigned(byType.rental)
              return (
                <div
                  key={type}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-input border-2 border-dashed border-line p-4"
                >
                  <div>
                    <p className="font-bold">{label}</p>
                    <p className="text-sm text-fg-muted">
                      {blocked ? 'Disponible cuando ambas partes firmen el contrato de entrega.' : 'Aún no se ha generado.'}
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" disabled={blocked} loading={create.loading} onClick={() => handleCreate(type)}>
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
