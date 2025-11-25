import mongoose, { Schema, Document } from "mongoose";

// constantes de validación
const MIN_SEAT_NUMBER = 1;
const MIN_TOTAL_AMOUNT = 0;
const MAX_SPECIAL_REQUESTS_LENGTH = 500;

// interface para las reservas
export interface IReservationDocument extends Document {
  routeInstanceId: string;
  passengerId: string;
  seatNumber?: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod: "cash" | "manual";
  specialRequests?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReservationSchema = new Schema<IReservationDocument>(
  {
    routeInstanceId: {
      type: String,
      required: [true, "La instancia de ruta es requerida"],
    },
    passengerId: {
      type: String,
      required: [true, "El pasajero es requerido"],
    },
    seatNumber: {
      type: Number,
      min: [MIN_SEAT_NUMBER, `El número de asiento debe ser al menos ${MIN_SEAT_NUMBER}`],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: [true, "El monto total es requerido"],
      min: [MIN_TOTAL_AMOUNT, "El monto debe ser positivo o cero"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "manual"],
      required: [true, "El metodo de pago es requerido"],
    },
    specialRequests: {
      type: String,
      maxlength: [
        MAX_SPECIAL_REQUESTS_LENGTH,
        `Los requerimientos especiales no pueden exceder ${MAX_SPECIAL_REQUESTS_LENGTH} caracteres`,
      ],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// indices para buscar mas rapido
ReservationSchema.index({ routeInstanceId: 1 });
ReservationSchema.index({ passengerId: 1 });
ReservationSchema.index({ status: 1 });
ReservationSchema.index({ createdAt: -1 });

const Reservation = mongoose.model<IReservationDocument>(
  "Reservation",
  ReservationSchema
);

export default Reservation;
