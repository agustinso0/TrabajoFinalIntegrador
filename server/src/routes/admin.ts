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

/**
 * @swagger
 * /admin/summary:
 *   get:
 *     summary: Resumen del sistema
 *     description: Obtiene un resumen general con métricas clave del sistema. Requiere rol de operador o administrador
 *     tags: [Administración]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ApiKeyHeader'
 *     responses:
 *       200:
 *         description: Resumen obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   description: Total de usuarios registrados
 *                 totalReservations:
 *                   type: integer
 *                   description: Total de reservas realizadas
 *                 activeRoutes:
 *                   type: integer
 *                   description: Rutas activas en el sistema
 *                 revenue:
 *                   type: number
 *                   description: Ingresos totales
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.get("/summary", requireOperator, getBasicSummary);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Lista de usuarios
 *     description: Obtiene la lista completa de usuarios del sistema. Requiere rol de operador o administrador
 *     tags: [Administración]
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
 *         name: role
 *         schema:
 *           type: string
 *           enum: [passenger, operator, admin]
 *         description: Filtrar por rol
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.get("/users", requireOperator, validatePagination, getUsersList);

/**
 * @swagger
 * /admin/reservations/recent:
 *   get:
 *     summary: Reservas recientes
 *     description: Lista las reservas más recientes del sistema. Requiere rol de operador o administrador
 *     tags: [Administración]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ApiKeyHeader'
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Cantidad de reservas a retornar
 *     responses:
 *       200:
 *         description: Lista de reservas recientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.get(
  "/reservations/recent",
  requireOperator,
  validatePagination,
  getRecentReservations
);

/**
 * @swagger
 * /admin/system-status:
 *   get:
 *     summary: Estado del sistema
 *     description: Obtiene información sobre el estado actual del sistema. Requiere rol de operador o administrador
 *     tags: [Administración]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ApiKeyHeader'
 *     responses:
 *       200:
 *         description: Estado del sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 database:
 *                   type: string
 *                   enum: [connected, disconnected]
 *                 uptime:
 *                   type: string
 *                   description: Tiempo que lleva el servidor activo
 *                 version:
 *                   type: string
 *                   description: Versión del API
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.get("/system-status", requireOperator, getSystemStatus);

export default router;
