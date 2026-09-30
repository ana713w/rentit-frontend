import { useState } from 'react'
import { captureDeposit, releaseDeposit } from '../../../services'
import { formatCurrency } from '../../../lib/format'
import { ConfirmButton, Input } from '../../ui'

// Devolver o retener el deposito tras el check-out
function DepositActions({ paymentId, depositAmount, onChange }) {
  const [amount, setAmount] = useState('')
  const max = Number(depositAmount)
  const invalidAmount = amount !== '' && (Number(amount) <= 0 || Number(amount) > max)

  return (
    <div className="flex flex-col gap-4 rounded-input bg-surface-muted p-4">
      <p className="text-sm text-fg-muted">
        El check-out ya está hecho. Devuelve el depósito o retén una parte si hay desperfectos.
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <ConfirmButton
          variant="primary"
          title="¿Devolver el depósito completo?"
          message={`Se liberarán ${formatCurrency(max)} a quien alquiló el objeto.`}
          confirmLabel="Devolver"
          onConfirm={async () => onChange?.(await releaseDeposit(paymentId))}
        >
          Devolver depósito
        </ConfirmButton>

        <Input
          label="Importe a retener (€)"
          type="number"
          step="0.01"
          min="0"
          max={max}
          placeholder={`Todo (${max})`}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          error={invalidAmount ? `Entre 0 y ${formatCurrency(max)}` : undefined}
          className="w-48"
        />
        <ConfirmButton
          variant="danger-outline"
          disabled={invalidAmount}
          title="¿Retener el depósito?"
          message={`Se capturarán ${formatCurrency(amount || max)} del depósito.`}
          confirmLabel="Retener"
          onConfirm={async () => onChange?.(await captureDeposit(paymentId, amount || undefined))}
        >
          Retener
        </ConfirmButton>
      </div>
    </div>
  )
}

export default DepositActions
