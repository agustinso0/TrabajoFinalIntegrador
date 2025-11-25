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

// estas las puede usar cualquiera (no necesitan login)
router.get("/", validateRouteSearch, getAvailableRoutes);
router.get("/search", validateRouteSearch, searchRoutes);
router.get("/popular", validatePagination, getPopularRoutes);
router.get("/:id", validateObjectIdParam("id"), getRouteById);

export default router;
