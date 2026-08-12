import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuthContext, useFetch } from '../hooks'
import { getItem, listBlockedDates, listItemImages } from '../services'
import { getCategory } from '../lib/constants'
import { formatPrice } from '../lib/format'
import { AvailabilityCalendar, FavoriteButton, ReservationRequestForm } from '../components/items'
import { AsyncContent, Badge, Button, Card, Icon, ImageGallery } from '../components/ui'

const HOW_IT_WORKS = [
  { icon: 'send', text: 'Solicita las fechas. No se cobra nada hasta que el propietario acepte.' },
  { icon: 'contract_edit', text: 'Firmáis el contrato de entrega con un código por email.' },
  { icon: 'payments', text: 'Pagas el alquiler; la fianza solo se retiene en tu tarjeta.' },
  { icon: 'photo_camera', text: 'En la recogida y la devolución, ambos subís fotos del estado.' },
]

function ItemDetailPage() {
  const { id } = useParams()
  const { user } = useAuthContext()
  const item = useFetch(() => getItem(id), [id])
  const images = useFetch(() => listItemImages(id), [id])
  const blocked = useFetch(() => listBlockedDates(id), [id])
  const [selectedRange, setSelectedRange] = useState(null)

  return (
    <AsyncContent loading={item.loading} error={item.error} data={item.data} onRetry={item.reload}>
      {(it) => {
        const category = getCategory(it.category)
        const isOwner = user?.id === it.owner_id

        return (
          <>
            <nav className="mb-4 flex items-center gap-1 text-sm text-fg-muted">
              <Link to="/" className="font-semibold">
                Inicio
              </Link>
              <Icon name="chevron_right" className="text-base" />
              <Link to={`/?category=${encodeURIComponent(it.category)}`} className="font-semibold">
                {category.label}
              </Link>
            </nav>

            {!it.is_active && (
              <p className="mb-4 rounded-input bg-warning-soft px-4 py-3 text-sm font-semibold text-warning">
                Este objeto ya no está publicado y no se puede alquilar.
              </p>
            )}

            <div className="grid gap-6 lg:grid-cols-[1fr_24rem] lg:gap-8">
              <div className="flex min-w-0 flex-col gap-6">
                <div className="relative">
                  <ImageGallery images={images.data || []} alt={it.title} />
                  <FavoriteButton itemId={it.id} className="absolute top-3 right-3 size-11" />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="primary">
                      <Icon name={category.icon} className="text-sm" />
                      {category.label}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <h1 className="text-2xl font-extrabold sm:text-3xl">{it.title}</h1>
                    {isOwner && (
                      <Button variant="secondary" icon="edit" to={`/items/${it.id}/edit`}>
                        Gestionar objeto
                      </Button>
                    )}
                  </div>
                  <p className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-primary-strong">{formatPrice(it.price_per_day)}</span>
                    <span className="text-fg-muted">/ día</span>
                    <span className="ml-3 rounded-md bg-surface-muted px-2 py-0.5 text-sm font-semibold text-fg-muted">
                      Fianza {formatPrice(it.deposit_amount)}
                    </span>
                  </p>
                </div>

                <Card icon="description" title="Descripción">
                  {it.description ? (
                    <p className="whitespace-pre-line text-fg">{it.description}</p>
                  ) : (
                    <p className="text-sm text-fg-muted">El propietario no ha añadido una descripción.</p>
                  )}
                </Card>

                <Card icon="calendar_month" title="Disponibilidad">
                  <AvailabilityCalendar blockedRanges={blocked.data || []} selectedRange={selectedRange} />
                </Card>

                <Card icon="help" title="Cómo funciona el alquiler">
                  <ol className="grid gap-4 sm:grid-cols-2">
                    {HOW_IT_WORKS.map((step, index) => (
                      <li key={step.icon} className="flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
                          <Icon name={step.icon} className="text-lg" />
                        </span>
                        <p className="text-sm text-fg">
                          <span className="font-bold">{index + 1}.</span> {step.text}
                        </p>
                      </li>
                    ))}
                  </ol>
                </Card>
              </div>

              <aside id="solicitar" className="scroll-mt-24 lg:sticky lg:top-28 lg:self-start">
                <Card>
                  <p className="mb-4 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-primary-strong">{formatPrice(it.price_per_day)}</span>
                    <span className="text-fg-muted">/ día</span>
                  </p>
                  {it.is_active ? (
                    <ReservationRequestForm item={it} blockedDates={blocked.data || []} onDatesChange={setSelectedRange} />
                  ) : (
                    <p className="text-sm text-fg-muted">No disponible.</p>
                  )}
                </Card>
              </aside>
            </div>

            {/* Barra fija de acción en móvil (encima de la barra de pestañas) */}
            {it.is_active && !isOwner && <div aria-hidden="true" className="h-16 lg:hidden" />}
            {it.is_active && !isOwner && (
              <div className="fixed inset-x-0 bottom-[4.5rem] z-20 md:bottom-0 flex items-center justify-between gap-3 bg-surface px-4 py-3 shadow-[0_-4px_20px_-2px_rgb(0_0_0/0.08)] lg:hidden">
                <p className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-primary-strong">{formatPrice(it.price_per_day)}</span>
                  <span className="text-sm text-fg-muted">/ día</span>
                </p>
                <Button href="#solicitar" icon="event_available">
                  Solicitar alquiler
                </Button>
              </div>
            )}
          </>
        )
      }}
    </AsyncContent>
  )
}

export default ItemDetailPage
