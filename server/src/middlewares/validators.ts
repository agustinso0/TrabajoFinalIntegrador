// validaciones para la API
import { body, param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

// constantes de validación
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 100;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;
const MIN_LOCATION_LENGTH = 2;
const MAX_LOCATION_LENGTH = 100;
const MIN_SEAT_NUMBER = 1;
const MAX_SEAT_NUMBER = 100;
const MAX_NOTES_LENGTH = 500;
const MIN_PAGE = 1;
const MAX_LIMIT = 100;
const MAX_SEARCH_LIMIT = 50;
const MIN_AMOUNT = 0.01;
const PHONE_REGEX = /^\+?[\d\s\-\(\)]{10,15}$/;
const MONGODB_ID_REGEX = /^[0-9a-fA-F]{24}$/;

// procesar errores de validacion y enviar respuesta
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

// validacion para registro de usuario
export const validateRegister = [
  body("email").isEmail().normalizeEmail().withMessage("Email debe ser válido y tener formato correcto"),

  body("password")
    .isLength({ min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH })
    .withMessage(`Password debe tener entre ${MIN_PASSWORD_LENGTH} y ${MAX_PASSWORD_LENGTH} caracteres`),

  body("firstName")
    .trim()
    .isLength({ min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH })
    .withMessage(`Nombre debe tener entre ${MIN_NAME_LENGTH} y ${MAX_NAME_LENGTH} caracteres`),

  body("lastName")
    .trim()
    .isLength({ min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH })
    .withMessage(`Apellido debe tener entre ${MIN_NAME_LENGTH} y ${MAX_NAME_LENGTH} caracteres`),

  body("phoneNumber")
    .matches(PHONE_REGEX)
    .withMessage("Teléfono debe ser válido y tener entre 10 y 15 dígitos"),

  body("role")
    .optional()
    .isIn(["passenger", "driver", "operator", "admin"])
    .withMessage("Rol debe ser passenger, driver, operator o admin"),

  handleValidationErrors,
];

// validacion para login
export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Email debe ser válido y tener formato correcto"),

  body("password").notEmpty().withMessage("Password es requerido y no puede estar vacío"),

  handleValidationErrors,
];

// cambiar datos del perfil
export const validateUpdateProfile = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH })
    .withMessage(`Nombre debe tener entre ${MIN_NAME_LENGTH} y ${MAX_NAME_LENGTH} caracteres`),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH })
    .withMessage(`Apellido debe tener entre ${MIN_NAME_LENGTH} y ${MAX_NAME_LENGTH} caracteres`),

  body("phoneNumber")
    .optional()
    .matches(PHONE_REGEX)
    .withMessage("Teléfono debe ser válido y tener entre 10 y 15 dígitos"),

  handleValidationErrors,
];

// cambiar password
export const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Password actual es requerido y no puede estar vacío"),

  body("newPassword")
    .isLength({ min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH })
    .withMessage(`Nuevo password debe tener entre ${MIN_PASSWORD_LENGTH} y ${MAX_PASSWORD_LENGTH} caracteres`),

  handleValidationErrors,
];

// crear reserva nueva
export const validateCreateReservation = [
  body("routeInstanceId")
    .matches(MONGODB_ID_REGEX)
    .withMessage("ID de ruta debe ser un ObjectId válido de MongoDB"),

  body("seatNumber")
    .optional()
    .isInt({ min: MIN_SEAT_NUMBER, max: MAX_SEAT_NUMBER })
    .withMessage(`Numero de asiento debe estar entre ${MIN_SEAT_NUMBER} y ${MAX_SEAT_NUMBER}`),

  body("specialRequests")
    .optional()
    .trim()
    .isLength({ max: MAX_NOTES_LENGTH })
    .withMessage(`Solicitudes especiales no pueden exceder ${MAX_NOTES_LENGTH} caracteres`),

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
    .withMessage("Fecha debe ser válida en formato ISO8601 (YYYY-MM-DD)"),

  query("origin")
    .optional()
    .trim()
    .isLength({ min: MIN_LOCATION_LENGTH, max: MAX_LOCATION_LENGTH })
    .withMessage(`Origen debe tener entre ${MIN_LOCATION_LENGTH} y ${MAX_LOCATION_LENGTH} caracteres`),

  query("destination")
    .optional()
    .trim()
    .isLength({ min: MIN_LOCATION_LENGTH, max: MAX_LOCATION_LENGTH })
    .withMessage(`Destino debe tener entre ${MIN_LOCATION_LENGTH} y ${MAX_LOCATION_LENGTH} caracteres`),

  query("page")
    .optional()
    .isInt({ min: MIN_PAGE })
    .withMessage(`Página debe ser un número mayor o igual a ${MIN_PAGE}`),

  query("limit")
    .optional()
    .isInt({ min: MIN_PAGE, max: MAX_SEARCH_LIMIT })
    .withMessage(`Límite debe estar entre ${MIN_PAGE} y ${MAX_SEARCH_LIMIT}`),

  handleValidationErrors,
];

// crear pago
export const validateCreatePayment = [
  body("reservationId")
    .matches(MONGODB_ID_REGEX)
    .withMessage("ID de reserva debe ser un ObjectId válido de MongoDB"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: MAX_NOTES_LENGTH })
    .withMessage(`Notas no pueden exceder ${MAX_NOTES_LENGTH} caracteres`),

  handleValidationErrors,
];

// cambiar estado de pago
export const validateUpdatePaymentStatus = [
  body("status")
    .isIn(["pending", "approved", "rejected", "cancelled"])
    .withMessage("Estado debe ser uno de: pending, approved, rejected, cancelled"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: MAX_NOTES_LENGTH })
    .withMessage(`Notas no pueden exceder ${MAX_NOTES_LENGTH} caracteres`),

  handleValidationErrors,
];

// validar IDs de mongo
export const validateObjectIdParam = (paramName: string = "id") => [
  param(paramName)
    .matches(MONGODB_ID_REGEX)
    .withMessage(`${paramName} debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)`),

  handleValidationErrors,
];

// para paginacion
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: MIN_PAGE })
    .withMessage(`Página debe ser un número mayor o igual a ${MIN_PAGE}`),

  query("limit")
    .optional()
    .isInt({ min: MIN_PAGE, max: MAX_LIMIT })
    .withMessage(`Límite debe estar entre ${MIN_PAGE} y ${MAX_LIMIT}`),

  handleValidationErrors,
];
