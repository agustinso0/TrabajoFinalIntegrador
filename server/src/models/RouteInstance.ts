import mongoose, { Schema, Document } from "mongoose";

// interface para instancias de viajes
export interface IRouteInstanceDocument extends Document {
  scheduledRouteId: string;
  vehicleId: string;
  driverId: string;
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
      type: String,
      required: [true, "La ruta programada es requerida"],
    },
    vehicleId: {
      type: String,
      required: [true, "El vehiculo es requerido"],
    },
    driverId: {
      type: String,
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
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Formato de hora invalido (HH:MM)",
      ],
    },
    arrivalTime: {
      type: String,
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Formato de hora invalido (HH:MM)",
      ],
    },
    currentPrice: {
      type: Number,
      required: [true, "El precio actual es requerido"],
      min: [0, "El precio debe ser mayor a 0"],
    },
    availableSeats: {
      type: Number,
      required: [true, "Los asientos disponibles son requeridos"],
      min: [0, "Los asientos disponibles deben ser mayor o igual a 0"],
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
