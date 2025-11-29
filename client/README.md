# Frontend TFI — Prototipo navegable (no funcional)

Frontend de referencia para el Trabajo Final Integrador. Objetivo: generar un prototipo navegable de las pantallas solicitadas, sin lógica de negocio ni integración.

Desarrolladores frontend: Bautista y Juan Ignacio.

## Ejecutar el proyecto

- Requisitos: Node 18+.
- Instalar dependencias: `npm install`.
- Desarrollo: `npm run dev`.
- Linter: `npm run lint`. 
- Build: `npm run build`.

Rama de trabajo: `frontend-development`.

## Tecnologías y estándares

- React + TypeScript + Vite.
- UI con `@chakra-ui/react`.
- Routing con `react-router-dom`.
- ESLint con reglas estrictas TypeScript.

## Estructura de carpetas

```
src/
  components/        Elementos reutilizables (Header, Sidebar, Footer)
  layouts/           Layouts de aplicación
  pages/             Pantallas por anexo
  routes/            Definición de rutas
  assets/            Recursos estáticos
```

Convenciones:
- Nombres en PascalCase para componentes y páginas.
- Un componente por archivo.
- Sin lógica real; placeholders claros y accesibles.

## Rutas y anexos

- `/login` — Anexo A (Login).
- `/lost-password` — Anexo A (Recupero).
- `/signup` — Anexo B (Registro).
- `/home` — Anexo C (Home + estadísticas).
- `/profile` — Anexo E (Perfil + actualización).
- `/users` — Anexo F (Tabla + ABM).
- `/abm` — Anexo G (Formularios / ABM).
- `/records` — Anexo H (Listado + filtros + búsqueda + paginado).
- `/records/:id` — Visualización de registro individual.
- `/report` — Anexo J (Impresión de reporte).
- `/query-report` — Anexo K (Consulta + Reporte).

## Entregables globales

- Login / Recupero de contraseña — Anexo A.
- Registro — Anexo B.
- Home + estadísticas — Anexo C.
- Header, Menú/Sidebar y Footer — Anexo D.
- Perfil de usuario — Anexo E.
- Tabla + ABM de Usuarios — Anexo F.
- Estructura y estandarización de directorios/componentes.

## Entregables por alumno

Sugerencia de reparto (ajustable):

- Bautista:
  - Listado de Registros + Búsqueda + Paginado + Filtros.
  - Visualización de registro individual.
  - Operaciones de actualización/eliminación sobre lista o registro.

- Juan Ignacio:
  - Consultas por pantalla + reporte si corresponde.
  - Generación de reportes para listados completos o filtrados.
  - Tabla + ABM de Usuarios.

## Lineamientos de diseño

- Layout fijo: Header arriba, Sidebar izquierda, Footer abajo.
- Paleta base: azul (`blue.600`) para elementos primarios.
- Tipografía y espaciado de Chakra por defecto.
- Componentes accesibles con roles y etiquetas.

## Instrucciones por anexo

### Anexo A — Login / Lost password
- Login: email + contraseña, enlace a recuperación y registro.
- Recupero: campo de email y acción de envío de enlace.

### Anexo B — Sign up
- Formulario básico con nombre, apellido, email y contraseña.

### Anexo C — Home
- Tarjetas de métricas principales (usuarios, reservas, ingresos) con valores placeholders.

### Anexo D — Header, Menú/Sidebar y Footer
- Header con navegación rápida (Home, Registros, Usuarios, Reporte).
- Sidebar con enlaces a todas las secciones.
- Footer con identificación del equipo.

### Anexo E — Perfil
- Formulario de datos personales y sección de cambio de contraseña.

### Anexo F — Tabla + ABM de Usuarios
- Tabla con acciones por fila (Editar/Eliminar) y botón de alta.

### Anexo G — Formularios / ABM
- Ejemplo de formulario con inputs, textarea y select.

### Anexo H — Lista de registros + filtros, paginado y búsqueda
- Controles de búsqueda, filtros y cantidad por página.
- Tabla con navegación al detalle del registro.

### Anexo J — Impresión de reporte
- Vista imprimible y acción de `window.print()`.

### Anexo K — Consulta + Reporte
- Controles de búsqueda y filtros con área de resultados para exportar/imprimir.

## Notas

- Todas las pantallas son estáticas; no hay integración ni validaciones.
- El objetivo es validar flujo y diseño de navegación.
