import mongoose, { Schema, Document } from "mongoose";
import { IPayment } from "../types";

// constantes de validación y configuración
const MIN_AMOUNT = 0;
const MAX_NOTES_LENGTH = 500;
const CURRENCY_REGEX = /^[A-Z]{3}$/;
const DEFAULT_CURRENCY = "ARS";
const CURRENCY_CODE_LENGTH = 3;

// interface para el documento de pago
export interface IPaymentDocument extends Omit<IPayment, "_id">, Document {
  statusFormatted: string;
  paymentMethodFormatted: string;
}

const PaymentSchema = new Schema(
  {
    reservationId: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
      required: [true, "La reserva es requerida"],
      unique: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "manual"],
      required: [true, "El metodo de pago es requerido"],
    },
    amount: {
      type: Number,
      required: [true, "El monto es requerido"],
      min: [MIN_AMOUNT, "El monto debe ser positivo o cero"],
    },
    currency: {
      type: String,
      required: true,
      default: DEFAULT_CURRENCY,
      uppercase: true,
      match: [CURRENCY_REGEX, `Moneda debe ser código ISO de ${CURRENCY_CODE_LENGTH} letras (ej: ARS, USD)`],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
      required: true,
    },
    notes: {
      type: String,
      maxlength: [MAX_NOTES_LENGTH, `Las notas no pueden exceder ${MAX_NOTES_LENGTH} caracteres`],
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// indices para buscar mas rapido
PaymentSchema.index({ paymentMethod: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ processedAt: 1 });

// verificar que el monto coincida con la reserva
PaymentSchema.pre("save", async function (next) {
  if (
    this.isNew ||
    this.isModified("amount") ||
    this.isModified("reservationId")
  ) {
    const Reservation = mongoose.model("Reservation");
    const reservation = await Reservation.findById(this.reservationId);

    if (reservation && this.amount !== (reservation as any).totalAmount) {
      return next(
        new Error(
          `El monto del pago debe ser igual al total de la reserva: $${
            (reservation as any).totalAmount
          }`
        )
      );
    }
  }
  next();
});

// marcar cuando se proceso
PaymentSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    ["approved", "rejected", "cancelled"].includes(this.status as string)
  ) {
    (this as any).processedAt = new Date();
  }
  next();
});

// actualizar la reserva cuando cambia el pago
PaymentSchema.post("save", async function (doc) {
  const Reservation = mongoose.model("Reservation");

  let paymentStatus: "pending" | "paid";

  switch ((doc as any).status) {
    case "approved":
      paymentStatus = "paid";
      break;
    default:
      paymentStatus = "pending";
  }

  await Reservation.findByIdAndUpdate((doc as any).reservationId, {
    paymentStatus,
  });

  // si se aprobo, confirmar la reserva automaticamente
  if ((doc as any).status === "approved") {
    await Reservation.findByIdAndUpdate((doc as any).reservationId, {
      status: "confirmed",
    });
  }
});

PaymentSchema.virtual("statusFormatted").get(function () {
  const statusMap: Record<string, string> = {
    pending: "Pendiente",
    approved: "Aprobado",
    rejected: "Rechazado",
    cancelled: "Cancelado",
  };
  return statusMap[(this as any).status] || (this as any).status;
});

PaymentSchema.virtual("paymentMethodFormatted").get(function () {
  const methodMap: Record<string, string> = {
    cash: "Efectivo",
    manual: "Manual",
  };
  return methodMap[(this as any).paymentMethod] || (this as any).paymentMethod;
});

export default mongoose.model<IPaymentDocument>("Payment", PaymentSchema);
