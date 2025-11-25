// middlewares basicos de seguridad
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

// tiempos para rate limiting
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;

// limites de longitud para sanitizacion
const MAX_BODY_STRING_LENGTH = 1000;
const MAX_QUERY_STRING_LENGTH = 500;

// rate limiter general para todo
export const generalLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 100, // max 100 por IP
  message: {
    success: false,
    message: "Muchas solicitudes",
    error: "Intenta de nuevo en 15 minutos",
  },
});

// para login (mas estricto)
export const authLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 5, // max 5 intentos
  message: {
    success: false,
    message: "Muchos intentos de login",
    error: "Cuenta bloqueada 15 minutos",
  },
});

// para crear cosas (evitar spam)
export const createLimiter = rateLimit({
  windowMs: ONE_MINUTE,
  max: 5, // maximo 5 por minuto
  message: {
    success: false,
    message: "Muy rapido creando",
    error: "Espera un momento",
  },
});

// limpiar datos que llegan
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // limpiar body
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key]
          .trim()
          .replace(/[<>]/g, "")
          .slice(0, MAX_BODY_STRING_LENGTH);
      }
    }
  }

  // limpiar query params
  if (req.query && typeof req.query === "object") {
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = (req.query[key] as string)
          .trim()
          .replace(/[<>]/g, "")
          .slice(0, MAX_QUERY_STRING_LENGTH);
      }
    }
  }

  next();
};

// verificar que manden algo en el body
export const validateRequiredBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (!req.body || Object.keys(req.body).length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "Faltan datos",
        error: "El body no puede estar vacio",
      };
      return res.status(400).json(response);
    }
  }
  next();
};

// validar ObjectIds de mongo
export const validateObjectId = (paramName: string = "id") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];

    if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
      const response: ApiResponse = {
        success: false,
        message: "ID invalido",
        error: `${paramName} debe ser un ID valido`,
      };
      return res.status(400).json(response);
    }

    next();
  };
};

// evitar inyecciones nosql
export const preventNoSQLInjection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dangerousOperators = ["$where", "$regex", "$ne", "$in", "$nin"];

  const checkObject = (obj: any): boolean => {
    if (typeof obj !== "object" || obj === null) return true;

    for (const key in obj) {
      if (dangerousOperators.some((op) => key.includes(op))) {
        return false;
      }
      if (typeof obj[key] === "object" && !checkObject(obj[key])) {
        return false;
      }
    }
    return true;
  };

  if (!checkObject(req.body) || !checkObject(req.query)) {
    const response: ApiResponse = {
      success: false,
      message: "Datos invalidos",
      error: "Se detectaron caracteres no permitidos",
    };
    return res.status(400).json(response);
  }

  next();
};

// log basico para debug
export const securityLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || "unknown";
  console.log(
    `[${new Date().toISOString()}] ${ip} ${req.method} ${req.originalUrl}`
  );
  next();
};
