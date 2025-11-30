import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types";

// constantes de validación
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,3})+$/;
const PHONE_REGEX = /^\+?[\d\s-()]{10,15}$/;
const MIN_PASSWORD_LENGTH = 6;
const MAX_NAME_LENGTH = 50;
const BCRYPT_SALT_ROUNDS = 10;

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
        EMAIL_REGEX,
        "Formato de email invalido. Debe ser un email válido (ej: usuario@ejemplo.com)",
      ],
    },
    password: {
      type: String,
      required: [true, "La contrasena es requerida"],
      minlength: [MIN_PASSWORD_LENGTH, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      maxlength: [MAX_NAME_LENGTH, `El nombre no puede exceder ${MAX_NAME_LENGTH} caracteres`],
    },
    lastName: {
      type: String,
      required: [true, "El apellido es requerido"],
      trim: true,
      maxlength: [MAX_NAME_LENGTH, `El apellido no puede exceder ${MAX_NAME_LENGTH} caracteres`],
    },
    phoneNumber: {
      type: String,
      required: [true, "El numero de telefono es requerido"],
      trim: true,
      match: [PHONE_REGEX, "Numero de telefono invalido. Debe tener entre 10 y 15 dígitos"],
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
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
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
