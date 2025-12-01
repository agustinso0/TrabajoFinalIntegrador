# Trabajo Final Integrador — Inicio rápido

Guía ágil para levantar el backend, frontend y base de datos en local.

## Requisitos
- Docker Desktop instalado y corriendo.
- Puertos libres: `3001` (API), `5173` (Frontend), `27017` (MongoDB).

## Levantar todo con Docker Compose

Desde `./TrabajoFinalIntegrador`:

```bash
docker compose up -d
```

Servicios y accesos:
- Backend: `http://localhost:3001` (Health: `http://localhost:3001/health`).
- Frontend: `http://localhost:5173`.
- MongoDB: `localhost:27017`.

Variables de entorno usadas por defecto (templates):
- Backend: `server/.env.example` (incluye `MONGODB_URI`, `JWT_SECRET`, `API_KEY`, `FRONTEND_URL`, etc.).
- Frontend: `client/.env.example` (incluye `VITE_API_URL`).

Personalizar variables:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edita los valores en .env según necesidad
```

Detener y limpiar:
```bash
docker compose down
```

Ver logs:
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo
```

## Levantar sin Docker (desarrollo clásico)

Backend:
```bash
cd server
npm install
npm run dev
# API en http://localhost:3001
```

Frontend:
```bash
cd client
npm install
npm run dev
# App en http://localhost:5173
```

## Pruebas
- Backend (Jest E2E):
```bash
cd server
npm run test:e2e
# opcional: modo detallado
npm run test:e2e -- --verbose
```

- Frontend (Vitest):
```bash
cd client && npm test
```

## Comandos útiles

### Docker Compose
- Levantar: `docker compose up -d`
- Ver logs backend: `docker compose logs -f backend`
- Ver logs frontend: `docker compose logs -f frontend`
- Ver logs mongo: `docker compose logs -f mongo`
- Reiniciar servicios: `docker compose restart`
- Apagar y limpiar: `docker compose down`

### Backend (server)
- Instalar dependencias: `cd server && npm install`
- Desarrollo (hot-reload): `npm run dev`
- Compilar TypeScript: `npm run build`
- Ejecutar compilado: `npm run start`
- Tests: `npm test` | `npm run test:watch` | `npm run test:e2e`
- Migraciones:
  - Ejecutar migraciones: `npm run migrate`
  - Seed datos de desarrollo: `npm run migrate:seed`
  - Limpiar datos: `npm run migrate:clean`
  - Reset completo: `npm run migrate:reset`

### Frontend (client)
- Instalar dependencias: `cd client && npm install`
- Desarrollo: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Preview de build: `npm run preview`

### Verificación rápida
- Health API: `curl http://localhost:3001/health`
- E2E: `cd server && npm run test:e2e`

## Troubleshooting
- Docker no arranca: abrir Docker Desktop y reintentar `docker compose up -d`.
- CORS bloqueado: ajustar `FRONTEND_URL` en `server/.env(.example)`.
- API Key: enviar `X-API-Key` con el valor configurado (por defecto `local_dev_api_key`).
- MongoDB conexión: `MONGODB_URI` debe apuntar a `mongodb://mongo:27017/tfi_local` en Compose.

## Estructura
```
TrabajoFinalIntegrador/
  docker-compose.yml
  README.md
  server/
    .env.example
    src/
  client/
    .env.example
    src/
```

