// rutas para admins
import { Router } from "express";
import {
  getBasicSummary,
  getUsersList,
  getRecentReservations,
  getSystemStatus,
} from "../controllers/adminController.js";
import { authenticateToken } from "../middlewares/auth.js";
import { requireAdmin, requireOperator } from "../middlewares/authorization.js";
import { validatePagination } from "../middlewares/validators.js";

const router = Router();

// todas necesitan login
router.use(authenticateToken);

// resumen del sistema
router.get("/summary", requireOperator, getBasicSummary);

// lista de usuarios
router.get("/users", requireOperator, validatePagination, getUsersList);

// reservas recientes
router.get(
  "/reservations/recent",
  requireOperator,
  validatePagination,
  getRecentReservations
);

// estado del sistema
router.get("/system-status", requireOperator, getSystemStatus);

export default router;
