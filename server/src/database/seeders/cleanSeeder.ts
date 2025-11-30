// Seeder de limpieza - elimina todos los datos de desarrollo
import { logger } from "../../utils/logger.js";

// Importar funciones de rollback
import { down as eliminarUsuarios } from "../migrations/001-create-users.js";
import { down as eliminarVehiculos } from "../migrations/002-create-vehicles.js";
import { down as eliminarRutas } from "../migrations/003-create-scheduled-routes.js";
import { down as eliminarServicios } from "../migrations/004-create-route-instances.js";
import { down as eliminarConfigEmpresa } from "../migrations/005-create-company-config.js";
import { down as eliminarReservas } from "../migrations/006-create-reservations-payments.js";

// modelos para borrar todo
import User from "../../models/User.js";
import Vehicle from "../../models/Vehicle.js";
import ScheduledRoute from "../../models/ScheduledRoute.js";
import RouteInstance from "../../models/RouteInstance.js";
import Reservation from "../../models/Reservation.js";
import Payment from "../../models/Payment.js";

export const cleanDatabase = async () => {
  try {
    logger.info("Iniciando limpieza de base de datos...");

    // Eliminar datos en orden inverso (por las dependencias)
    await eliminarReservas();
    await eliminarServicios();
    await eliminarRutas();
    await eliminarVehiculos();
    await eliminarUsuarios();
    await eliminarConfigEmpresa();

    logger.info("Base de datos limpiada exitosamente");
    console.log("Todos los datos de desarrollo eliminados");
  } catch (error) {
    logger.error("Error durante la limpieza:", error);
    throw error;
  }
};

export const cleanAll = async () => {
  try {
    logger.info("LIMPIEZA TOTAL - BORRANDO TODO...");

    // Borrar absolutamente todas las colecciones
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await ScheduledRoute.deleteMany({});
    await RouteInstance.deleteMany({});
    await Reservation.deleteMany({});
    await Payment.deleteMany({});

    logger.info("Limpieza total completada");
    console.log("ATENCION: Base de datos completamente vacia");
  } catch (error) {
    logger.error("Error en limpieza total:", error);
    throw error;
  }
};
