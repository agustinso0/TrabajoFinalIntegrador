# 🐳 Guía de Despliegue Docker: Aplicación de Transporte (Instancia Dedicada)

Esta guía documenta el uso de **Docker Compose** para orquestar la pila Full-Stack (Frontend, Backend, DB) de la aplicación de transporte bajo el modelo de **Instancia Dedicada por Empresa**.

---

## 1. Configuración del Entorno: El Archivo `.env`

Antes de iniciar Docker, crea un archivo llamado **`.env`** en la **raíz del proyecto** (`/TrabajoFinalIntegrador`) para definir la configuración específica de esta instancia de empresa.

| Variable | Propósito |
| :--- | :--- |
| `PROJECT_NAME` | **CRÍTICO:** Prefijo único para nombrar los contenedores de esta empresa (Ej: `empresa_alfa`). |
| `MONGODB_URI_EMPRESA` | URI de conexión a MongoDB Atlas (Producción real). |
| `API_KEY_SECRET` | Clave secreta para la seguridad interna del Backend. |
| `MP_ACCESS_TOKEN_EMPRESA` | Credenciales de Mercado Pago. |

---

## 2. Comandos de Docker (Uso de Perfiles)

El archivo `docker-compose.yml` utiliza **Perfiles** (`dev` y `prod`) para diferenciar la configuración de ejecución. Todos los comandos deben ejecutarse desde la **raíz del proyecto**.

### 2.1 Entorno de Desarrollo (`dev`) 🛠️

Este perfil es para **codificar y depurar**. Activa volúmenes para el *Hot Reload* (nodemon/Vite) y levanta la base de datos local de MongoDB.

| Componente | Acceso Local | Propósito Principal |
| :--- | :--- | :--- |
| **Frontend** (Vite) | `http://localhost:5173` | Recarga en tiempo real (*HMR*). |
| **Backend** (Express) | `http://localhost:3001` | Recarga automática (nodemon). |
| **Database** (Mongo) | Puerto `27017` | Persistencia de datos local para pruebas. |

**Comando de Inicio (Desarrollo):**

```bash
docker compose --profile dev up --build -d
```

**Verificar Estado de los Contenedores:**

```bash
docker compose ps
```

**Ver Logs en Tiempo Real:**

```bash
# Todos los servicios
docker compose logs -f

# Solo frontend
docker compose logs -f frontend

# Solo backend  
docker compose logs -f backend
```

**Detener y Limpiar:**

```bash
# Detener servicios
docker compose --profile dev down

# Detener y eliminar volúmenes (⚠️ BORRA DATOS DE BD LOCAL)
docker compose --profile dev down -v
```

### 2.2 Entorno de Producción (`prod`) 🚀

Este perfil es para **despliegue en servidor**. Compila el código optimizado y usa configuraciones de producción.

| Componente | Acceso | Propósito Principal |
| :--- | :--- | :--- |
| **Frontend** (Nginx) | `http://localhost` | Archivos estáticos optimizados. |
| **Backend** (Express) | `http://localhost:3001` | API en modo producción. |
| **Database** | **Externa** | MongoDB Atlas (configurado vía `.env`). |

**Comando de Inicio (Producción):**

```bash
docker compose --profile prod up --build -d
```

**⚠️ Importante:** En producción, el frontend se sirve en el puerto 80 y el backend en 3001. La base de datos debe estar configurada externamente (MongoDB Atlas).

---

## 3. Estructura de Archivos Docker

### 3.1 Cliente (Frontend) - `client/Dockerfile`

**Stack Tecnológico:**
- **React 19.1.1** + **TypeScript**
- **Vite** (bundler y dev server)
- **Chakra UI** (componentes UI)
- **React Router Dom** (navegación)
- **Axios** (cliente HTTP)
- **Framer Motion** (animaciones)

**Proceso de Build Multi-Stage:**

1. **Etapa de Construcción:** Instala dependencias y compila con Vite
2. **Etapa de Producción:** Sirve archivos estáticos con Nginx Alpine

```dockerfile
# Build stage: Node.js 20.12.2 + Vite compilation
FROM node:20.12.2-slim AS build
# Production stage: Nginx Alpine (lightweight)
FROM nginx:alpine
```

### 3.2 Servidor (Backend) - `server/Dockerfile`

**Stack Tecnológico:**
- **Node.js 20.12.2** + **TypeScript**
- **Express.js** (framework web)
- **MongoDB** + **Mongoose** (ODM)
- **JWT** (autenticación)
- **bcryptjs** (hash de contraseñas)
- **MercadoPago SDK** (pagos)
- **ARCA Facturación** (facturación electrónica)

**Proceso de Build Multi-Stage:**

1. **Etapa de Construcción:** Compila TypeScript
2. **Etapa de Producción:** Runtime optimizado

```dockerfile
# Build stage: Compila TypeScript
FROM node:20.12.2-slim AS build
# Production stage: Solo runtime necesario
FROM node:20.12.2-slim
```

---

## 4. Variables de Entorno (`.env`)

Crea este archivo en la **raíz del proyecto** con la siguiente estructura:

```env
# CONFIGURACIÓN DE PROYECTO
PROJECT_NAME=empresa_ejemplo

# BASE DE DATOS
MONGODB_URI_EMPRESA=mongodb://localhost:27017/transporte_empresa
# Para producción usar MongoDB Atlas:
# MONGODB_URI_EMPRESA=mongodb+srv://usuario:password@cluster.mongodb.net/transporte_empresa

# SEGURIDAD
API_KEY_SECRET=tu_clave_secreta_super_segura_aqui
JWT_SECRET=otra_clave_secreta_para_jwt

# INTEGRACIÓN MERCADOPAGO
MP_ACCESS_TOKEN_EMPRESA=tu_access_token_de_mercadopago
MP_PUBLIC_KEY_EMPRESA=tu_public_key_de_mercadopago

# CONFIGURACIÓN ARCA (FACTURACIÓN)
ARCA_USERNAME=tu_usuario_arca
ARCA_PASSWORD=tu_password_arca
ARCA_CUIT=tu_cuit_empresa

# CONFIGURACIÓN DE PUERTOS (OPCIONAL)
BACKEND_PORT=3001
FRONTEND_PORT=5173
```

