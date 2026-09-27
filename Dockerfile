FROM node:24-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY
RUN npm run build

FROM caddy:2-alpine
COPY --from=build /app/dist /srv

