import mongoose, { Schema, Document } from "mongoose";

// Constantes de validación
const TIME_FORMAT_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
const MIN_PRICE = 0;
const MIN_SEATS = 0;

// interface para instancias de viajes
export interface IRouteInstanceDocument extends Document {
  scheduledRouteId: any;
  vehicleId: any;
  driverId: any;
  departureDate: Date;
  departureTime: string;
  arrivalTime?: string;
  currentPrice: number;
  availableSeats: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const RouteInstanceSchema = new Schema<IRouteInstanceDocument>(
  {
    scheduledRouteId: {
      type: Schema.Types.ObjectId,
      ref: "ScheduledRoute",
      required: [true, "La ruta programada es requerida"],
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "El vehiculo es requerido"],
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El conductor es requerido"],
    },
    departureDate: {
      type: Date,
      required: [true, "La fecha de partida es requerida"],
    },
    departureTime: {
      type: String,
      required: [true, "La hora de partida es requerida"],
      match: [
        TIME_FORMAT_REGEX,
        "Formato de hora invalido. Debe ser HH:MM (00:00 - 23:59)",
      ],
    },
    arrivalTime: {
      type: String,
      match: [
        TIME_FORMAT_REGEX,
        "Formato de hora invalido. Debe ser HH:MM (00:00 - 23:59)",
      ],
    },
    currentPrice: {
      type: Number,
      required: [true, "El precio actual es requerido"],
      min: [MIN_PRICE, "El precio debe ser mayor o igual a cero"],
    },
    availableSeats: {
      type: Number,
      required: [true, "Los asientos disponibles son requeridos"],
      min: [MIN_SEATS, "Los asientos disponibles no pueden ser negativos"],
    },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "cancelled"],
      default: "scheduled",
    },
    notes: {
      type: String,
      maxlength: [500, "Las notas no pueden exceder 500 caracteres"],
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

// indices para consultas rapidas
RouteInstanceSchema.index({ scheduledRouteId: 1 });
RouteInstanceSchema.index({ vehicleId: 1 });
RouteInstanceSchema.index({ driverId: 1 });
RouteInstanceSchema.index({ departureDate: 1 });
RouteInstanceSchema.index({ status: 1 });
RouteInstanceSchema.index({ availableSeats: 1 });

// indice compuesto para busquedas complejas
RouteInstanceSchema.index({
  departureDate: 1,
  status: 1,
  availableSeats: 1,
});

const RouteInstance = mongoose.model<IRouteInstanceDocument>(
  "RouteInstance",
  RouteInstanceSchema
);

export default RouteInstance;
