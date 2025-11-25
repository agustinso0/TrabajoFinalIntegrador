import mongoose, { Schema, Document } from "mongoose";

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
      min: [1, "El numero de asiento debe ser mayor a 0"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: [true, "El monto total es requerido"],
      min: [0, "El monto total debe ser mayor a 0"],
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
        500,
        "Los requerimientos especiales no pueden exceder 500 caracteres",
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
