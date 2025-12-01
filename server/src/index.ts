import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB, { disconnectDB } from "./config/database.js";
import { corsConfig } from "./config/security.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { apiKeyMiddleware } from "./middlewares/apiKey.js";
import {
  generalLimiter,
  sanitizeInput,
  preventNoSQLInjection,
  securityLogger,
} from "./middlewares/security.js";
import routesRouter from "./routes/routes.js";
import reservationsRouter from "./routes/reservations.js";
import paymentsRouter from "./routes/payments.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import companyConfigRouter from "./routes/companyConfigRoutes.js";
import { CompanyConfigService } from "./services/CompanyConfigService.js";
import User from "./models/User.js";
import Vehicle from "./models/Vehicle.js";
import ScheduledRoute from "./models/ScheduledRoute.js";
import RouteInstance from "./models/RouteInstance.js";

// cargar variables de entorno
dotenv.config();

const app = express();

// puerto del servidor (se resuelve al iniciar)

// config de seguridad basica
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// documentacion de la API removida

// limitar requests
app.use(generalLimiter);

// registrar eventos de seguridad
app.use(securityLogger);

// middlewares comunes
app.use(cors(corsConfig)); // permitir requests del frontend
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// middlewares de seguridad
app.use(sanitizeInput);
app.use(preventNoSQLInjection);

// validar api key
app.use("/api", apiKeyMiddleware);

// Rutas de la API
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/routes", routesRouter);
app.use("/api/v1/reservations", reservationsRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/config", companyConfigRouter);

// Health check
app.get("/health", async (req, res) => {
  try {
    const config = await CompanyConfigService.getPublicInfo();

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      company: config?.companyName || "Sistema de Transporte",
      version: "1.0.0",
    });
  } catch (error) {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      company: "Sistema de Transporte",
      version: "1.0.0",
    });
  }
});

// Rutas no encontradas
app.use(notFoundHandler);

// Middleware de manejo de errores
app.use(errorHandler);

// Inicializar configuracion
const setupConfig = async () => {
  try {
    console.log("configurando empresa...");
    const config = await CompanyConfigService.initializeDefault();
    console.log(`todo listo para: ${config.companyName}`);
  } catch (error) {
    console.warn("  algo salio mal con la config, usando default");
  }
};

const seedDemoData = async () => {
  const existing = await RouteInstance.findOne({});
  if (existing) return;

  const adminExists = await User.findOne({ email: "admin.local@example.com" });
  if (!adminExists) {
    await User.create({
      email: "admin.local@example.com",
      password: "AdminPass123",
      firstName: "Admin",
      lastName: "Local",
      phoneNumber: "+54 11 5555-0001",
      role: "admin",
    });
  }

  const operatorExists = await User.findOne({ email: "operador.local@example.com" });
  if (!operatorExists) {
    await User.create({
      email: "operador.local@example.com",
      password: "Operador456",
      firstName: "Juan",
      lastName: "Pérez",
      phoneNumber: "+54 11 5555-0002",
      role: "operator",
    });
  }

  const passengerExists = await User.findOne({ email: "test.user2@example.com" });
  if (!passengerExists) {
    await User.create({
      email: "test.user2@example.com",
      password: "Password123",
      firstName: "Test",
      lastName: "User",
      phoneNumber: "+54 11 2222-2222",
      role: "passenger",
    });
  }

  const driver = await User.create({
    email: "driver@example.com",
    password: "driver123",
    firstName: "Chofer",
    lastName: "Demo",
    phoneNumber: "+54 11 1111-1111",
    role: "driver",
  });

  const vehicle = await Vehicle.create({
    licensePlate: "AB123CD",
    brand: "Mercedes",
    vehicleModel: "Sprinter",
    year: 2020,
    capacity: 30,
    features: ["Aire", "WiFi"],
    driverId: driver._id,
  });

  const scheduledRoute = await ScheduledRoute.create({
    name: "Buenos Aires - Córdoba",
    origin: {
      address: "Av. Corrientes 1000",
      city: "Buenos Aires",
      province: "Buenos Aires",
      country: "Argentina",
      coordinates: { lat: -34.6037, lng: -58.3816 },
    },
    destination: {
      address: "Av. Colón 500",
      city: "Córdoba",
      province: "Córdoba",
      country: "Argentina",
      coordinates: { lat: -31.4201, lng: -64.1888 },
    },
    description: "Servicio directo",
    duration: 420,
    basePrice: 15000,
    isActive: true,
  });

  const today = new Date();
  const departureDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  await RouteInstance.create({
    scheduledRouteId: scheduledRoute._id.toString(),
    vehicleId: vehicle._id.toString(),
    driverId: driver._id.toString(),
    departureDate,
    departureTime: "08:00",
    arrivalTime: "15:00",
    currentPrice: 18000,
    availableSeats: 25,
    status: "scheduled",
    notes: "",
  });
};

// arrancar todo
let server: any;

export const startServer = async () => {
  await connectDB();
  await setupConfig();
  await seedDemoData();

  const port = process.env.PORT !== undefined ? Number(process.env.PORT) : 3001;
  server = app.listen(port, () => {
    console.log(`server andando en puerto ${port}`);
    console.log(`${process.env.COMPANY_NAME || "Sistema de Transporte"}`);
    console.log(`API Key: ${process.env.API_KEY ? "OK" : "falta configurar"}`);
  });
  return server;
};

// manejar cierre
export const stopServer = async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await disconnectDB();
};

if (process.env.NODE_ENV !== "test") {
  startServer().catch(console.error);
}

export default app;
