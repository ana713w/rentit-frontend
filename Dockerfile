FROM node:24-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG VITE_GOOGLE_MAPS_API_KEY
ARG VITE_MAX_RENTAL_DAYS=6
RUN npm run build

FROM caddy:2-alpine
COPY --from=build /app/dist /srv

