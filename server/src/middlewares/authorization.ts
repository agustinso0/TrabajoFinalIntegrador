import { Response, NextFunction } from "express";
import { AuthenticatedRequest, ApiResponse, IUser } from "../types";

type UserRole = IUser["role"];

// middleware para verificar roles
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: "Usuario no autenticado",
        error: "Necesitas loguearte",
      };
      return res.status(401).json(response);
    }

    if (!allowedRoles.includes(req.user.role)) {
      const response: ApiResponse = {
        success: false,
        message: "Acceso denegado",
        error: `Necesitas tener rol de: ${allowedRoles.join(", ")}`,
      };
      return res.status(403).json(response);
    }

    next();
  };
};

// middlewares por rol especifico
export const requireAdmin = authorize("admin");
export const requireOperator = authorize("admin", "operator");
export const requireDriver = authorize("admin", "operator", "driver");
export const requirePassenger = authorize(
  "admin",
  "operator",
  "driver",
  "passenger"
);

// alias para claridad
export const requireOperatorOrAdmin = requireOperator;

// verificar que sea suyo o admin
export const requireOwnershipOrAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    const response: ApiResponse = {
      success: false,
      message: "Usuario no autenticado",
      error: "Se requiere iniciar sesion",
    };
    return res.status(401).json(response);
  }

  const resourceUserId =
    req.params.userId || req.params.passengerId || req.body.passengerId;
  const isAdmin = req.user.role === "admin";
  const isOperator = req.user.role === "operator";
  const isOwner = req.user._id?.toString() === resourceUserId;

  if (!isAdmin && !isOperator && !isOwner) {
    const response: ApiResponse = {
      success: false,
      message: "Acceso denegado",
      error: "Solo puedes acceder a tus propios recursos o ser admin",
    };
    return res.status(403).json(response);
  }

  next();
};

// solo admins y operadores pueden escribir
export const requireWritePermission = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    const response: ApiResponse = {
      success: false,
      message: "Usuario no autenticado",
      error: "Se requiere iniciar sesion",
    };
    return res.status(401).json(response);
  }

  const canWrite = ["admin", "operator"].includes(req.user.role);

  if (!canWrite) {
    const response: ApiResponse = {
      success: false,
      message: "Permisos insuficientes",
      error: "Se requiere ser admin u operador",
    };
    return res.status(403).json(response);
  }

  next();
};
