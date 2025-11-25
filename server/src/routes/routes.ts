// rutas publicas para buscar colectivos
import { Router } from "express";
import {
  getAvailableRoutes,
  getRouteById,
  searchRoutes,
  getPopularRoutes,
} from "../controllers/routesController.js";
import { authenticateToken } from "../middlewares/auth.js";
import {
  validateRouteSearch,
  validateObjectIdParam,
  validatePagination,
} from "../middlewares/validators.js";

const router = Router();

/**
 * @swagger
 * /routes:
 *   get:
 *     summary: Obtener rutas disponibles
 *     description: Lista todas las rutas activas con sus horarios y precios
 *     tags: [Rutas]
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         description: Ciudad de origen
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: Ciudad de destino
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha del viaje (YYYY-MM-DD)
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
 *     responses:
 *       200:
 *         description: Lista de rutas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 routes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ScheduledRoute'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       400:
 *         description: Parámetros inválidos
 */
router.get("/", validateRouteSearch, getAvailableRoutes);

/**
 * @swagger
 * /routes/search:
 *   get:
 *     summary: Buscar rutas específicas
 *     description: Busca rutas filtradas por origen, destino y fecha
 *     tags: [Rutas]
 *     parameters:
 *       - in: query
 *         name: origin
 *         required: true
 *         schema:
 *           type: string
 *         description: Ciudad de origen
 *         example: Buenos Aires
 *       - in: query
 *         name: destination
 *         required: true
 *         schema:
 *           type: string
 *         description: Ciudad de destino
 *         example: Córdoba
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha del viaje
 *         example: 2025-12-01
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RouteInstance'
 *       400:
 *         description: Parámetros de búsqueda faltantes o inválidos
 */
router.get("/search", validateRouteSearch, searchRoutes);

/**
 * @swagger
 * /routes/popular:
 *   get:
 *     summary: Obtener rutas populares
 *     description: Lista las rutas más solicitadas por los usuarios
 *     tags: [Rutas]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Cantidad máxima de rutas a retornar
 *     responses:
 *       200:
 *         description: Rutas populares obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ScheduledRoute'
 *                   - type: object
 *                     properties:
 *                       reservationCount:
 *                         type: integer
 *                         description: Cantidad de reservas realizadas
 */
router.get("/popular", validatePagination, getPopularRoutes);

/**
 * @swagger
 * /routes/{id}:
 *   get:
 *     summary: Obtener detalles de una ruta
 *     description: Retorna la información completa de una ruta específica
 *     tags: [Rutas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la ruta
 *     responses:
 *       200:
 *         description: Detalles de la ruta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduledRoute'
 *       404:
 *         description: Ruta no encontrada
 */
router.get("/:id", validateObjectIdParam("id"), getRouteById);

export default router;
