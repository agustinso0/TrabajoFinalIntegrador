# 1. ETAPA DE CONSTRUCCIÓN (Instala dependencias y construye el proyecto)
# Usamos la misma versión Node LTS para consistencia en el build
FROM node:20.12.2-slim AS build

WORKDIR /app

COPY package*.json ./
# Instala dependencias para desarrollo/construcción (incluye Vite/TypeScript)
RUN npm install

COPY . .

# Compila el código React/TypeScript (genera la carpeta 'dist/')
RUN npm run build


# 2. ETAPA DE PRODUCCIÓN (Servidor Nginx para archivos estáticos)
# Nginx es ultraligero y seguro para servir el Front
FROM nginx:alpine

# Copia los archivos estáticos compilados de React al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]