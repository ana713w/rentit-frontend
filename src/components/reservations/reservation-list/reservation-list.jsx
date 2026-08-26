import ReservationCard from '../reservation-card/reservation-card'

// renderActions(reservation) → botones opcionales en cada fila
function ReservationList({ reservations, renderActions }) {
  return (
    <div className="flex flex-col gap-3">
      {reservations.map((reservation) => (
        <ReservationCard key={reservation.id} reservation={reservation} actions={renderActions?.(reservation)} />
      ))}
    </div>
  )
}

export default ReservationList
