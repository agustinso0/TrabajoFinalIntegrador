import express from "express";
import { CompanyConfigController } from "../controllers/CompanyConfigController.js";
import { authenticateToken } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorization.js";
import { validateCompanyConfig } from "../middlewares/validators/companyConfigValidators.js";

const router = express.Router();

// rutas que puede ver cualquiera
router.get("/public", CompanyConfigController.getPublicInfo);

// rutas solo para admins
router.get(
  "/",
  authenticateToken,
  authorize("admin"),
  CompanyConfigController.getConfig
);

router.post(
  "/",
  authenticateToken,
  authorize("admin"),
  validateCompanyConfig,
  CompanyConfigController.createConfig
);

router.put(
  "/:id",
  authenticateToken,
  authorize("admin"),
  validateCompanyConfig,
  CompanyConfigController.updateConfig
);

router.delete(
  "/:id",
  authenticateToken,
  authorize("admin"),
  CompanyConfigController.deleteConfig
);

router.post(
  "/initialize",
  authenticateToken,
  authorize("admin"),
  CompanyConfigController.initializeConfig
);

export default router;
