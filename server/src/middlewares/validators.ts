// validaciones para la API
import { body, param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

// manejar cuando hay errores de validacion
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);

    const response: ApiResponse = {
      success: false,
      message: "Datos incorrectos",
      error: errorMessages.join(", "),
    };

    return res.status(400).json(response);
  }

  next();
};

// validar cuando se registra
export const validateRegister = [
  body("email").isEmail().normalizeEmail().withMessage("Email debe ser valido"),

  body("password")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password debe tener entre 6 y 100 caracteres"),

  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nombre debe tener entre 2-50 caracteres"),

  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Apellido debe tener entre 2-50 caracteres"),

  body("phoneNumber")
    .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
    .withMessage("Telefono debe ser valido"),

  body("role")
    .optional()
    .isIn(["passenger", "driver", "operator", "admin"])
    .withMessage("Rol debe ser passenger, driver, operator o admin"),

  handleValidationErrors,
];

// para login
export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Email debe ser valido"),

  body("password").notEmpty().withMessage("Password es requerido"),

  handleValidationErrors,
];

// cambiar datos del perfil
export const validateUpdateProfile = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nombre debe tener entre 2-50 caracteres"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Apellido debe tener entre 2-50 caracteres"),

  body("phoneNumber")
    .optional()
    .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
    .withMessage("Telefono debe ser valido"),

  handleValidationErrors,
];

// cambiar password
export const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Password actual es requerido"),

  body("newPassword")
    .isLength({ min: 6, max: 100 })
    .withMessage("Nuevo password debe tener entre 6 y 100 caracteres"),

  handleValidationErrors,
];

// crear reserva nueva
export const validateCreateReservation = [
  body("routeInstanceId")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("ID de ruta debe ser valido"),

  body("seatNumber")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Numero de asiento debe ser entre 1 y 100"),

  body("specialRequests")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Solicitudes especiales no pueden exceder 500 caracteres"),

  body("paymentMethod")
    .isIn(["cash", "manual"])
    .withMessage("Metodo de pago debe ser cash o manual"),

  handleValidationErrors,
];

// buscar rutas
export const validateRouteSearch = [
  query("date")
    .optional()
    .isISO8601()
    .withMessage("Fecha debe ser valida (YYYY-MM-DD)"),

  query("origin")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Origen debe tener entre 2 y 100 caracteres"),

  query("destination")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Destino debe tener entre 2 y 100 caracteres"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Pagina debe ser un numero mayor a 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limite debe ser entre 1 y 50"),

  handleValidationErrors,
];

// crear pago
export const validateCreatePayment = [
  body("reservationId")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("ID de reserva debe ser valido"),

  body("amount").isFloat({ min: 0.01 }).withMessage("Monto debe ser mayor a 0"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notas no pueden exceder 500 caracteres"),

  handleValidationErrors,
];

// cambiar estado de pago
export const validateUpdatePaymentStatus = [
  body("status")
    .isIn(["pending", "approved", "rejected", "cancelled"])
    .withMessage("Estado debe ser pending, approved, rejected o cancelled"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notas no pueden exceder 500 caracteres"),

  handleValidationErrors,
];

// validar IDs de mongo
export const validateObjectIdParam = (paramName: string = "id") => [
  param(paramName)
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage(`${paramName} debe ser un ID valido`),

  handleValidationErrors,
];

// para paginacion
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Pagina debe ser un numero mayor a 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limite debe ser entre 1 y 100"),

  handleValidationErrors,
];
