# RentIt — Frontend

Marketplace de alquiler de objetos entre particulares. *Compra menos, alquila más.*

Vite + React 19 + React Router 7 + Tailwind CSS 4 + react-hook-form + Stripe.

## Arrancar

```bash
cp .env.template .env      # rellena VITE_STRIPE_PUBLISHABLE_KEY
npm install
npm run dev                # http://localhost:5173 (proxy /api → http://localhost:3000)
```

Variables de `.env`:

| Variable | Para qué sirve |
| --- | --- |
| `VITE_API_URL` | Base de la API (`/api/v1` detrás de Caddy en producción) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clave publicable de Stripe para el pago con tarjeta |
| `VITE_GOOGLE_MAPS_API_KEY` | Autocompletado de direcciones y geocodificación inversa. Activa *Maps JavaScript API*, *Places API (New)* y *Geocoding API* y restringe la clave a tus dominios. Opcional: sin ella la dirección se escribe a mano |
| `VITE_MAX_RENTAL_DAYS` | Duración máxima de un alquiler (6 por defecto, igual que el backend) |

El backend tiene que estar en `http://localhost:3000`. Para que los pagos cambien de estado en local:
`stripe listen --forward-to localhost:3000/api/v1/payments/webhook`.

## Estilos: todo en `src/styles/main.css`

El sistema de diseño (pantallas de Google Stitch) está en [`docs/design/DESIGN.md`](docs/design/DESIGN.md).
Colores, tipografía, radios, sombras y ancho de página son **tokens** en el bloque `@theme` de
`src/styles/main.css`. Tailwind genera las clases a partir de ellos:

| Token | Clase que genera | Uso |
| --- | --- | --- |
| `--color-primary` | `bg-primary`, `text-primary`... | Turquesa del logo: botones, chips activos, iconos |
| `--color-primary-strong` | `text-primary-strong` | Texto/enlaces turquesa sobre blanco (contraste AA) |
| `--color-primary-soft` | `bg-primary-soft` | Fondos suaves de iconos y badges |
| `--color-canvas`, `--color-surface` | `bg-canvas`, `bg-surface` | Fondo cálido de página / tarjetas blancas |
| `--color-fg`, `--color-fg-muted` | `text-fg`, `text-fg-muted` | Texto principal / secundario |
| `--color-line` | `border-line` | Separadores |
| `--font-sans`, `--font-heading` | `font-sans`, `font-heading` | Plus Jakarta Sans |
| `--radius-control` | `rounded-control` | Píldora: botones, chips, badges |
| `--radius-input` | `rounded-input` | Inputs y cajas internas |
| `--radius-card` | `rounded-card` | Tarjetas y modales |
| `--shadow-card`, `--shadow-card-hover`, `--shadow-primary` | `shadow-card`... | Sombra ambiental, hover de tarjeta, brillo turquesa |
| `--container-page` | `max-w-page` | 1280 px |

Reglas:

- **Para cambiar el aspecto de la app, edita solo `main.css`.** Nada más.
- La paleta por defecto de Tailwind está desactivada (`--color-*: initial`): `bg-blue-500` no existe.
  Si necesitas un color nuevo, créalo como token.
- Los componentes usan nombres semánticos (`tone="success"`, `variant="danger"`), nunca colores.
- Iconos: `<Icon name="favorite" filled />` (Material Symbols Outlined, cargada en `main.css`).
- Sin bordes en tarjetas: la profundidad sale de poner `bg-surface` + `shadow-card` sobre `bg-canvas`.
- El `CardElement` de Stripe también lee los tokens (`lib/stripe.js`).

> **Contraste**: texto blanco sobre `#0acad9` da ~2:1. Los botones primarios usan negrita, pero para
> texto normal turquesa sobre blanco usa siempre `text-primary-strong`, nunca `text-primary`.

## Estructura

