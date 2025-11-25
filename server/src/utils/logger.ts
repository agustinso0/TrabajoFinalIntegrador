// logger casero para el proyecto

class Logger {
  error(message: string, data?: any): void {
    console.error(`❌ ${message}`, data || "");
  }

  warn(message: string, data?: any): void {
    console.warn(`⚠️  ${message}`, data || "");
  }

  info(message: string, data?: any): void {
    console.log(`ℹ️  ${message}`, data || "");
  }

  success(message: string, data?: any): void {
    console.log(`✅ ${message}`, data || "");
  }

  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV !== "production") {
      console.log(`🐛 ${message}`, data || "");
    }
  }
}

export const logger = new Logger();
