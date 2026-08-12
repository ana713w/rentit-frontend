import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFetch } from '../hooks'
import { listItems } from '../services'
import { getCategory } from '../lib/constants'
import { CategoryPicker, ItemList } from '../components/items'
import { AsyncContent, Button, Chip, EmptyState, Icon, Input } from '../components/ui'

const PAGE_SIZE = 12

const SORTS = {
  recent: { label: 'Más recientes', compare: (a, b) => new Date(b.created_at) - new Date(a.created_at) },
  cheap: { label: 'Precio más bajo', compare: (a, b) => Number(a.price_per_day) - Number(b.price_per_day) },
  expensive: { label: 'Precio más alto', compare: (a, b) => Number(b.price_per_day) - Number(a.price_per_day) },
}

// GET /items no admite filtros todavía: se busca y filtra en el cliente
const normalize = (text) =>
  (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

function matches(item, { q, category, maxPrice }) {
  if (category && item.category !== category) return false
  if (maxPrice && Number(item.price_per_day) > Number(maxPrice)) return false
  if (!q) return true
  const query = normalize(q)
  return [item.title, item.description, getCategory(item.category).label].some((field) => normalize(field).includes(query))
}

function SearchHero({ q, maxPrice, onSearch, onMaxPriceChange }) {
  const [query, setQuery] = useState(q)
  const [filtersOpen, setFiltersOpen] = useState(Boolean(maxPrice))

  return (
    <section className="flex flex-col items-center pt-2 text-center">
      <h1 className="mb-6 text-3xl font-extrabold sm:text-4xl">
        Compra menos, <span className="text-primary">alquila más.</span>
      </h1>

      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
          onSearch(query.trim())
        }}
        className="flex w-full max-w-3xl items-center gap-2 rounded-control bg-surface p-2 shadow-[0_8px_30px_rgb(0_0_0/0.06)]"
      >
        <label className="flex min-w-0 flex-1 items-center gap-2 pl-3">
          <Icon name="search" className="text-2xl text-primary" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar en RentIt (taladro, bicicleta, cámara, tienda de campaña...)"
            aria-label="Buscar objetos"
            className="w-full min-w-0 bg-transparent text-sm text-fg placeholder:text-fg-muted focus:outline-none"
          />
        </label>
        <button
          type="button"
          aria-label="Filtros avanzados"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((open) => !open)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-fg transition-colors hover:bg-surface-strong"
        >
          <Icon name="tune" className="text-xl" />
        </button>
        <Button type="submit" className="size-10 px-0 md:w-auto md:px-6" aria-label="Buscar">
          <Icon name="arrow_forward" className="text-xl" />
          <span className="hidden md:inline">Buscar</span>
        </Button>
      </form>

      {filtersOpen && (
        <div className="mt-3 flex w-full max-w-3xl flex-wrap items-end gap-3 rounded-card bg-surface p-4 text-left shadow-card">
          <Input
            label="Precio máximo por día (€)"
            type="number"
            min="0"
            step="1"
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.value)}
            className="w-full sm:w-60"
          />
          {maxPrice && (
            <Button variant="ghost" size="sm" onClick={() => onMaxPriceChange('')}>
              Quitar filtro
            </Button>
          )}
        </div>
      )}
    </section>
  )
}

function PromoBanner() {
  return (
    <section className="relative overflow-hidden rounded-card bg-gradient-to-r from-primary via-primary to-primary-strong p-6 text-on-primary shadow-raised md:p-8">
      <div className="pointer-events-none absolute -right-8 -bottom-10 size-64 rounded-full bg-white/10 blur-xl" />
      <div className="pointer-events-none absolute top-0 right-32 size-32 rounded-full bg-white/10 blur-lg" />
      <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex max-w-2xl items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Icon name="bolt" className="text-3xl" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-extrabold text-on-primary">¿Tienes cosas sin usar en casa? Gana dinero alquilándolas</h2>
            <p className="text-sm text-on-primary/90">
              Publica en 2 minutos. Tú decides el precio, la fianza y qué días está disponible.
            </p>
          </div>
        </div>
        <Button
          to="/items/new"
          size="lg"
          variant="secondary"
          icon="add_circle"
          className="w-full text-primary-strong hover:-translate-y-0.5 hover:text-primary-strong md:w-auto"
        >
          Subir objeto
        </Button>
      </div>
    </section>
  )
}

function HomePage() {
  const { data: items, loading, error, reload } = useFetch(listItems, [])
  // Búsqueda y categoría van en la URL para que el buscador de la cabecera y el botón atrás funcionen
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('recent')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: key === 'category' })
    setVisibleCount(PAGE_SIZE)
  }

  const filtered = (items || []).filter((item) => matches(item, { q, category, maxPrice })).sort(SORTS[sort].compare)
  const visible = filtered.slice(0, visibleCount)
  const hasFilters = Boolean(q || category || maxPrice)

  return (
    <div className="flex flex-col gap-8">
      <SearchHero
        key={q}
        q={q}
        maxPrice={maxPrice}
        onSearch={(value) => setParam('q', value)}
        onMaxPriceChange={setMaxPrice}
      />

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">Categorías populares</h2>
        <CategoryPicker value={category} onChange={(value) => setParam('category', value)} />
      </section>

      <PromoBanner />

      <section className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                {category ? getCategory(category).label : q ? 'Resultados' : 'Disponibles para alquilar'}
              </h2>
              {items && (
                <span className="rounded-control bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary-strong">
                  {filtered.length} {filtered.length === 1 ? 'objeto' : 'objetos'}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-fg-muted">
              {q ? `Buscando «${q}»` : 'Herramientas, deporte, tecnología y más, de gente como tú'}
            </p>
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none md:mx-0 md:px-0">
            {Object.entries(SORTS).map(([id, config]) => (
              <Chip key={id} active={sort === id} onClick={() => setSort(id)}>
                {config.label}
              </Chip>
            ))}
          </div>
        </div>

        <AsyncContent
          loading={loading}
          error={error}
          data={items}
          onRetry={reload}
          isEmpty={filtered.length === 0}
          empty={
            <EmptyState
              icon={hasFilters ? 'search_off' : 'inventory_2'}
              title={hasFilters ? 'Sin resultados' : 'Todavía no hay objetos'}
              description={hasFilters ? 'Prueba con otra búsqueda o quita los filtros.' : 'Sé el primero en publicar algo que no uses.'}
              action={
                hasFilters ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setMaxPrice('')
                      setSearchParams({})
                    }}
                  >
                    Quitar filtros
                  </Button>
                ) : (
                  <Button to="/items/new" icon="add">
                    Subir objeto
                  </Button>
                )
              }
            />
          }
        >
          <ItemList items={visible} />
          {filtered.length > visibleCount && (
            <div className="flex justify-center pt-2">
              <Button variant="secondary" size="lg" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                Ver más objetos ({filtered.length - visibleCount})
                <Icon name="expand_more" className="text-xl text-primary-strong" />
              </Button>
            </div>
          )}
        </AsyncContent>
      </section>
    </div>
  )
}

export default HomePage
