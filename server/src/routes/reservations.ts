// rutas para las reservas
import { Router } from "express";
import {
  createReservation,
  getUserReservations,
  getReservationById,
  cancelReservation,
  updateReservation,
  getAllReservations,
} from "../controllers/reservationsController.js";
import { authenticateToken } from "../middlewares/auth.js";
import {
  requirePassenger,
  requireOperator,
  requireOwnershipOrAdmin,
} from "../middlewares/authorization.js";
import { createLimiter } from "../middlewares/security.js";
import {
  validateCreateReservation,
  validateObjectIdParam,
  validatePagination,
} from "../middlewares/validators.js";

const router = Router();

// todo necesita estar logueado
router.use(authenticateToken);

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Crear nueva reserva
 *     description: Permite a un usuario registrado crear una reserva de pasaje
 *     tags: [Reservas]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routeInstanceId
 *               - paymentMethod
 *             properties:
 *               routeInstanceId:
 *                 type: string
 *                 description: ID de la instancia de ruta
 *                 example: 507f1f77bcf86cd799439011
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, manual]
 *                 description: Método de pago
 *               specialRequests:
 *                 type: string
 *                 description: Comentarios del pasajero (opcional)
 *               pickupLocation:
 *                 type: string
 *                 description: Punto de retiro (opcional)
 *               dropoffLocation:
 *                 type: string
 *                 description: Punto de descenso (opcional)
 *     parameters:
 *       - $ref: '#/components/parameters/ApiKeyHeader'
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva creada correctamente
 *                 reservation:
 *                   $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Datos inválidos o asientos no disponibles
 *       401:
 *         description: No autorizado
 *       409:
 *         description: Los asientos ya están reservados
 */
router.post(
  "/",
  requirePassenger,
  createLimiter,
  validateCreateReservation,
  createReservation
);

/**
 * @swagger
 * /reservations/my-reservations:
 *   get:
 *     summary: Obtener reservas del usuario
 *     description: Lista todas las reservas realizadas por el usuario autenticado
 *     tags: [Reservas]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ApiKeyHeader'
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *         description: Filtrar por estado de la reserva
 *     responses:
 *       200:
 *         description: Lista de reservas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: No autorizado
 */
router.get("/my-reservations", validatePagination, getUserReservations);

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Obtener todas las reservas (Admin/Operador)
 *     description: Lista todas las reservas del sistema. Requiere rol de operador o administrador
 *     tags: [Reservas]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ApiKeyHeader'
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
 *           enum: [pending, confirmed, cancelled]
 *     responses:
 *       200:
 *         description: Lista de todas las reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *                 pagination:
 *                   type: object
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.get("/", requireOperator, validatePagination, getAllReservations);

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Obtener detalles de una reserva
 *     description: Retorna la información completa de una reserva específica
 *     tags: [Reservas]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ApiKeyHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Detalles de la reserva
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reserva no encontrada
 *       401:
 *         description: No autorizado
 */
router.get("/:id", validateObjectIdParam("id"), getReservationById);

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Actualizar una reserva
 *     description: Modifica los datos de una reserva existente
 *     tags: [Reservas]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ApiKeyHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatNumbers:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Nuevos números de asientos
 *     responses:
 *       200:
 *         description: Reserva actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reservation:
 *                   $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Reserva no encontrada
 *       401:
 *         description: No autorizado
 */
router.put("/:id", validateObjectIdParam("id"), updateReservation);

/**
 * @swagger
 * /reservations/{id}/cancel:
 *   patch:
 *     summary: Cancelar una reserva
 *     description: Cancela una reserva existente y libera los asientos
 *     tags: [Reservas]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ApiKeyHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva a cancelar
 *     responses:
 *       200:
 *         description: Reserva cancelada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva cancelada correctamente
 *                 reservation:
 *                   $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: La reserva no puede ser cancelada
 *       404:
 *         description: Reserva no encontrada
 *       401:
 *         description: No autorizado
 */
router.patch("/:id/cancel", validateObjectIdParam("id"), cancelReservation);

export default router;
