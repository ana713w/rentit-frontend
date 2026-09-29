import { directionsUrl } from '../../../lib/google-maps'
import { Button, Card, DetailList } from '../../ui'

const TITLES = {
  owner: 'Contacto del propietario',
  guest: 'Contacto del arrendatario',
}

const SUBTITLES = {
  owner: 'Queda con el propietario para recoger el objeto (check-in) y devolverlo (check-out).',
  guest: 'Queda con el arrendatario para la entrega (check-in) y la devolución (check-out).',
}

/**
 * Datos de la otra parte de la reserva. La API solo los devuelve (reservation.counterpart)
 * cuando la reserva está confirmada o completada.
 */
function ContactCard({ counterpart }) {
  const { role, fullName, email, phone, pickupAddress } = counterpart

  return (
    <Card
      icon="contact_phone"
      title={TITLES[role]}
      subtitle={SUBTITLES[role]}
      actions={
        <>
          {phone && (
            <Button href={`tel:${phone}`} variant="soft" size="sm" icon="call">
              Llamar
            </Button>
          )}
          <Button href={`mailto:${email}`} variant="soft" size="sm" icon="mail">
            Email
          </Button>
        </>
      }
    >
      <DetailList
        columns={pickupAddress ? 2 : 3}
        items={[
          { label: 'Nombre', value: fullName },
          { label: 'Teléfono', value: phone ? <a href={`tel:${phone}`}>{phone}</a> : 'No indicado' },
          { label: 'Email', value: <a href={`mailto:${email}`}>{email}</a> },
          ...(pickupAddress ? [{ label: 'Punto de recogida y devolución', value: pickupAddress }] : []),
        ]}
      />
      {pickupAddress && (
        <div className="mt-4">
          <Button
            href={directionsUrl(pickupAddress)}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            icon="directions"
          >
            Cómo llegar
          </Button>
        </div>
      )}
    </Card>
  )
}

export default ContactCard
