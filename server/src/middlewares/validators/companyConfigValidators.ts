import { body, param } from "express-validator";
import { handleValidationErrors } from "../validators.js";

// constantes de validación
const MIN_COMPANY_NAME_LENGTH = 2;
const MAX_COMPANY_NAME_LENGTH = 100;

export const validateCompanyConfig = [
  body("companyName")
    .notEmpty()
    .withMessage("El nombre de la empresa es requerido")
    .isLength({ min: MIN_COMPANY_NAME_LENGTH, max: MAX_COMPANY_NAME_LENGTH })
    .withMessage(
      `El nombre debe tener entre ${MIN_COMPANY_NAME_LENGTH} y ${MAX_COMPANY_NAME_LENGTH} caracteres`
    )
    .trim(),

  body("email")
    .isEmail()
    .withMessage("Formato de email inválido. Debe ser un email válido (ej: usuario@ejemplo.com)")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage("El teléfono debe tener entre 10 y 20 caracteres"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("La dirección no puede exceder 200 caracteres"),

  handleValidationErrors,
];
