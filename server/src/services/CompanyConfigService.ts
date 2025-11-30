import mongoose from "mongoose";
import { CompanyConfig, ICompanyConfig } from "../models/CompanyConfig.js";
import { logger } from "../utils/logger.js";

/**
 * Servicio para gestionar la configuración de la empresa
 * Proporciona métodos para CRUD y gestión de configuración activa
 */
export class CompanyConfigService {
  /**
   * Obtener la configuración activa de la empresa
   * @returns La configuración activa o null si no existe
   */
  static async getActiveConfig(): Promise<ICompanyConfig | null> {
    try {
      return await CompanyConfig.getActiveConfig();
    } catch (error) {
      logger.error("Error al obtener configuración activa:", error);
      return null;
    }
  }

  /**
   * Crear nueva configuración de empresa
   * Desactiva automáticamente las configuraciones anteriores
   * @param configData - Datos de la nueva configuración
   * @returns La configuración creada
   */
  static async createConfig(
    configData: Partial<ICompanyConfig>
  ): Promise<ICompanyConfig> {
    try {
      // desactivar las configuraciones anteriores
      await CompanyConfig.updateMany(
        { isActive: true },
        { $set: { isActive: false } }
      );

      configData.isActive = true;
      const newConfig = new CompanyConfig(configData);
      await newConfig.save();

      logger.success(`Nueva configuración creada: ${configData.companyName}`);
      return newConfig;
    } catch (error) {
      logger.error("Error al crear configuración:", error);
      throw new Error("No se pudo crear la configuración de la empresa");
    }
  }

  /**
   * Actualizar configuración existente
   * @param configId - ID de la configuración a actualizar
   * @param updateData - Datos a actualizar
   * @returns La configuración actualizada
   */
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
        throw new Error("Configuración no encontrada en la base de datos");
      }

      logger.success(`Configuración actualizada: ${updatedConfig.companyName}`);
      return updatedConfig;
    } catch (error) {
      logger.error("Error al actualizar configuración:", error);
      throw new Error("No se pudo actualizar la configuración");
    }
  }

  /**
   * Desactivar configuración (borrado lógico)
   * @param configId - ID de la configuración a desactivar
   * @returns true si se desactivó correctamente
   */
  static async deleteConfig(configId: string): Promise<boolean> {
    try {
      const result = await CompanyConfig.findByIdAndUpdate(
        configId,
        { $set: { isActive: false } },
        { new: true }
      );

      logger.info(`Configuración desactivada: ${configId}`);
      return !!result;
    } catch (error) {
      logger.error("Error al desactivar configuración:", error);
      throw new Error("No se pudo desactivar la configuración");
    }
  }

  /**
   * Obtener información pública de la empresa
   * @returns Información pública o null si no hay configuración activa
   */
  static async getPublicInfo(): Promise<any> {
    try {
      const config = await CompanyConfig.getActiveConfig();
      return config ? config.getPublicInfo() : null;
    } catch (error) {
      logger.error("Error al obtener información pública:", error);
      return null;
    }
  }

  /**
   * Inicializar configuración por defecto si no existe ninguna
   * @returns La configuración por defecto creada o la existente
   */
  static async initializeDefault(): Promise<ICompanyConfig> {
    try {
      const existingConfig = await CompanyConfig.findOne({ isActive: true });

      if (existingConfig) {
        logger.info("Ya existe una configuración activa");
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

      logger.success("Configuración por defecto creada correctamente");
      return newConfig;
    } catch (error) {
      logger.error("Error al inicializar configuración por defecto:", error);
      throw new Error("No se pudo inicializar la configuración");
    }
  }
}
