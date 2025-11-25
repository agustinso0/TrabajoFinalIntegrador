# 1. ETAPA DE CONSTRUCCIÓN Y DESARROLLO (Instala todas las dependencias)
# Usamos una versión específica y más segura de Node LTS (slim)
FROM node:20.12.2-slim AS build

WORKDIR /app

# Copia los archivos de configuración
COPY package*.json ./

# Instala todas las dependencias (incluyendo devDependencies para pruebas/compilación)
RUN npm install

# Copia el código fuente
COPY . .

# Compila el código TypeScript para producción
# Asume que 'npm run build-ts' existe en package.json y genera archivos en 'dist'
# || exit 0 asegura que el build no falle en entornos donde no existe el script
RUN npm run build-ts || exit 0


# 2. ETAPA DE PRODUCCIÓN (Más segura, solo runtime)
# Usa la misma base 'slim'
FROM node:20.12.2-slim

WORKDIR /app

# Instala solo las dependencias de producción
COPY --from=build /app/package*.json ./
RUN npm install --only=production

# Copia el código compilado (el resultado del build-ts)
COPY --from=build /app/dist /app/dist/ 
# Copia archivos de configuración esenciales para producción
COPY --from=build /app/.env /app/.env.production 
# Copia el código fuente (si ejecutas con ts-node en prod o necesitas archivos de config)
COPY --from=build /app/src /app/src/

EXPOSE 3001

# Comando final de producción (ejecuta el compilado JS)
CMD ["node", "dist/index.js"]