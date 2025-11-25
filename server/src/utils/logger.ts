// logger personalizado para el proyecto con emojis para mejor visualizacion

// constantes de configuracion
const PRODUCTION_ENV = "production";
const EMPTY_DATA = "";

/**
 * Clase Logger para registrar mensajes con diferentes niveles de importancia
 * Utiliza emojis para facilitar la identificacion visual del tipo de mensaje
 */
class Logger {
  /**
   * Registrar error critico
   * @param message - Mensaje descriptivo del error
   * @param data - Datos adicionales opcionales del error
   */
  error(message: string, data?: any): void {
    console.error(`❌ [ERROR] ${message}`, data || EMPTY_DATA);
  }

  /**
   * Registrar advertencia
   * @param message - Mensaje de advertencia
   * @param data - Datos adicionales opcionales
   */
  warn(message: string, data?: any): void {
    console.warn(`⚠️  [WARN] ${message}`, data || EMPTY_DATA);
  }

  /**
   * Registrar informacion general
   * @param message - Mensaje informativo
   * @param data - Datos adicionales opcionales
   */
  info(message: string, data?: any): void {
    console.log(`ℹ️  [INFO] ${message}`, data || EMPTY_DATA);
  }

  /**
   * Registrar operacion exitosa
   * @param message - Mensaje de exito
   * @param data - Datos adicionales opcionales
   */
  success(message: string, data?: any): void {
    console.log(`✅ [SUCCESS] ${message}`, data || EMPTY_DATA);
  }

  /**
   * Registrar mensaje de depuracion (solo en desarrollo)
   * @param message - Mensaje de debug
   * @param data - Datos adicionales opcionales
   */
  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV !== PRODUCTION_ENV) {
      console.log(`🐛 [DEBUG] ${message}`, data || EMPTY_DATA);
    }
  }
}

// instancia singleton del logger
export const logger = new Logger();
