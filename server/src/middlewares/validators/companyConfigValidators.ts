import { body, param } from "express-validator";
import { handleValidationErrors } from "../validators.js";

export const validateCompanyConfig = [
  body("companyName")
    .notEmpty()
    .withMessage("El nombre de la empresa es requerido")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres")
    .trim(),

  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),

  body("phone").optional().trim(),

  body("address").optional().trim(),

  handleValidationErrors,
];
