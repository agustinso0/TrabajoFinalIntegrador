import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthenticatedRequest, ApiResponse } from "../types";

// middleware para verificar JWT y cargar usuario
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // extraer token del header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: "Token de acceso requerido",
        error: "Debe proporcionar un token JWT valido",
      };
      return res.status(401).json(response);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET no configurado");
      const response: ApiResponse = {
        success: false,
        message: "Error de configuracion del servidor",
        error: "Configuracion de autenticacion no valida",
      };
      return res.status(500).json(response);
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      email: string;
    };

    const user = await User.findById(decoded.userId).select("+password");
    if (!user || !user.isActive) {
      const response: ApiResponse = {
        success: false,
        message: "Usuario no valido o inactivo",
        error: "El usuario asociado al token no existe o esta desactivado",
      };
      return res.status(401).json(response);
    }

    // sacar password del objeto
    const userWithoutPassword = user.toObject();
    delete (userWithoutPassword as any).password;

    req.user = userWithoutPassword as any;
    next();
  } catch (error) {
    console.error("Error en autenticacion:", error);

    let message = "Token inválido";
    if (error instanceof jwt.TokenExpiredError) {
      message = "Token expirado";
    } else if (error instanceof jwt.JsonWebTokenError) {
      message = "Token malformado";
    }

    const response: ApiResponse = {
      success: false,
      message,
      error: "Token de autenticacion no valido",
    };
    return res.status(401).json(response);
  }
};

// crear token jwt
export const generateToken = (userId: string, email: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  if (!jwtSecret) {
    throw new Error("JWT_SECRET no configurado");
  }

  return jwt.sign({ userId, email }, jwtSecret, { expiresIn: "7d" });
};
