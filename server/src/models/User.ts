import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types";

// interface para documento de usuario
export interface IUserDocument extends Omit<IUser, "_id">, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,3})+$/,
        "Email invalido",
      ],
    },
    password: {
      type: String,
      required: [true, "La contrasena es requerida"],
      minlength: [6, "La contrasena debe tener al menos 6 caracteres"],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
    },
    lastName: {
      type: String,
      required: [true, "El apellido es requerido"],
      trim: true,
      maxlength: [50, "El apellido no puede exceder 50 caracteres"],
    },
    phoneNumber: {
      type: String,
      required: [true, "El numero de telefono es requerido"],
      trim: true,
      match: [/^\+?[\d\s-()]{10,15}$/, "Numero de telefono invalido"],
    },
    role: {
      type: String,
      enum: ["passenger", "driver", "operator", "admin"],
      default: "passenger",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete (ret as any).password;
        return ret;
      },
    },
  }
);

// indices para busquedas mas rapidas
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// hashear password antes de guardar en BD
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// comparar password con el que esta guardado
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

export default mongoose.model<IUserDocument>("User", UserSchema);
