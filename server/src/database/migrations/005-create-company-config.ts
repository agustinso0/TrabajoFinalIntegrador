// Migracion 005: Configuracion inicial de la empresa
// Datos corporativos y de contacto
import { CompanyConfigService } from "../../services/CompanyConfigService.js";

export const up = async () => {
  console.log("Configurando datos de la empresa...");

  try {
    // Verificar si ya tenemos config
    const configExistente = await CompanyConfigService.getActiveConfig();

    if (configExistente) {
      console.log("[OK] Configuracion ya existe, omitiendo...");
      return;
    }

    // Datos reales de la empresa
    const datosEmpresa = {
      companyName: "TransporteUNI S.A.",
      email: "contacto@transporteuni.com.ar",
      phone: "+54 11 4567-8900",
      address: "Av. Rivadavia 2847, CABA, Buenos Aires",
    };

    await CompanyConfigService.createConfig(datosEmpresa);
    console.log("[OK] Configuracion de empresa guardada!");
  } catch (error) {
    console.error("Error configurando empresa:", error);
    throw error;
  }
};

export const down = async () => {
  console.log("Rollback: eliminando configuracion de empresa...");

  try {
    const config = await CompanyConfigService.getActiveConfig();

    if (config) {
      await CompanyConfigService.deleteConfig(config._id.toString());
      console.log("[OK] Configuracion eliminada");
    } else {
      console.log("[SKIP] No hay configuracion que eliminar");
    }
  } catch (error) {
    console.error("Error en rollback de configuracion:", error);
    throw error;
  }
};
