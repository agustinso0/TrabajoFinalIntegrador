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

// cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // puerto por default 3001

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

// limitar requests
app.use(generalLimiter);

// logs para seguridad
app.use(securityLogger);

// middlewares comunes
app.use(cors(corsConfig)); // para que funcione con el frontend
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// validaciones extra
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

// arrancar todo
const startServer = async () => {
  await connectDB();
  await setupConfig();

  app.listen(PORT, () => {
    console.log(`server andando en puerto ${PORT}`);
    console.log(`${process.env.COMPANY_NAME || "Sistema de Transporte"}`);
    console.log(`API Key: ${process.env.API_KEY ? "OK" : "falta configurar"}`);
  });
};

// manejar cierre
process.on("SIGTERM", async () => {
  console.log(" chau servidor...");
  await disconnectDB();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log(" chau servidor...");
  await disconnectDB();
  process.exit(0);
});

startServer().catch(console.error);

export default app;
