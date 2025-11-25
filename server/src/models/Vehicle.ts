import mongoose, { Schema, Document } from "mongoose";

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
      match: [/^[A-Z]{2,3}[\d]{3}[A-Z]{0,2}$/, "La patente no tiene formato valido"],
    },
    brand: {
      type: String,
      required: [true, "La marca es requerida"],
      trim: true,
      maxlength: [50, "La marca no puede exceder 50 caracteres"],
    },
    vehicleModel: {
      type: String,
      required: [true, "El modelo es requerido"],
      trim: true,
      maxlength: [50, "El modelo no puede exceder 50 caracteres"],
    },
    year: {
      type: Number,
      required: [true, "El ano es requerido"],
      min: [1990, "El ano debe ser posterior a 1990"],
      max: [new Date().getFullYear() + 1, "El ano no puede ser futuro"],
    },
    capacity: {
      type: Number,
      required: [true, "La capacidad es requerida"],
      min: [1, "La capacidad debe ser al menos 1"],
      max: [60, "La capacidad no puede exceder 60 pasajeros"],
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