```
src/
├── main.jsx                 # Router + AuthProvider + App
├── App.jsx                  # todas las rutas
├── styles/main.css          # ← tokens de diseño (el único sitio con colores y fuentes)
├── components/
│   ├── ui/                  # piezas genéricas sin lógica de negocio
│   │   ├── button, card, badge (StatusBadge), chip, alert, modal, confirm-button, tabs, icon
│   │   ├── form/            # Input, Textarea, Select, Checkbox, DateRangeFields
│   │   ├── async-content    # loading / error / vacío de un useFetch
│   │   ├── file-uploader, photo-grid, image-gallery, detail-list, empty-state...
│   │   └── navbar, bottom-nav, user-menu, logo, footer, page-header, loading-screen, spinner
│   ├── layouts/             # PageLayout (cabecera + barra inferior en móvil), ScrollToTop
│   ├── users/               # LoginForm, RegisterForm, ProfileForm
│   ├── items/               # ItemCard/List/Form, ItemImagesManager, CategoryPicker, FavoriteButton,
│   │                        # BlockedDatesManager, AvailabilityCalendar, ReservationRequestForm
│   ├── reservations/        # ReservationCard/List, ReservationActions, ReservationTimeline
│   ├── contracts/           # ContractsSection, ContractCard (firma con OTP)
│   ├── verifications/       # VerificationsSection, VerificationCard (notas + fotos)
│   ├── payments/            # PaymentSection, StripePaymentForm, DepositActions, StripeOnboardingCard
│   └── disputes/            # DisputesSection, DisputeCard, DisputeForm, ResolveDisputeForm
├── contexts/                # AuthContext (GET /auth/me al arrancar)
├── guards/                  # PrivateRoute (sesión / admin), GuestRoute
├── hooks/                   # useFetch, useAction, useItem, usePrimaryImage, useFavorites
├── lib/                     # api, format, constants (ITEM_CATEGORIES, estados), mappers, form-errors, stripe
├── services/                # una función por endpoint, agrupadas por dominio
└── pages/                   # una página por ruta
```

## Piezas clave

- **`lib/api.js`**: cliente único con `credentials: 'include'`. Devuelve `null` en los 204 y lanza
  `ApiError { status, message, details }`. Cualquier 401 cierra la sesión en el frontend y los guards
  redirigen al login.
- **`lib/form-errors.js` → `applyServerErrors`**: pinta el `details` de los 400 bajo cada input.
- **`hooks/useFetch`**: `{ data, loading, error, reload, mutate }`. Combínalo con `<AsyncContent>`.
- **`hooks/useAction`**: estado de carga y error para acciones (aceptar, pagar, generar...).
- **`lib/constants.js`**: categorías de objeto (valor + etiqueta + icono), navegación y etiqueta/tono
  de cada estado (reserva, pago, depósito, disputa).

## Rutas

| Ruta | Página | Acceso |
| --- | --- | --- |
| `/` (`?q=&category=`) | Inicio: buscador, categorías, cuadrícula | público |
| `/items/:id` | Detalle del objeto | público |
| `/favorites` | Favoritos (guardados en el navegador) | público |
| `/login`, `/register` | Acceso | solo sin sesión |
| `/items/new`, `/items/:id/edit` | Subir / editar objeto | sesión (editar: solo dueño) |
| `/my-items` | Mis objetos | sesión |
| `/reservations` (`?as=owner`), `/reservations/:id` | Reservas / detalle con línea de tiempo | sesión |
| `/profile` | Perfil, dirección, cobros (Stripe) | sesión |
| `/stripe/onboarding/complete`, `/stripe/onboarding/refresh` | Vuelta de Stripe | sesión |
| `/admin/disputes`, `/admin/promote` | Admin | admin |

## API: objetos (`/items`)

El backend alquila **objetos**, no inmuebles. Resumen de lo que usa el frontend:

- `GET/POST /items`, `GET/PATCH/DELETE /items/:id`, `/items/:id/images`, `/items/:id/blocked-dates`.
- `POST /items` → `{ title, description, pricePerDay, depositAmount, category }`. La fianza tiene que
  estar **entre 3 y 365 veces** el precio por día (se valida también en `ItemForm`).
- `POST /reservations` → `{ itemId, startDate, endDate }`; las respuestas traen `item_id`.
- La dirección vive en el **usuario** (`address`, `latitude`, `longitude` en `POST /auth/register` y
  `PATCH /auth/me`). **Sin dirección en el perfil, `POST /items` devuelve 400**: la página de subir objeto
  lo detecta y manda al perfil antes de mostrar el formulario.
- `PATCH /auth/me` no devuelve `isAdmin`: tras guardar el perfil se recarga la sesión con `GET /auth/me`.

## Decisiones y limitaciones conocidas

- **Búsqueda y filtros en el cliente**: `GET /items` no admite parámetros. Se filtra por texto,
  categoría y precio máximo en el navegador. Si crece, añadir `?q=&category=&maxPrice=` al backend.
- **Sin distancia / "Cerca de ti"**: `GET /items` no trae las coordenadas del dueño. Las tarjetas muestran
  la categoría en su lugar.
- **Favoritos en `localStorage`**: la API no los tiene; solo valen para ese navegador.
- **Chat, valoraciones y avatares**: no existen en la API, así que no aparecen en la interfaz (el avatar
  usa las iniciales del nombre).
- **Foto principal en las tarjetas**: `usePrimaryImage` hace una petición por tarjeta. Si se nota lento,
  incluir `primary_image_url` en `GET /items`.
- **Mis objetos** filtra `GET /items` por `owner_id`, así que los objetos retirados no aparecen.
- **Línea de tiempo** de la reserva: se calcula con el estado de la reserva, los contratos, el pago y las
  verificaciones; "Finalizada" = check-out hecho y fianza liberada/capturada.
