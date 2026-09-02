import { DEPOSIT_STATUS, RENT_STATUS } from '../../../lib/constants'
import { formatCurrency } from '../../../lib/format'
import { DetailList, StatusBadge } from '../../ui'

// Resumen de un pago: importes y estados del alquiler y del depósito
function PaymentSummary({ payment, showPlatformFee = false }) {
  const captured = Number(payment.deposit_captured_amount || 0)

  return (
    <DetailList
      items={[
        {
          label: 'Alquiler',
          value: (
            <span className="flex flex-wrap items-center gap-2">
              {formatCurrency(payment.rent_amount)}
              <StatusBadge status={payment.rent_status} map={RENT_STATUS} />
            </span>
          ),
        },
        {
          label: 'Depósito',
          value: (
            <span className="flex flex-wrap items-center gap-2">
              {formatCurrency(payment.deposit_amount)}
              <StatusBadge status={payment.deposit_status} map={DEPOSIT_STATUS} />
            </span>
          ),
        },
        captured > 0 && { label: 'Depósito retenido', value: formatCurrency(captured) },
        showPlatformFee && { label: 'Comisión de la plataforma', value: formatCurrency(payment.platform_fee_amount) },
      ]}
    />
  )
}

export default PaymentSummary
