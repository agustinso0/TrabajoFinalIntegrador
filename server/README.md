# Backend — Sistema de Gestión de Transporte de Pasajeros

Backend Node.js/Express con TypeScript y MongoDB para gestionar rutas programadas, instancias de viaje, reservas y pagos.

## Inicio rápido

Con Docker Compose (recomendado):

```bash
cd TrabajoFinalIntegrador
docker compose up -d
```

Accesos:
- API: `http://localhost:3001`
- Health: `http://localhost:3001/health`

Variables (template): `server/.env.example` ya listo para entorno local.

- Runtime: Node.js (ESM) + TypeScript
- Framework: Express
- DB: MongoDB (Mongoose)
- Seguridad: Helmet, CORS, JWT, API Key, Rate limiting, sanitización básica, prevención de NoSQL injection
- Pruebas: Jest E2E para endpoints


## Estructura

```
server/
├─ src/
│  ├─ config/
│  │  ├─ database.ts        # Conexión a MongoDB
│  │  └─ security.ts        # CORS y patrones de validación
│  ├─ controllers/          # Lógica de endpoints (por dominio)
│  ├─ database/
│  │  ├─ migrations/        # Migraciones de colecciones/índices
│  │  ├─ seeders/           # Datos seed (dev/clean)
│  │  └─ migrate.ts         # Orquestador de migraciones
│  ├─ middlewares/          # Seguridad, validaciones, manejo de errores
│  ├─ models/               # Esquemas de Mongoose
│  ├─ routes/               # Definición de rutas Express
│  ├─ services/             # Servicios de dominio (e.g., CompanyConfig)
│  ├─ types/                # Tipos compartidos
│  ├─ utils/                # Helpers y logger
│  └─ index.ts              # Bootstrap del servidor
├─ Dockerfile               # Imagen backend
├─ package.json
└─ tsconfig.json
```

Rutas expuestas (prefijo /api/v1):
- /auth
- /routes
- /reservations
- /payments
- /admin
- /config

Health check: GET /health


## Requisitos

- Docker Desktop (para Compose) o Node.js 18+ (modo clásico)


## Configuración de entorno

Usar `server/.env.example` o duplicarlo como `.env`:

```
# Puerto
PORT=3001

# Base de datos (local Compose)
MONGODB_URI=mongodb://mongo:27017/tfi_local

# Seguridad
JWT_SECRET=una_clave_secreta_segura
API_KEY=clave_api_para_consumo

# CORS / Frontend permitido
FRONTEND_URL=http://localhost:5173

# Identidad de la instancia/empresa
COMPANY_NAME=Mi Empresa de Transporte
```

Notas:
- MONGODB_URI es obligatorio; si falta, el proceso termina con error.
- API_KEY se exige para rutas bajo /api, excepto `/api/v1/auth/register` y `/api/v1/auth/login` que son públicas.
- FRONTEND_URL se utiliza en la whitelist de CORS.


## Scripts

Desde `server/`:
- `npm run dev`: arranca en desarrollo con nodemon + ts-node (hot reload)
- `npm run start`: ejecuta JavaScript compilado (dist/index.js)
- `npm run build`: compila TypeScript a dist/
- `npm run migrate`: compila y ejecuta el orquestador de migraciones (dist/database/migrate.js)
- `npm test`: ejecuta Jest
- `npm run test:e2e`: ejecuta pruebas end-to-end de todos los endpoints

Desarrollo clásico:
1) `npm install`
2) `npm run dev`

Para producción:
1) npm ci
2) npm run build
3) npm run migrate (si aplica)
4) npm run start


## Pruebas End-to-End (Jest)

- Ejecutar todas las pruebas E2E:
  ```bash
  cd server
  npm run test:e2e
  ```
- Modo detallado:
  ```bash
  npm run test:e2e -- --verbose
  ```
