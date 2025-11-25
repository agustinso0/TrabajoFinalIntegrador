import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/index.js";

// custom error para la app
export interface AppError extends Error {
  statusCode?: number;
}

// manejar todos los errores
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Algo salio mal";

  console.error("❌ ERROR:", {
    mensaje: error.message,
    url: req.originalUrl,
    metodo: req.method,
  });

  // errores comunes de mongoose
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Datos invalidos";

    const validationErrors = Object.values((error as any).errors).map(
      (err: any) => err.message
    );

    return res.status(statusCode).json({
      success: false,
      message,
      error: validationErrors.join(", "),
    });
  }

  // cuando el id no es valido
  if (error.name === "CastError") {
    statusCode = 400;
    message = "ID invalido";

    return res.status(statusCode).json({
      success: false,
      message,
      error: "El ID no tiene el formato correcto",
    });
  }

  // cuando algo ya existe (duplicado)
  if (error.name === "MongoServerError" && (error as any).code === 11000) {
    statusCode = 409;
    message = "Ya existe";

    const field = Object.keys((error as any).keyValue)[0];

    return res.status(statusCode).json({
      success: false,
      message,
      error: `Ya existe un registro con ese ${field}`,
    });
  }

  // token roto o malformado
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token invalido";

    return res.status(statusCode).json({
      success: false,
      message,
      error: "Token no valido",
    });
  }

  // token expirado
  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token vencido";

    return res.status(statusCode).json({
      success: false,
      message,
      error: "El token vencio",
    });
  }

  const response: ApiResponse = {
    success: false,
    message,
    error:
      process.env.NODE_ENV === "production"
        ? "Error del servidor"
        : error.stack,
  };

  res.status(statusCode).json(response);
};

// cuando no encuentran la ruta
export const notFoundHandler = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    message: "Ruta no encontrada",
    error: `No existe ${req.method} ${req.originalUrl}`,
  };

  res.status(404).json(response);
};

// helper para crear errores
export const createError = (
  message: string,
  statusCode: number = 500
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// wrapper para async functions
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
