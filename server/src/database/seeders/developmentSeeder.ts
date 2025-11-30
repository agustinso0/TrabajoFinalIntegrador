// Seeder para desarrollo - carga datos iniciales del sistema
import { logger } from "../../utils/logger.js";

// Importar migraciones en orden
import { up as crearUsuarios } from "../migrations/001-create-users.js";
import { up as crearVehiculos } from "../migrations/002-create-vehicles.js";
import { up as crearRutas } from "../migrations/003-create-scheduled-routes.js";
import { up as crearServicios } from "../migrations/004-create-route-instances.js";
import { up as configurarEmpresa } from "../migrations/005-create-company-config.js";
import { up as crearReservas } from "../migrations/006-create-reservations-payments.js";

export const seedDatabase = async () => {
  try {
    logger.info("Inicializando base de datos de desarrollo...");

    // Ejecutar migraciones en el orden correcto
    await crearUsuarios();
    await crearVehiculos();
    await crearRutas();
    await crearServicios();
    await configurarEmpresa();
    await crearReservas();

    logger.info("Base de datos inicializada correctamente!");
    console.log("\n===========================================");
    console.log("           SISTEMA TRANSPORTEUNI");
    console.log("===========================================");
    console.log("Empresa: TransporteUNI S.A.");
    console.log("\nUsuarios del sistema:");
    console.log("   • admin@transporteuni.com / admin123 (Administrador)");
    console.log("   • j.perez@transporteuni.com / operador456 (Operador)");
    console.log("   • c.gomez@transporteuni.com / chofer789 (Chofer)");
    console.log("   • ana.martinez@gmail.com / cliente123 (Pasajero)");
    console.log("   • testuser@gmail.com / test123 (Pasajero)");
    console.log("\nFlota: AB123CD, EF456GH, IJ789KL, MN012OP");
    console.log("Rutas configuradas: Buenos Aires-Rosario, Cordoba, etc.");
    console.log("Reservas de ejemplo creadas");
    console.log("Pagos de prueba asociados");
    console.log("===========================================");
  } catch (error) {
    logger.error("Error inicializando base de datos:", error);
    throw error;
  }
};
