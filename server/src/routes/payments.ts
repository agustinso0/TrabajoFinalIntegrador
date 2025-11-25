// rutas para manejar pagos
import { Router } from "express";
import {
  createManualPayment,
  getPaymentsByReservation,
  updatePaymentStatus,
  getPaymentHistory,
  getPaymentStatistics,
} from "../controllers/paymentsController.js";
import { authenticateToken } from "../middlewares/auth.js";
import {
  requirePassenger,
  requireOperator,
  requireOperatorOrAdmin,
} from "../middlewares/authorization.js";
import { createLimiter } from "../middlewares/security.js";
import {
  validateCreatePayment,
  validateUpdatePaymentStatus,
  validateObjectIdParam,
  validatePagination,
} from "../middlewares/validators.js";

const router = Router();

// todo necesita login
router.use(authenticateToken);

// crear pago
router.post(
  "/create",
  createLimiter,
  validateCreatePayment,
  createManualPayment
);

// ver pagos de una reserva
router.get(
  "/reservation/:reservationId",
  validateObjectIdParam("reservationId"),
  getPaymentsByReservation
);

// cambiar estado del pago (admin)
router.patch(
  "/:paymentId/status",
  requireOperatorOrAdmin,
  validateObjectIdParam("paymentId"),
  validateUpdatePaymentStatus,
  updatePaymentStatus
);

// historial de pagos
router.get(
  "/history",
  requireOperatorOrAdmin,
  validatePagination,
  getPaymentHistory
);

// estadisticas
router.get("/statistics", requireOperatorOrAdmin, getPaymentStatistics);

export default router;
