// funciones utiles para todo el proyecto

// Constantes de configuración
const DEFAULT_LOCALE = "es-AR";
const DEFAULT_CURRENCY = "ARS";
const MAX_STRING_LENGTH = 500;
const EARTH_RADIUS_KM = 6371;
const WEEKEND_DAYS = [0, 6]; // Domingo y Sábado
const DEFAULT_BUSINESS_START = "09:00";
const DEFAULT_BUSINESS_END = "18:00";

// formatear moneda con configuración regional argentina
export const formatCurrency = (
  amount: number,
  currency: string = DEFAULT_CURRENCY
): string => {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// formatear fecha en formato argentino (DD/MM/YYYY)
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(DEFAULT_LOCALE, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// formatear fecha y hora completa en formato argentino
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(DEFAULT_LOCALE, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// formatear hora en formato HH:MM de 24 horas
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

// calcular edad en años a partir de fecha de nacimiento
export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

// generar identificadores únicos alfanuméricos
export const generateId = (prefix: string = ""): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}${timestamp}${random}`.toUpperCase();
};

// generar código de reserva con prefijo RES-
export const generateReservationCode = (): string => {
  return generateId("RES-");
};

// generar referencia de pago con prefijo PAY-
export const generatePaymentReference = (): string => {
  return generateId("PAY-");
};

// convertir texto a formato slug (url-friendly)
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// validar formato de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// validar formato de teléfono (permite formato internacional)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone);
};

// sanitizar cadenas de texto eliminando caracteres peligrosos
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, "").slice(0, MAX_STRING_LENGTH);
};

// parsear valor de query string a entero
export const parseQueryInt = (value: any, defaultValue: number = 0): number => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// parsear valor de query string a decimal
export const parseQueryFloat = (
  value: any,
  defaultValue: number = 0
): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// parsear fecha desde query string, retorna null si es inválida
export const parseQueryDate = (value: any): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

// obtener rango de fechas según período especificado
export const getDateRange = (
  period: "today" | "week" | "month" | "year" | "custom",
  startDate?: Date,
  endDate?: Date
): { start: Date; end: Date } => {
  const now = new Date();
  let start: Date;
  let end: Date = new Date(now);

  switch (period) {
    case "today":
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date(now.setHours(23, 59, 59, 999));
      break;
    case "week":
      start = new Date(now.setDate(now.getDate() - now.getDay()));
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
      end.setHours(23, 59, 59, 999);
      break;
    case "custom":
      start = startDate || new Date(now.setDate(now.getDate() - 30));
      end = endDate || new Date();
      break;
    default:
      start = new Date(now.setDate(now.getDate() - 30));
      end = new Date();
  }

  return { start, end };
};

// calcular distancia entre dos puntos geográficos usando fórmula de Haversine
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = EARTH_RADIUS_KM;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// verificar si una fecha es día hábil (lunes a viernes)
export const isBusinessDay = (date: Date): boolean => {
  const day = date.getDay();
  return !WEEKEND_DAYS.includes(day);
};

// agregar días hábiles a una fecha, excluyendo fines de semana
export const addBusinessDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  let addedDays = 0;

  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result)) {
      addedDays++;
    }
  }

  return result;
};

// obtener horario comercial desde variables de entorno o valores por defecto
export const getBusinessHours = (): { start: string; end: string } => {
  return {
    start: process.env.BUSINESS_HOURS_START || DEFAULT_BUSINESS_START,
    end: process.env.BUSINESS_HOURS_END || DEFAULT_BUSINESS_END,
  };
};

// verificar si una hora está dentro del horario comercial
export const isWithinBusinessHours = (time: string): boolean => {
  const { start, end } = getBusinessHours();
  return time >= start && time <= end;
};
