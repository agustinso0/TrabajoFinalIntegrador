import mongoose, { Schema, Document } from "mongoose";

// Constantes de validación para vehículos
const LICENSE_PLATE_REGEX = /^[A-Z]{2,3}[\d]{3}[A-Z]{0,2}$/;
const MAX_BRAND_LENGTH = 50;
const MAX_MODEL_LENGTH = 50;
const MIN_YEAR = 1990;
const MIN_CAPACITY = 1;
const MAX_CAPACITY = 60;

// interface para vehiculos
export interface IVehicleDocument extends Document {
  licensePlate: string;
  brand: string;
  vehicleModel: string;
  year: number;
  capacity: number;
  features: string[];
  isActive: boolean;
  driverId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const VehicleSchema = new Schema<IVehicleDocument>(
  {
    licensePlate: {
      type: String,
      required: [true, "La patente es requerida"],
      unique: true,
      uppercase: true,
      trim: true,
      match: [LICENSE_PLATE_REGEX, "La patente no tiene formato valido. Debe ser formato argentino (ej: ABC123 o AB123CD)"],
    },
    brand: {
      type: String,
      required: [true, "La marca es requerida"],
      trim: true,
      maxlength: [MAX_BRAND_LENGTH, `La marca no puede exceder ${MAX_BRAND_LENGTH} caracteres`],
    },
    vehicleModel: {
      type: String,
      required: [true, "El modelo es requerido"],
      trim: true,
      maxlength: [MAX_MODEL_LENGTH, `El modelo no puede exceder ${MAX_MODEL_LENGTH} caracteres`],
    },
    year: {
      type: Number,
      required: [true, "El ano es requerido"],
      min: [MIN_YEAR, `El ano debe ser posterior a ${MIN_YEAR}`],
      max: [new Date().getFullYear() + 1, "El ano no puede ser futuro"],
    },
    capacity: {
      type: Number,
      required: [true, "La capacidad es requerida"],
      min: [MIN_CAPACITY, `La capacidad debe ser al menos ${MIN_CAPACITY} pasajero`],
      max: [MAX_CAPACITY, `La capacidad no puede exceder ${MAX_CAPACITY} pasajeros`],
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: async function (this: IVehicleDocument, driverId: string) {
          if (!driverId) return true; // Es opcional

          const User = mongoose.model("User");
          const driver = await User.findOne({
            _id: driverId,
            role: "driver",
            isActive: true,
          });
          return !!driver;
        },
        message: "El chofer asignado debe existir y tener rol de conductor",
      },
    },
  },
  {
    timestamps: true,
  }
);

// indices para buscar rapido
VehicleSchema.index({ isActive: 1 });
VehicleSchema.index({ driverId: 1 });
VehicleSchema.index({ capacity: 1 });

// validar que el conductor no tenga otro vehiculo
VehicleSchema.pre("save", async function (next) {
  if (this.driverId && this.isActive && this.isModified("driverId")) {
    const existingVehicle = await mongoose.model("Vehicle").findOne({
      driverId: this.driverId,
      isActive: true,
      _id: { $ne: this._id },
    });

    if (existingVehicle) {
      return next(
        new Error("Este conductor ya tiene un vehiculo activo asignado")
      );
    }
  }
  next();
});

export default mongoose.model<IVehicleDocument>("Vehicle", VehicleSchema);
