// Autocompletado y geocodificacion con Google Maps
// sin VITE_GOOGLE_MAPS_API_KEY la direccion se escribe a mano
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const CALLBACK = '__rentitGoogleMapsReady'

export const hasGoogleMaps = Boolean(API_KEY)

let loading = null

export function loadGoogleMaps() {
  if (!API_KEY) return Promise.reject(new Error('Falta VITE_GOOGLE_MAPS_API_KEY'))
  if (window.google?.maps?.importLibrary) return Promise.resolve(window.google.maps)
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      window[CALLBACK] = () => resolve(window.google.maps)
      const script = document.createElement('script')
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(API_KEY)}` +
        `&v=weekly&loading=async&language=es&region=ES&callback=${CALLBACK}`
      script.async = true
      script.onerror = () => {
        loading = null
        reject(new Error('No se pudo cargar Google Maps'))
      }
      document.head.appendChild(script)
    })
  }
  return loading
}

const round6 = (value) => Math.round(value * 1e6) / 1e6

// un token por sesion de busqueda
export async function newSessionToken() {
  const maps = await loadGoogleMaps()
  const { AutocompleteSessionToken } = await maps.importLibrary('places')
  return new AutocompleteSessionToken()
}

export async function searchAddresses(input, sessionToken) {
  const maps = await loadGoogleMaps()
  const { AutocompleteSuggestion } = await maps.importLibrary('places')
  const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
    input,
    sessionToken,
    includedRegionCodes: ['es'],
    language: 'es',
  })
  return suggestions
    .filter((suggestion) => suggestion.placePrediction)
    .map(({ placePrediction }) => ({
      id: placePrediction.placeId,
      text: placePrediction.text.toString(),
      prediction: placePrediction,
    }))
}

// Direccion y coordenadas de la sugerencia
export async function resolvePlace(prediction) {
  const place = prediction.toPlace()
  await place.fetchFields({ fields: ['formattedAddress', 'location'] })
  return {
    address: place.formattedAddress,
    latitude: round6(place.location.lat()),
    longitude: round6(place.location.lng()),
  }
}

export async function reverseGeocode(latitude, longitude) {
  const maps = await loadGoogleMaps()
  const { Geocoder } = await maps.importLibrary('geocoding')
  const { results } = await new Geocoder().geocode({ location: { lat: latitude, lng: longitude } })
  return results[0]?.formatted_address || null
}

// Posicion del dispositivo
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Tu navegador no permite obtener la ubicación.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: round6(coords.latitude), longitude: round6(coords.longitude) }),
      () => reject(new Error('No se pudo obtener tu ubicación. Revisa los permisos del navegador.')),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  })
}

export const directionsUrl = (address) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
