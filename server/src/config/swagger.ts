import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerDefinition } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de Sistema de Transporte",
    version: "1.0.0",
    description:
      "API RESTful para gestión de reservas de transportE. " +
      "Este sistema permite a los usuarios consultar rutas disponibles, realizar reservas " +
      "de asientos y gestionar pagos de manera segura.",
    contact: {
      name: "Grupo 26",
      email: "loosagustin@gmail.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:3001/api/v1",
      description: "Servidor de desarrollo local",
    },
  ],
  security: [
    {
      apiKey: [],
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Ingrese el token JWT obtenido al iniciar sesión",
      },
      apiKey: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
        description: "Clave API requerida para todas las peticiones",
      },
    },
    parameters: {
      ApiKeyHeader: {
        name: "X-API-Key",
        in: "header",
        required: true,
        schema: {
          type: "string",
        },
        description: "Clave API requerida para endpoints protegidos",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Mensaje descriptivo del error",
          },
          details: {
            type: "array",
            items: {
              type: "object",
            },
            description: "Detalles adicionales sobre el error (opcional)",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Identificador único del usuario",
          },
          firstName: {
            type: "string",
            description: "Nombre del usuario",
          },
          lastName: {
            type: "string",
            description: "Apellido del usuario",
          },
          email: {
            type: "string",
            format: "email",
            description: "Correo electrónico del usuario",
          },
          phoneNumber: {
            type: "string",
            description: "Número de teléfono",
          },
          role: {
            type: "string",
            enum: ["passenger", "driver", "operator", "admin"],
            description: "Rol del usuario en el sistema",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Fecha de creación del usuario",
          },
        },
      },
      ScheduledRoute: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Identificador único de la ruta",
          },
          origin: {
            type: "string",
            description: "Ciudad de origen",
          },
          destination: {
            type: "string",
            description: "Ciudad de destino",
          },
          departureTime: {
            type: "string",
            description: "Hora de salida en formato HH:MM",
          },
          arrivalTime: {
            type: "string",
            description: "Hora de llegada en formato HH:MM",
          },
          duration: {
            type: "number",
            description: "Duración del viaje en minutos",
          },
          basePrice: {
            type: "number",
            description: "Precio base del pasaje",
          },
          daysOfWeek: {
            type: "array",
            items: {
              type: "number",
              minimum: 0,
              maximum: 6,
            },
            description: "Días de la semana en que opera (0=Domingo, 6=Sábado)",
          },
          isActive: {
            type: "boolean",
            description: "Indica si la ruta está activa",
          },
        },
      },
      RouteInstance: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Identificador único de la instancia",
          },
          scheduledRoute: {
            type: "string",
            description: "Referencia a la ruta programada",
          },
          vehicle: {
            type: "string",
            description: "Referencia al vehículo asignado",
          },
          departureDateTime: {
            type: "string",
            format: "date-time",
            description: "Fecha y hora exacta de salida",
          },
          arrivalDateTime: {
            type: "string",
            format: "date-time",
            description: "Fecha y hora exacta de llegada",
          },
          availableSeats: {
            type: "number",
            description: "Asientos disponibles",
          },
          status: {
            type: "string",
            enum: ["scheduled", "in-progress", "completed", "cancelled"],
            description: "Estado actual del viaje",
          },
          currentPrice: {
            type: "number",
            description: "Precio actual del pasaje",
          },
        },
      },
      Reservation: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Identificador único de la reserva",
          },
          user: {
            type: "string",
            description: "Referencia al usuario que realizó la reserva",
          },
          routeInstance: {
            type: "string",
            description: "Referencia a la instancia de ruta",
          },
          seatNumbers: {
            type: "array",
            items: {
              type: "number",
            },
            description: "Números de asientos reservados",
          },
          totalAmount: {
            type: "number",
            description: "Monto total de la reserva",
          },
          status: {
            type: "string",
            enum: ["pending", "confirmed", "cancelled"],
            description: "Estado de la reserva",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Fecha de creación de la reserva",
          },
        },
      },
      Payment: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Identificador único del pago",
          },
          reservation: {
            type: "string",
            description: "Referencia a la reserva",
          },
          amount: {
            type: "number",
            description: "Monto del pago",
          },
          paymentMethod: {
            type: "string",
            enum: ["cash", "manual"],
            description: "Método de pago utilizado",
          },
          status: {
            type: "string",
            enum: ["pending", "approved", "rejected", "cancelled"],
            description: "Estado del pago",
          },
          externalId: {
            type: "string",
            description: "Identificador externo del procesador de pagos",
          },
          paidAt: {
            type: "string",
            format: "date-time",
            description: "Fecha de confirmación del pago",
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Autenticación",
      description:
        "Operaciones relacionadas con el registro y autenticación de usuarios",
    },
    {
      name: "Rutas",
      description: "Consulta de rutas y horarios disponibles",
    },
    {
      name: "Reservas",
      description: "Gestión de reservas de pasajes",
    },
    {
      name: "Pagos",
      description: "Procesamiento y consulta de pagos",
    },
    {
      name: "Administración",
      description: "Funciones administrativas del sistema",
    },
    {
      name: "Configuración",
      description: "Configuración general de la empresa",
    },
  ],
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/models/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
