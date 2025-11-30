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

/**
 * @swagger
 * /payments/create:
 *   post:
 *     summary: Crear nuevo pago
 *     description: Registra un pago manual para una reserva
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationId
 *               - amount
 *               - paymentMethod
 *             properties:
 *               reservationId:
 *                 type: string
 *                 description: ID de la reserva
 *               amount:
 *                 type: number
 *                 description: Monto del pago
 *                 example: 5000
 *               paymentMethod:
 *                 type: string
 *                 enum: [mercadopago, cash, transfer]
 *                 description: Método de pago
 *     responses:
 *       201:
 *         description: Pago creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post(
  "/create",
  createLimiter,
  validateCreatePayment,
  createManualPayment
);

/**
 * @swagger
 * /payments/reservation/{reservationId}:
 *   get:
 *     summary: Obtener pagos de una reserva
 *     description: Lista todos los pagos asociados a una reserva específica
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Lista de pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Reserva no encontrada
 *       401:
 *         description: No autorizado
 */
router.get(
  "/reservation/:reservationId",
  validateObjectIdParam("reservationId"),
  getPaymentsByReservation
);

/**
 * @swagger
 * /payments/{paymentId}/status:
 *   patch:
 *     summary: Actualizar estado del pago
 *     description: Modifica el estado de un pago. Requiere rol de operador o administrador
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, refunded]
 *                 description: Nuevo estado del pago
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Estado inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.patch(
  "/:paymentId/status",
  requireOperatorOrAdmin,
  validateObjectIdParam("paymentId"),
  validateUpdatePaymentStatus,
  updatePaymentStatus
);

/**
 * @swagger
 * /payments/history:
 *   get:
 *     summary: Historial de pagos
 *     description: Obtiene el historial completo de pagos. Requiere rol de operador o administrador
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, refunded]
 *     responses:
 *       200:
 *         description: Historial de pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *                 pagination:
 *                   type: object
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.get(
  "/history",
  requireOperatorOrAdmin,
  validatePagination,
  getPaymentHistory
);

/**
 * @swagger
 * /payments/statistics:
 *   get:
 *     summary: Estadísticas de pagos
 *     description: Obtiene estadísticas y métricas sobre los pagos. Requiere rol de operador o administrador
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   description: Ingresos totales
 *                 paymentsByMethod:
 *                   type: object
 *                   description: Desglose por método de pago
 *                 paymentsByStatus:
 *                   type: object
 *                   description: Desglose por estado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.get("/statistics", requireOperatorOrAdmin, getPaymentStatistics);

export default router;
