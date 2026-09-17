import { DISPUTE_STATUS } from '../../../lib/constants'
import { formatCurrency, formatDateTime } from '../../../lib/format'
import { StatusBadge } from '../../ui'

/**
 * Una disputa con su motivo y, si está resuelta, la resolución.
 * children: acciones extra (el panel de admin mete aquí revisar/resolver).
 */
function DisputeCard({ dispute, header, children }) {
  return (
    <article className="flex flex-col gap-3 rounded-input bg-surface-muted p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StatusBadge status={dispute.status} map={DISPUTE_STATUS} />
          <span className="text-xs text-fg-muted">Abierta el {formatDateTime(dispute.created_at)}</span>
        </div>
        {header}
      </div>

      <p className="text-sm whitespace-pre-line text-fg">{dispute.reason}</p>

      {dispute.requested_capture_amount != null && (
        <p className="text-sm text-fg-muted">
          Importe solicitado del depósito:{' '}
          <span className="font-medium text-fg">{formatCurrency(dispute.requested_capture_amount)}</span>
        </p>
      )}

      {dispute.status === 'resolved' && (
        <div className="rounded-input bg-success-soft p-3 text-sm">
          <p className="font-semibold text-success">Resolución · {formatDateTime(dispute.resolved_at)}</p>
          <p className="mt-1 whitespace-pre-line text-fg">{dispute.resolution}</p>
        </div>
      )}

      {children}
    </article>
  )
}

export default DisputeCard
