// rutas para manejo de usuarios y auth
import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/security.js";
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
} from "../middlewares/validators.js";

const router = Router();

// rutas que no necesitan login
router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);

// rutas que si necesitan estar logueado
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, validateUpdateProfile, updateProfile);
router.put(
  "/change-password",
  authenticateToken,
  validateChangePassword,
  changePassword
);
router.post("/refresh-token", authenticateToken, refreshToken);

export default router;
