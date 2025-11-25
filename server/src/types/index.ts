import { Request } from "express";

// usuario del sistema
export interface IUser {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: "passenger" | "driver" | "operator" | "admin";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// vehiculos/colectivos
export interface IVehicle {
  _id?: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  capacity: number;
  features: string[];
  isActive: boolean;
  driverId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// rutas programadas
export interface IScheduledRoute {
  _id?: string;
  name: string;
  origin: ILocation;
  destination: ILocation;
  description?: string;
  duration: number; // en minutos
  basePrice: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ubicaciones
export interface ILocation {
  address: string;
  city: string;
  province: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// viajes especificos (instancias de rutas)
export interface IRouteInstance {
  _id?: string;
  scheduledRouteId: string;
  vehicleId: string;
  driverId: string;
  departureDate: Date;
  departureTime: string; // formato HH:mm
  arrivalTime?: string;
  currentPrice: number;
  availableSeats: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// reservas de pasajeros
export interface IReservation {
  _id?: string;
  routeInstanceId: string;
  passengerId: string;
  seatNumber?: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalAmount: number;
  paymentStatus: "pending" | "paid";
  paymentMethod: "cash" | "manual";
  specialRequests?: string;
  pickupLocation?: ILocation;
  dropoffLocation?: ILocation;
  createdAt?: Date;
  updatedAt?: Date;
}

// pagos
export interface IPayment {
  _id?: string;
  reservationId: string;
  paymentMethod: "cash" | "manual";
  amount: number;
  currency: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  notes?: string;
  processedAt?: Date;
  processedBy?: string; // ID del operador que proceso el pago
  createdAt?: Date;
  updatedAt?: Date;
}

// request con usuario logueado
export interface AuthenticatedRequest extends Request {
  user?: IUser;
  company?: {
    id: string;
    name: string;
  };
  params: any;
  body: any;
}

// estructura estandar para todas las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
