import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFetch } from '../../../hooks'
import { createBlockedDates, deleteBlockedDates, listBlockedDates } from '../../../services'
import { formatDate, toISODate } from '../../../lib/format'
import { applyServerErrors } from '../../../lib/form-errors'
import { Alert, AsyncContent, Button, Card, ConfirmButton, DateRangeFields, Input } from '../../ui'
import AvailabilityCalendar from '../availability-calendar/availability-calendar'

// Bloqueo de fechas (solo dueño)
function BlockedDatesManager({ itemId }) {
  const { data: blocks, loading, error, reload } = useFetch(() => listBlockedDates(itemId), [itemId])
  const [serverError, setServerError] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { startDate: '', endDate: '', reason: '' } })

  const onSubmit = async ({ reason, ...dates }) => {
    setServerError(null)
    try {
      await createBlockedDates(itemId, { ...dates, ...(reason ? { reason } : {}) })
      reset()
      reload()
    } catch (err) {
      if (err.status === 409) {
        setServerError({ message: 'Esas fechas chocan con otro bloqueo o con una reserva confirmada.' })
      } else if (!applyServerErrors(err, setError)) {
        setServerError(err)
      }
    }
  }

  return (
    <Card icon="event_busy" title="Fechas bloqueadas" subtitle="La fecha de fin queda libre: del 10 al 15 bloquea los días del 10 al 14">
      <div className="flex flex-col gap-6">
        <AvailabilityCalendar blockedRanges={blocks || []} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3 rounded-input bg-surface-muted p-4">
          <DateRangeFields register={register} errors={errors} min={toISODate(new Date())} />
          <Input label="Motivo (opcional)" {...register('reason')} />
          <Alert error={serverError} />
          <div>
            <Button type="submit" loading={isSubmitting}>
              Bloquear fechas
            </Button>
          </div>
        </form>

        <AsyncContent loading={loading} error={error} data={blocks} onRetry={reload} isEmpty={blocks?.length === 0}>
          {(items) => (
            <ul className="divide-y divide-line">
              {items.map((block) => (
                <li key={block.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="text-sm font-bold">
                      {formatDate(block.start_date)} → {formatDate(block.end_date)}
                    </p>
                    {block.reason && <p className="text-xs text-fg-muted">{block.reason}</p>}
                  </div>
                  <ConfirmButton
                    size="sm"
                    variant="danger-outline"
                    title="¿Desbloquear estas fechas?"
                    confirmLabel="Desbloquear"
                    onConfirm={async () => {
                      await deleteBlockedDates(itemId, block.id)
                      reload()
                    }}
                  >
                    Quitar
                  </ConfirmButton>
                </li>
              ))}
            </ul>
          )}
        </AsyncContent>
      </div>
    </Card>
  )
}

export default BlockedDatesManager
