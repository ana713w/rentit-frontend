import { useAction, useFetch } from '../../../hooks'
import { createVerification, listVerifications } from '../../../services'
import { VERIFICATION_TYPES } from '../../../lib/constants'
import { Alert, AsyncContent, Button, Card, ConfirmButton } from '../../ui'
import VerificationCard from '../verification-card/verification-card'

/**
 * Check-in y check-out de una reserva. Crear el check-out completa la reserva,
 * por eso avisa al padre con onReservationChange para que la recargue.
 */
function VerificationsSection({ reservationId, userId, onReservationChange, onChange }) {
  const { data: verifications, loading, error, reload } = useFetch(
    () => listVerifications(reservationId),
    [reservationId],
  )
  const create = useAction((verificationType) => createVerification(reservationId, { verificationType }))

  const byType = Object.fromEntries((verifications || []).map((v) => [v.verification_type, v]))

  const handleCreate = async (type) => {
    const { ok, error: createError } = await create.run(type)
    if (!ok) throw createError
    reload()
    onChange?.()
    if (type === 'check_out') onReservationChange?.()
  }

  return (
    <Card icon="photo_camera" title="Check-in y check-out" subtitle="Las dos partes suben fotos al mismo registro. Cada una solo puede borrar las suyas.">
      <AsyncContent loading={loading} error={error} data={verifications} onRetry={reload}>
        {() => (
          <div className="flex flex-col gap-4">
            {Object.entries(VERIFICATION_TYPES).map(([type, label]) => {
              const verification = byType[type]
              if (verification) return <VerificationCard key={type} verification={verification} userId={userId} />

              const blocked = type === 'check_out' && !byType.check_in
              return (
                <div
                  key={type}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-input border-2 border-dashed border-line p-4"
                >
                  <div>
                    <p className="font-bold">{label}</p>
                    <p className="text-sm text-fg-muted">
                      {blocked ? 'Primero hay que hacer el check-in.' : 'Aún no se ha iniciado.'}
                    </p>
                  </div>
                  {type === 'check_out' ? (
                    <ConfirmButton
                      size="sm"
                      disabled={blocked}
                      title="¿Iniciar el check-out?"
                      message="Al crear el check-out la reserva pasa a completada."
                      confirmLabel="Iniciar check-out"
                      onConfirm={() => handleCreate(type)}
                    >
                      Iniciar
                    </ConfirmButton>
                  ) : (
                    <Button size="sm" variant="secondary" loading={create.loading} onClick={() => handleCreate(type).catch(() => {})}>
                      Iniciar
                    </Button>
                  )}
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

export default VerificationsSection
