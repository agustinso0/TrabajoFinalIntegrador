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

// hacer nueva reserva
router.post(
  "/",
  requirePassenger,
  createLimiter,
  validateCreateReservation,
  createReservation
);

// ver mis reservas
router.get("/my-reservations", validatePagination, getUserReservations);

// ver todas las reservas (admins)
router.get("/", requireOperator, validatePagination, getAllReservations);

// ver una reserva
router.get("/:id", validateObjectIdParam("id"), getReservationById);

// editar reserva
router.put("/:id", validateObjectIdParam("id"), updateReservation);

// cancelar reserva
router.patch("/:id/cancel", validateObjectIdParam("id"), cancelReservation);

export default router;