- Qué hace: levanta el servidor en puerto dinámico, usa MongoDB en memoria, prepara datos de demo y valida los endpoints principales (`/auth`, `/routes`, `/reservations`, `/payments`, `/admin`, `/config`). Los endpoints protegidos requieren `X-API-Key` y `Bearer JWT`, gestionados automáticamente por los tests.


## Seguridad

En src/index.ts se configuran:
- Helmet con CSP básica
- CORS con whitelist (config/security.ts)
- Rate limiting global (middlewares/security.generalLimiter)
- Sanitización de body y query + prevención de operadores peligrosos (preventNoSQLInjection)
- API Key obligatoria para rutas /api/* (middlewares/apiKey)
- Manejo de errores centralizado y 404 (middlewares/errorHandler)

Recomendaciones:
- Rotar `JWT_SECRET` y `API_KEY`.
- Usar HTTPS en despliegues.
- Ajustar `FRONTEND_URL` para CORS.



## Endpoints principales

- Autenticación (/auth): login/registro y emisión de JWT.
- Rutas (/routes): consulta de rutas programadas y sus instancias.
- Reservas (/reservations): creación y gestión de reservas.
- Pagos (/payments): integración con MercadoPago, estados de pago.
- Administración (/admin): administración de catálogos y operaciones.
- Configuración (/config): CompanyConfigService para inicialización y lectura pública.

Todos requieren header `X-API-Key`. Endpoints protegidos requieren `Bearer JWT`.


## Base de datos

- ODM: Mongoose
- Esquemas en src/models: User, Vehicle, ScheduledRoute, RouteInstance, Reservation, Payment, CompanyConfig
- Migraciones/seeders en src/database/

Migrar:
```bash
npm run migrate
```

Seed (si aplica): revisar seeders/ y orquestador migrate.ts para entorno local.


## Logs y salud

- Logger simple en utils/logger.ts (si se usa) y securityLogger para auditoría básica de requests.
- GET /health devuelve estado, timestamp, nombre de empresa y versión.


## Docker (backend)

Existe un Dockerfile en server/ para construir la imagen:

Ejemplo de build y run:
```bash
# desde la carpeta raíz del repo
docker build -f TrabajoFinalIntegrador/server/Dockerfile -t transporte-backend:latest .

# ejecutar con .env específico de la instancia
docker run --env-file TrabajoFinalIntegrador/server/.env -p 3001:3001 transporte-backend:latest
```

Asegurar variables en runtime: MONGODB_URI, JWT_SECRET, API_KEY, FRONTEND_URL, COMPANY_NAME, y credenciales de pago.

## Docker Compose (local)

Ubicación del archivo: `TrabajoFinalIntegrador/docker-compose.yml`.

Pasos:

1) Opcional: duplicar `server/.env.example` a `server/.env` y ajustar valores.

2) Levantar todo desde la raíz del proyecto:

```bash
docker compose up -d
```

Servicios:
- Backend: `http://localhost:3001` (health en `/health`).
- Frontend: `http://localhost:5173`.
- MongoDB: `localhost:27017`.

La configuración por defecto en `server/.env.example` apunta a `mongodb://mongo:27017/tfi_local` y permite CORS desde `http://localhost:5173`.


## Pagos

- Integración con MercadoPago . Añadir a .env las credenciales de cada empresa (ACCESS_TOKEN, PUBLIC_KEY) y mapearlas en la capa de configuración/servicio de pagos.

Variables típicas (ejemplo):
```
MP_ACCESS_TOKEN=xxxx
MP_PUBLIC_KEY=xxxx
```


## Desarrollo seguro y calidad

- Validaciones con express-validator donde aplique
- Lint/format: (puede integrarse según preferencias del repo)
- Tests: Jest E2E y unitarios (si aplica)


## Troubleshooting

- Error MONGODB_URI no encontrada en .env: definir variable y reiniciar.
- CORS: ajustar FRONTEND_URL; Postman/Insomnia funcionan sin origin.
- API Key: enviar header `X-API-Key` con el valor configurado en `.env`.
- 401/403: verificar token JWT en Authorization y roles/permisos si aplica.

