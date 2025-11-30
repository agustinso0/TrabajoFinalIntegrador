import { Request, Response } from "express";
import { CompanyConfigService } from "../services/CompanyConfigService.js";
import { logger } from "../utils/logger.js";

export class CompanyConfigController {
  // info publica de la empresa
  static async getPublicInfo(req: Request, res: Response) {
    try {
      const config = await CompanyConfigService.getPublicInfo();

      res.status(200).json({
        success: true,
        data: config || {
          companyName: "TransporteUNI S.A.",
          email: "info@transporteuni.com.ar",
          phone: "+54 11 1234-5678",
          address: "Av. Corrientes 1234, Buenos Aires",
        },
      });
    } catch (error) {
      logger.error("Error en getPublicInfo:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener información de la empresa",
      });
    }
  }

  // config completa (solo admins)
  static async getConfig(req: Request, res: Response) {
    try {
      const config = await CompanyConfigService.getActiveConfig();

      if (!config) {
        return res.status(404).json({
          success: false,
          message: "No se encontró configuración activa",
        });
      }

      res.status(200).json({
        success: true,
        data: config,
      });
    } catch (error) {
      logger.error("Error en getConfig:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener configuración",
      });
    }
  }

  // crear nueva config
  static async createConfig(req: Request, res: Response) {
    try {
      const configData = req.body;
      const newConfig = await CompanyConfigService.createConfig(configData);

      res.status(201).json({
        success: true,
        message: "Configuración creada exitosamente",
        data: newConfig,
      });
    } catch (error) {
      logger.error("Error en createConfig:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear configuración",
      });
    }
  }

  // actualizar config existente
  static async updateConfig(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedConfig = await CompanyConfigService.updateConfig(
        id,
        updateData
      );

      res.status(200).json({
        success: true,
        message: "Configuración actualizada exitosamente",
        data: updatedConfig,
      });
    } catch (error) {
      logger.error("Error en updateConfig:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar configuración",
      });
    }
  }

  // borrar config
  static async deleteConfig(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await CompanyConfigService.deleteConfig(id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Configuración no encontrada",
        });
      }

      res.status(200).json({
        success: true,
        message: "Configuración eliminada exitosamente",
      });
    } catch (error) {
      logger.error("Error en deleteConfig:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar configuración",
      });
    }
  }

  // crear config default
  static async initializeConfig(req: Request, res: Response) {
    try {
      const config = await CompanyConfigService.initializeDefault();

      res.status(200).json({
        success: true,
        message: "Configuración inicializada exitosamente",
        data: config,
      });
    } catch (error) {
      logger.error("Error en initializeConfig:", error);
      res.status(500).json({
        success: false,
        message: "Error al inicializar configuración",
      });
    }
  }
}