---

## 5. Comandos Útiles para el Equipo de Desarrollo

### 5.1 Comandos Básicos de Docker Compose

```bash
# Construir imágenes sin cache (fuerza rebuild completo)
docker compose build --no-cache

# Ejecutar solo un servicio específico
docker compose --profile dev up frontend
docker compose --profile dev up backend
docker compose --profile dev up database

# Acceder al contenedor para debugging
docker compose exec backend bash
docker compose exec frontend sh

# Ver uso de recursos
docker stats
```

### 5.2 Gestión de Base de Datos

```bash
# Conectar a MongoDB local desde línea de comandos
docker compose exec database mongosh

# Backup de base de datos local
docker compose exec database mongodump --db transporte_empresa --out /data/backup

# Restaurar backup
docker compose exec database mongorestore /data/backup
```

### 5.3 Debugging y Troubleshooting

```bash
# Ver logs específicos con timestamps
docker compose logs -f -t backend

# Inspeccionar configuración de servicios
docker compose config

# Ver todas las redes creadas
docker network ls

# Inspeccionar red del proyecto
docker network inspect trabajofinalintegrador_default

# Limpiar contenedores, redes y volúmenes no utilizados
docker system prune -a
```

---

## 6. Flujo de Trabajo Recomendado

### 6.1 Desarrollo Local

1. **Configurar entorno:**
   ```bash
   # Copiar archivo de ejemplo
   cp .env.example .env
   # Editar variables según tu configuración
   ```

2. **Iniciar servicios de desarrollo:**
   ```bash
   docker compose --profile dev up --build -d
   ```

3. **Desarrollar con hot reload:**
   - Frontend: `http://localhost:5173` (Vite HMR activo)
   - Backend: `http://localhost:3001` (Nodemon activo)
   - Base de datos: Puerto `27017`

4. **Ver logs en tiempo real:**
   ```bash
   docker compose logs -f
   ```

### 6.2 Testing y QA

```bash
# Ejecutar tests del frontend
docker compose exec frontend npm test

# Ejecutar tests del backend  
docker compose exec backend npm test

# Verificar linting
docker compose exec frontend npm run lint
```

### 6.3 Despliegue a Producción

1. **Verificar variables de producción en `.env`**
2. **Construir y desplegar:**
   ```bash
   docker compose --profile prod up --build -d
   ```
3. **Verificar health checks:**
   ```bash
   curl http://localhost/health
   curl http://localhost:3001/api/v1/health
   ```

---

## 7. Consideraciones de Seguridad

### 7.1 Variables Sensibles

- **NUNCA** commitear el archivo `.env` al repositorio
- Usar **Secrets** de Docker Swarm o Kubernetes en producción
- Rotar credenciales periódicamente

### 7.2 Red Docker

- Los servicios se comunican a través de la red interna `trabajofinalintegrador_default`
- Solo los puertos necesarios están expuestos al host
- Comunicación backend-frontend usa nombres de servicios Docker

### 7.3 Volumes y Persistencia

```bash
# Listar volúmenes
docker volume ls

# Backup de volumen de MongoDB
docker run --rm -v trabajofinalintegrador_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb_backup.tar.gz /data
```

---

## 8. Solución de Problemas Comunes

### 8.1 Puertos en Uso

```bash
# Verificar qué proceso usa un puerto
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Linux/macOS

# Matar proceso si es necesario
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                # Linux/macOS
```

### 8.2 Problemas de Permisos

```bash
# Resetear permisos de node_modules
docker compose exec frontend rm -rf node_modules package-lock.json
docker compose exec frontend npm install

docker compose exec backend rm -rf node_modules package-lock.json  
docker compose exec backend npm install
```

### 8.3 Cache de Docker

```bash
# Limpiar cache de build
docker builder prune

# Limpiar todo (⚠️ elimina imágenes no utilizadas)
docker system prune -a --volumes
```

### 8.4 Problemas de Conectividad

```bash
# Verificar comunicación entre servicios
docker compose exec frontend ping backend
docker compose exec backend ping database

# Verificar variables de entorno
docker compose exec backend env | grep MONGODB
docker compose exec frontend env | grep VITE_API_URL
```

---

## 9. Monitoreo y Logs

### 9.1 Configuración de Logs

Los logs se pueden configurar en `docker-compose.yml`:

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 9.2 Herramientas de Monitoreo

Para entornos de producción, considerar:
- **Portainer** (interfaz web para Docker)
- **cAdvisor** (métricas de contenedores)
- **Grafana + Prometheus** (monitoreo avanzado)

---

## 10. Referencias y Documentación

- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)

---

**💡 Consejos del Equipo:**

1. **Siempre usar `--build`** cuando cambies dependencias en `package.json`
2. **Verificar logs** antes de reportar issues: `docker compose logs -f`
3. **Usar perfiles** correctamente: `dev` para desarrollo, `prod` para despliegue
4. **Backup regular** de la base de datos en desarrollo
5. **Comunicar cambios** en `.env.example` al equipo

---

*Última actualización: Octubre 2025*
*Versión: 1.0*
*Mantenido por: Equipo de Desarrollo*