// script para manejar migraciones y datos de prueba
import dotenv from "dotenv";
dotenv.config();

import connectDB, { disconnectDB } from "../config/database.js";
import { seedDatabase } from "./seeders/developmentSeeder.js";
import { cleanDatabase, cleanAll } from "./seeders/cleanSeeder.js";

const runCommand = async (command: string) => {
  try {
    await connectDB();

    switch (command) {
      case "seed":
        await seedDatabase();
        break;

      case "clean":
        await cleanDatabase();
        break;

      case "reset":
        await cleanAll();
        await seedDatabase();
        break;

      case "clean-all":
        await cleanAll();
        break;

      default:
        console.log("📝 Comandos disponibles:");
        console.log("- seed: Llenar BD con datos de prueba");
        console.log("- clean: Limpiar datos de prueba");
        console.log("- reset: Borrar todo y volver a llenar");
        console.log("- clean-all: Borrar absolutamente todo");
        break;
    }
  } catch (error) {
    console.error("❌ Error ejecutando comando:", error);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

// ejecutar desde linea de comandos
const command = process.argv[2];
runCommand(command);
