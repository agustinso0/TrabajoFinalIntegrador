import mongoose from "mongoose";

// constantes de configuracion de MongoDB
const DEFAULT_MAX_POOL_SIZE = 5;
const DEFAULT_SERVER_SELECTION_TIMEOUT = 5000;
const DEFAULT_SOCKET_TIMEOUT = 30000;
const DEFAULT_COMPANY_NAME = "Sistema de Reservas";

// configuracion de conexion a mongo
const MONGO_OPTIONS = {
  bufferCommands: false,
  maxPoolSize: DEFAULT_MAX_POOL_SIZE,
  serverSelectionTimeoutMS: DEFAULT_SERVER_SELECTION_TIMEOUT,
  socketTimeoutMS: DEFAULT_SOCKET_TIMEOUT,
};

// conectar con mongo
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI no encontrada en .env");
    }

    // TODO: revisar si necesitamos mas configuracion para produccion
    await mongoose.connect(mongoURI, MONGO_OPTIONS);

    console.log(`🚀 MongoDB conectado: ${mongoose.connection.host}`);
    console.log(`📁 Base de datos: ${mongoose.connection.name}`);
    console.log(`🏢 ${process.env.COMPANY_NAME || DEFAULT_COMPANY_NAME}`);

    // eventos de conexion
    mongoose.connection.on("error", (err) => {
      console.error("❌ Error de MongoDB:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("👋 MongoDB desconectado");
    });
  } catch (error) {
    console.error("No se pudo conectar a MongoDB:", error);
    process.exit(1);
  }
};

// cerrar conexion
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("👋 MongoDB desconectado ok");
  } catch (error) {
    console.error("❌ Error al desconectar:", error);
  }
};

export default connectDB;
