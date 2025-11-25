import mongoose from "mongoose";
import { CompanyConfig, ICompanyConfig } from "../models/CompanyConfig.js";
import { logger } from "../utils/logger.js";

export class CompanyConfigService {
  // traer config activa
  static async getActiveConfig(): Promise<ICompanyConfig | null> {
    try {
      return await CompanyConfig.getActiveConfig();
    } catch (error) {
      logger.error("Error al obtener configuración activa:", error);
      return null;
    }
  }

  // crear nueva config
  static async createConfig(
    configData: Partial<ICompanyConfig>
  ): Promise<ICompanyConfig> {
    try {
      // desactivar las anteriores
      await CompanyConfig.updateMany(
        { isActive: true },
        { $set: { isActive: false } }
      );

      configData.isActive = true;
      const newConfig = new CompanyConfig(configData);
      await newConfig.save();

      logger.info(`Nueva config creada: ${configData.companyName}`);
      return newConfig;
    } catch (error) {
      logger.error("Error al crear configuración:", error);
      throw new Error("No se pudo crear la configuración");
    }
  }

  // actualizar config existente
  static async updateConfig(
    configId: string,
    updateData: Partial<ICompanyConfig>
  ): Promise<ICompanyConfig> {
    try {
      const updatedConfig = await CompanyConfig.findByIdAndUpdate(
        configId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedConfig) {
        throw new Error("Configuración no encontrada");
      }

      logger.info(`Config actualizada: ${updatedConfig.companyName}`);
      return updatedConfig;
    } catch (error) {
      logger.error("Error al actualizar:", error);
      throw new Error("No se pudo actualizar");
    }
  }

  // borrar config
  static async deleteConfig(configId: string): Promise<boolean> {
    try {
      const result = await CompanyConfig.findByIdAndUpdate(
        configId,
        { $set: { isActive: false } },
        { new: true }
      );

      logger.info(`Config eliminada: ${configId}`);
      return !!result;
    } catch (error) {
      logger.error("Error al eliminar:", error);
      throw new Error("No se pudo eliminar");
    }
  }

  // info publica solo
  static async getPublicInfo(): Promise<any> {
    try {
      const config = await CompanyConfig.getActiveConfig();
      return config ? config.getPublicInfo() : null;
    } catch (error) {
      logger.error("Error al obtener info publica:", error);
      return null;
    }
  }

  // crear config default si no hay
  static async initializeDefault(): Promise<ICompanyConfig> {
    try {
      const existingConfig = await CompanyConfig.findOne({ isActive: true });

      if (existingConfig) {
        logger.info("Ya hay una config activa");
        return existingConfig;
      }

      const defaultConfig = {
        companyName: "TransporteUNI S.A.",
        email: "info@transporteuni.com.ar",
        phone: "+54 11 1234-5678",
        address: "Av. Corrientes 1234, Buenos Aires",
        isActive: true,
      };

      const newConfig = new CompanyConfig(defaultConfig);
      await newConfig.save();

      logger.info("Config por defecto creada ok");
      return newConfig;
    } catch (error) {
      logger.error("Error al inicializar config:", error);
      throw new Error("No se pudo inicializar");
    }
  }
}
