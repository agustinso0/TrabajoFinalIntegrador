import mongoose, { Schema, Document } from "mongoose";
import { IScheduledRoute, ILocation } from "../types";

// Constantes de límites de longitud
const MAX_ADDRESS_LENGTH = 200;
const MAX_CITY_LENGTH = 100;
const MAX_PROVINCE_LENGTH = 100;
const MAX_COUNTRY_LENGTH = 100;

// interface para rutas programadas
export interface IScheduledRouteDocument
  extends Omit<IScheduledRoute, "_id">,
    Document {}

const LocationSchema = new Schema<ILocation>(
  {
    address: {
      type: String,
      required: [true, "La direccion es requerida"],
      trim: true,
      maxlength: [MAX_ADDRESS_LENGTH, `La direccion no puede exceder ${MAX_ADDRESS_LENGTH} caracteres`],
    },
    city: {
      type: String,
      required: [true, "La ciudad es requerida"],
      trim: true,
      maxlength: [MAX_CITY_LENGTH, `La ciudad no puede exceder ${MAX_CITY_LENGTH} caracteres`],
    },
    province: {
      type: String,
      required: [true, "La provincia es requerida"],
      trim: true,
      maxlength: [MAX_PROVINCE_LENGTH, `La provincia no puede exceder ${MAX_PROVINCE_LENGTH} caracteres`],
    },
    country: {
      type: String,
      required: [true, "El pais es requerido"],
      trim: true,
      default: "Argentina",
      maxlength: [MAX_COUNTRY_LENGTH, `El pais no puede exceder ${MAX_COUNTRY_LENGTH} caracteres`],
    },
    coordinates: {
      lat: {
        type: Number,
        min: [-90, "Latitud invalida"],
        max: [90, "Latitud invalida"],
      },
      lng: {
        type: Number,
        min: [-180, "Longitud invalida"],
        max: [180, "Longitud invalida"],
      },
    },
  },
  { _id: false }
);

const ScheduledRouteSchema = new Schema<IScheduledRouteDocument>(
  {
    name: {
      type: String,
      required: [true, "El nombre de la ruta es requerido"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    origin: {
      type: LocationSchema,
      required: [true, "El origen es requerido"],
    },
    destination: {
      type: LocationSchema,
      required: [true, "El destino es requerido"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "La descripcion no puede exceder 500 caracteres"],
    },
    duration: {
      type: Number,
      required: [true, "La duracion es requerida"],
      min: [15, "La duracion minima es 15 minutos"],
      max: [1440, "La duracion maxima es 24 horas"], // 24 horas en minutos
    },
    basePrice: {
      type: Number,
      required: [true, "El precio base es requerido"],
      min: [0, "El precio debe ser positivo"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// indices para busquedas
ScheduledRouteSchema.index({ name: 1 });
ScheduledRouteSchema.index({ isActive: 1 });
ScheduledRouteSchema.index({ "origin.city": 1, "destination.city": 1 });
ScheduledRouteSchema.index({ basePrice: 1 });

ScheduledRouteSchema.pre("save", function (next) {
  if (
    this.origin.address === this.destination.address &&
    this.origin.city === this.destination.city
  ) {
    return next(new Error("El origen y destino no pueden ser iguales"));
  }
  next();
});

ScheduledRouteSchema.virtual("fullRoute").get(function () {
  return `${this.origin.city} - ${this.destination.city}`;
});

ScheduledRouteSchema.virtual("formattedPrice").get(function () {
  return `$${this.basePrice.toFixed(2)}`;
});

export default mongoose.model<IScheduledRouteDocument>(
  "ScheduledRoute",
  ScheduledRouteSchema
);
