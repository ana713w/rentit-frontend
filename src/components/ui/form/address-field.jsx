import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../../../lib/cn'
import {
  getCurrentPosition,
  hasGoogleMaps,
  newSessionToken,
  resolvePlace,
  reverseGeocode,
  searchAddresses,
} from '../../../lib/google-maps'
import Spinner from '../spinner/spinner'
import Icon from '../icon/icon'
import Field from './field'
import { controlClasses } from './control-classes'

const EMPTY = { address: '', latitude: null, longitude: null }
const hasCoords = (value) => value?.latitude != null && value?.longitude != null

/**
 * Dirección con autocompletado de Google y botón «Usar mi ubicación».
 * value / onChange: { address, latitude, longitude } — las coordenadas no se muestran,
 * se rellenan al elegir una sugerencia o al usar la ubicación del dispositivo.
 *   <Controller name="location" control={control} render={({ field }) => <AddressField {...field} />} />
 */
function AddressField({ label, hint, error, required, placeholder = 'Calle, número y ciudad', value, onChange, name }) {
  const inputId = useId()
  const listId = useId()
  const current = value || EMPTY
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [locating, setLocating] = useState(false)
  const [localError, setLocalError] = useState(null)
  const tokenRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const search = (text) => {
    clearTimeout(timerRef.current)
    if (!hasGoogleMaps || text.trim().length < 3) {
      setSuggestions([])
      return
    }
    timerRef.current = setTimeout(async () => {
      try {
        tokenRef.current ||= await newSessionToken()
        const results = await searchAddresses(text, tokenRef.current)
        setSuggestions(results)
        setActive(-1)
        setOpen(true)
      } catch (err) {
        setLocalError(err)
      }
    }, 300)
  }

  const handleType = (event) => {
    const address = event.target.value
    // Al escribir a mano la ubicación anterior deja de ser válida
    onChange({ address, latitude: null, longitude: null })
    setLocalError(null)
    search(address)
  }

  const choose = async (suggestion) => {
    setOpen(false)
    setSuggestions([])
    try {
      onChange(await resolvePlace(suggestion.prediction))
    } catch (err) {
      setLocalError(err)
    } finally {
      tokenRef.current = null
    }
  }

  const useMyLocation = async () => {
    setLocating(true)
    setLocalError(null)
    try {
      const coords = await getCurrentPosition()
      const address = hasGoogleMaps ? await reverseGeocode(coords.latitude, coords.longitude) : null
      onChange({ address: address || current.address, ...coords })
    } catch (err) {
      setLocalError(err)
    } finally {
      setLocating(false)
    }
  }

  const handleKeyDown = (event) => {
    if (!open || !suggestions.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((i) => (i + 1) % suggestions.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (event.key === 'Enter' && active >= 0) {
      event.preventDefault()
      choose(suggestions[active])
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const status = hasCoords(current)
    ? 'Ubicación guardada: se usará para mostrar tus objetos a quien esté cerca.'
    : hasGoogleMaps && current.address
      ? 'Elige una dirección de la lista o pulsa «Usar mi ubicación» para guardar la ubicación.'
      : null

  return (
    <Field label={label} htmlFor={inputId} hint={status || hint} error={error || localError?.message} required={required}>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-invalid={Boolean(error)}
          autoComplete="off"
          placeholder={placeholder}
          value={current.address}
          onChange={handleType}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className={cn(controlClasses(error), 'h-11 pr-40')}
        />
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="absolute top-1/2 right-1.5 flex h-8 -translate-y-1/2 items-center gap-1 rounded-control bg-primary-soft px-3 text-xs font-bold text-primary-strong transition-colors hover:bg-primary-soft/70 disabled:opacity-60"
        >
          {locating ? <Spinner size="sm" /> : <Icon name="my_location" className="text-base" />}
          Usar mi ubicación
        </button>
        {hasCoords(current) && (
          <Icon name="check_circle" filled label="Ubicación guardada" className="absolute top-1/2 right-40 -translate-y-1/2 text-lg text-success" />
        )}
        {open && suggestions.length > 0 && (
          <ul
            id={listId}
            role="listbox"
            className="absolute inset-x-0 top-12 z-30 max-h-64 overflow-y-auto rounded-input bg-surface py-1 shadow-raised"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                role="option"
                aria-selected={index === active}
                onMouseDown={(event) => {
                  event.preventDefault()
                  choose(suggestion)
                }}
                className={cn(
                  'flex cursor-pointer items-center gap-2 px-3.5 py-2.5 text-sm text-fg',
                  index === active ? 'bg-primary-soft' : 'hover:bg-surface-muted',
                )}
              >
                <Icon name="location_on" className="text-lg text-fg-muted" />
                {suggestion.text}
              </li>
            ))}
            <li className="px-3.5 pt-1 pb-1.5 text-right text-[10px] text-fg-subtle">Con la tecnología de Google</li>
          </ul>
        )}
      </div>
    </Field>
  )
}

export default AddressField
