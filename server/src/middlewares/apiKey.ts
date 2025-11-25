import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

// middleware para verificar api key
export const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.header("X-API-Key") || (req.query.api_key as string);
  const requiredApiKey = process.env.API_KEY;

  if (!requiredApiKey) {
    console.warn("⚠️ API_KEY no configurada en .env");
    return next(); // en desarrollo pasa sin api key
  }

  if (!apiKey) {
    const response: ApiResponse = {
      success: false,
      message: "API Key requerida",
      error: "Debe proporcionar un API Key valido en el header X-API-Key",
    };
    return res.status(401).json(response);
  }

  if (apiKey !== requiredApiKey) {
    const response: ApiResponse = {
      success: false,
      message: "API Key invalido",
      error: "El API Key proporcionado no es valido",
    };
    return res.status(403).json(response);
  }

  next();
};
