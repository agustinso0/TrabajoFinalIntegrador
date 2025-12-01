import express from "express";
import { CompanyConfigController } from "../controllers/CompanyConfigController.js";
import { authenticateToken } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorization.js";
import { validateCompanyConfig } from "../middlewares/validators/companyConfigValidators.js";

const router = express.Router();

/**
 * @swagger
 * /config/public:
 *   get:
 *     summary: Obtener información pública de la empresa
 *     description: Retorna información general de la empresa sin necesidad de autenticación
 *     tags: [Configuración]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - $ref: '#/components/parameters/ApiKeyHeader'
 *     responses:
 *       200:
 *         description: Información pública de la empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companyName:
 *                   type: string
 *                   example: Transporte Express
 *                 contactEmail:
 *                   type: string
 *                   example: contacto@transporte.com
 *                 contactPhone:
 *                   type: string
 *                   example: +54 9 11 1234-5678
 */
router.get("/public", CompanyConfigController.getPublicInfo);

/**
 * @swagger
 * /config:
 *   get:
 *     summary: Obtener configuración completa
 *     description: Retorna la configuración completa de la empresa. Requiere rol de administrador
 *     tags: [Configuración]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ApiKeyHeader'
 *     responses:
 *       200:
 *         description: Configuración completa
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.get(
  "/",
  authenticateToken,
  authorize("admin"),
  CompanyConfigController.getConfig
);

/**
 * @swagger
 * /config:
 *   post:
 *     summary: Crear nueva configuración
 *     description: Crea una nueva configuración de empresa. Requiere rol de administrador
 *     tags: [Configuración]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ApiKeyHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Configuración creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.post(
  "/",
  authenticateToken,
  authorize("admin"),
  validateCompanyConfig,
  CompanyConfigController.createConfig
);

/**
 * @swagger
 * /config/{id}:
 *   put:
 *     summary: Actualizar configuración
 *     description: Actualiza la configuración existente de la empresa. Requiere rol de administrador
 *     tags: [Configuración]
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
 *         description: ID de la configuración
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Configuración actualizada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.put(
  "/:id",
  authenticateToken,
  authorize("admin"),
  validateCompanyConfig,
  CompanyConfigController.updateConfig
);

/**
 * @swagger
 * /config/{id}:
 *   delete:
 *     summary: Eliminar configuración
 *     description: Elimina la configuración de la empresa. Requiere rol de administrador
 *     tags: [Configuración]
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
 *         description: ID de la configuración
 *     responses:
 *       200:
 *         description: Configuración eliminada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.delete(
  "/:id",
  authenticateToken,
  authorize("admin"),
  CompanyConfigController.deleteConfig
);

/**
 * @swagger
 * /config/initialize:
 *   post:
 *     summary: Inicializar configuración por defecto
 *     description: Crea la configuración inicial del sistema. Requiere rol de administrador
 *     tags: [Configuración]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ApiKeyHeader'
 *     responses:
 *       201:
 *         description: Configuración inicializada correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.post(
  "/initialize",
  authenticateToken,
  authorize("admin"),
  CompanyConfigController.initializeConfig
);

export default router;
