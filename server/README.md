# Backend – Sistema de Gestión de Transporte de Pasajeros (Puerta a Puerta)

Backend Node.js/Express con TypeScript y MongoDB para gestionar rutas programadas, instancias de viaje, reservas y pagos. Cada empresa opera su propia instancia aislada (código compartido, despliegues independientes) con su propia base de datos y credenciales.

- Runtime: Node.js (ESM) + TypeScript
- Framework: Express
- DB: MongoDB (Mongoose)
- Seguridad: Helmet, CORS, JWT, API Key, Rate limiting, sanitización básica, prevención de NoSQL injection
- Documentación: Swagger UI (OpenAPI 3)


## Estructura

```
server/
├─ src/
│  ├─ config/
│  │  ├─ database.ts        # Conexión a MongoDB
│  │  ├─ security.ts        # CORS y patrones de validación
│  │  └─ swagger.ts         # Especificación OpenAPI
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
Swagger UI: GET /api-docs


## Requisitos previos

- Node.js 18+
- MongoDB (local o administrado – URI por .env)


## Configuración de entorno (.env)

Crear un archivo .env en server/ con al menos:

```
# Puerto
PORT=3001

# Base de datos
MONGODB_URI=mongodb://<usuario>:<password>@<host>:<puerto>/<db>?authSource=admin

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
- API_KEY se exige para todas las rutas bajo /api (ver middleware apiKey).
- FRONTEND_URL se utiliza en la whitelist de CORS.


## Instalación y scripts

Desde server/:

```bash
npm install
```

Scripts definidos en package.json:
- npm run dev: arranca en desarrollo con nodemon + ts-node (hot reload)
- npm run start: ejecuta JavaScript compilado (dist/index.js)
- npm run build: compila TypeScript a dist/
- npm run migrate: compila y ejecuta el orquestador de migraciones (dist/database/migrate.js)
- npm test: (placeholder) jest

Flujo sugerido (desarrollo):
1) Crear .env
2) npm install
3) npm run dev
4) Abrir Swagger en http://localhost:3001/api-docs

Para producción:
1) npm ci
2) npm run build
3) npm run migrate (si aplica)
4) npm run start


## Documentación de API (Swagger)

- Swagger UI: http://localhost:3001/api-docs
- Base URL en dev: http://localhost:3001/api/v1
- Autenticación soportada en Swagger:
  - Bearer JWT (Authorization: Bearer <token>)
  - API Key por header x-api-key

La especificación se genera con swagger-jsdoc a partir de:
- ./src/routes/*.ts
- ./src/controllers/*.ts
- ./src/models/*.ts


## Seguridad y middleware

En src/index.ts se configuran:
- Helmet con CSP básica
- CORS con whitelist (config/security.ts)
- Rate limiting global (middlewares/security.generalLimiter)
- Sanitización de body y query + prevención de operadores peligrosos (preventNoSQLInjection)
- API Key obligatoria para rutas /api/* (middlewares/apiKey)
- Manejo de errores centralizado y 404 (middlewares/errorHandler)

Recomendaciones:
- Rotar JWT_SECRET y API_KEY por instancia
- Usar HTTPS en despliegues
- Limitar orígenes CORS a dominios propios por instancia


## Modelo de aislamiento por instancia (multi-tenant por despliegue)

- Cada empresa/tenant se despliega como una instancia independiente con su propio .env, MONGODB_URI (base de datos dedicada), credenciales de pago y FRONTEND_URL.
- No se comparte base de datos entre empresas, garantizando aislamiento de datos y simplificando cumplimiento.
- COMPANY_NAME se usa en logs/health para identificar la instancia.

Estrategia de despliegue típica:
- Un repositorio de código compartido.
- Un pipeline por empresa que inyecta su .env/secretos y hace deploy de su contenedor/VM.
- Backups y monitoreo por base de datos/instancia.


## Endpoints principales

- Autenticación (/auth): login/registro y emisión de JWT.
- Rutas (/routes): consulta de rutas programadas y sus instancias.
- Reservas (/reservations): creación y gestión de reservas.
- Pagos (/payments): integración con MercadoPago, estados de pago.
- Administración (/admin): administración de catálogos y operaciones.
- Configuración (/config): CompanyConfigService para inicialización y lectura pública.

Todos requieren header x-api-key. Endpoints protegidos requieren Bearer JWT.


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


## Pagos

- Integración con MercadoPago (mercadopago@^2). Añadir a .env las credenciales de cada empresa (ACCESS_TOKEN, PUBLIC_KEY) y mapearlas en la capa de configuración/servicio de pagos.

Variables típicas (ejemplo):
```
MP_ACCESS_TOKEN=xxxx
MP_PUBLIC_KEY=xxxx
```


## Desarrollo seguro y calidad

- Validaciones con express-validator donde aplique
- Lint/format: (puede integrarse según preferencias del repo)
- Tests: jest (pendiente de definición)


## Troubleshooting

- Error MONGODB_URI no encontrada en .env: definir variable y reiniciar.
- CORS: ajustar FRONTEND_URL; Postman/Insomnia funcionan sin origin.
- API Key: enviar header x-api-key con el valor configurado en .env.
- 401/403: verificar token JWT en Authorization y roles/permisos si aplica.
- Swagger vacío: revisar rutas/controllers/models y patrón en swagger.ts.


## Licencia

MIT (ver encabezado de swagger.ts).