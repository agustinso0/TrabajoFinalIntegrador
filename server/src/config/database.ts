import mongoose from "mongoose";

// configuracion de conexion a mongo
const MONGO_OPTIONS = {
  bufferCommands: false,
  maxPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
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
    console.log(`🏢 ${process.env.COMPANY_NAME || "Default"}`);

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
