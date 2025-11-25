// configuraciones de seguridad

// CORS - que sitios pueden usar la API
export const corsConfig = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:8080",
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    // permitir requests sin origin (postman, insomnia, etc)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
};

// patrones regex para validar cosas
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]{10,15}$/,
  objectId: /^[0-9a-fA-F]{24}$/,
  time: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
};
