# RentIt - Frontend

Frontend de RentIt, una web para alquilar objetos entre particulares. Proyecto del TFM.

Hecho con React 19, Vite, React Router, Tailwind CSS 4 y react-hook-form.

## Cómo arrancarlo

Hace falta tener el backend levantado en `http://localhost:3000`.

```bash
cp .env.template .env
npm install
npm run dev
```

La app queda en http://localhost:5173.

## Scripts

- `npm run dev`: servidor de desarrollo
- `npm run build`: build de producción en `dist/`
- `npm run preview`: sirve el build

## Docker

El `Dockerfile` hace el build con Node y sirve los estáticos con Caddy:

```bash
docker build --build-arg VITE_API_URL=/api/v1 -t rentit-frontend .
```

## Estructura

```
src/
  components/   componentes por módulo (ui, items, reservations, payments, contracts...)
  contexts/     sesión del usuario
  guards/       rutas privadas y de invitado
  hooks/        useFetch, useAction, useItem, useFavorites
  lib/          cliente de la API, constantes y utilidades
  pages/        una página por ruta
  services/     llamadas a la API agrupadas por módulo
  styles/       main.css con los colores y estilos
```

Los colores, fuentes y radios están definidos como variables en `src/styles/main.css`, así que para cambiar el aspecto de la app basta con tocar ese archivo.

## Funcionalidades

- Registro, login y perfil con dirección
- Publicar objetos con fotos, precio, fianza y fechas bloqueadas
- Buscar objetos y ver los que tienes cerca
- Favoritos (se guardan en el navegador)
- Reservas con contrato firmado por OTP, pago y fianza con Stripe
- Verificación con fotos en la entrega y la devolución
- Disputas y panel de administración