import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFetch } from '../hooks'
import { listMyReservations, listOwnerReservations } from '../services'
import { RESERVATION_STATUS } from '../lib/constants'
import { ReservationActions, ReservationList } from '../components/reservations'
import { AsyncContent, Button, Chip, EmptyState, PageHeader, Tabs } from '../components/ui'

const TABS = {
  guest: {
    label: 'Lo que alquilo',
    fetcher: listMyReservations,
    empty: { title: 'Aún no has alquilado nada', description: 'Explora los objetos cerca de ti y solicita tu primer alquiler.' },
  },
  owner: {
    label: 'Solicitudes recibidas',
    fetcher: listOwnerReservations,
    empty: { title: 'No has recibido solicitudes', description: 'Cuando alguien quiera alquilar uno de tus objetos, aparecerá aquí.' },
  },
}

function ReservationsPage() {
  // La pestaña va en la URL (?as=owner) para poder enlazarla
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('as') === 'owner' ? 'owner' : 'guest'
  const { data: reservations, loading, error, reload } = useFetch(TABS[tab].fetcher, [tab])
  const [status, setStatus] = useState('all')

  const count = (id) => (reservations || []).filter((r) => id === 'all' || r.status === id).length
  const visible = (reservations || []).filter((r) => status === 'all' || r.status === status)

  return (
    <>
      <PageHeader title="Reservas" subtitle="Sigue cada alquiler desde la solicitud hasta la devolución." />

      <Tabs
        tabs={Object.entries(TABS).map(([id, config]) => ({ id, label: config.label }))}
        value={tab}
        onChange={(id) => {
          setStatus('all')
          setSearchParams(id === 'owner' ? { as: 'owner' } : {})
        }}
      />

      {reservations?.length > 0 && (
        <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none md:mx-0 md:px-0">
          <Chip active={status === 'all'} count={count('all')} onClick={() => setStatus('all')}>
            Todas
          </Chip>
          {Object.entries(RESERVATION_STATUS)
            .filter(([id]) => count(id) > 0)
            .map(([id, config]) => (
              <Chip key={id} active={status === id} count={count(id)} onClick={() => setStatus(id)}>
                {config.label}
              </Chip>
            ))}
        </div>
      )}

      <AsyncContent
        loading={loading}
        error={error}
        data={reservations}
        onRetry={reload}
        isEmpty={visible.length === 0}
        empty={
          <EmptyState
            icon="event_available"
            {...(reservations?.length ? { title: 'No hay reservas con este estado' } : TABS[tab].empty)}
            action={tab === 'guest' && !reservations?.length && <Button to="/">Explorar objetos</Button>}
          />
        }
      >
        <ReservationList
          reservations={visible}
          renderActions={
            tab === 'owner'
              ? (reservation) =>
                  reservation.status === 'pending' && (
                    <ReservationActions reservation={reservation} role="owner" onChange={reload} />
                  )
              : undefined
          }
        />
      </AsyncContent>
    </>
  )
}

export default ReservationsPage
