import mongoose, { Schema, Document, Model } from "mongoose";

// constantes de validación
const MAX_COMPANY_NAME_LENGTH = 100;

/**
 * Interface que define la estructura de la configuracion de la empresa
 */
export interface ICompanyConfig extends Document {
  _id: mongoose.Types.ObjectId;

  // datos basicos de la empresa
  companyName: string;
  email: string;
  phone?: string;
  address?: string;

  // para saber cual esta activa
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // metodos de instancia
  getPublicInfo(): any;
}

const CompanyConfigSchema = new Schema<ICompanyConfig>(
  {
    companyName: {
      type: String,
      required: [true, "El nombre de la empresa es requerido"],
      trim: true,
      maxlength: [MAX_COMPANY_NAME_LENGTH, `El nombre no puede exceder ${MAX_COMPANY_NAME_LENGTH} caracteres`],
    },
    email: {
      type: String,
      required: [true, "El email de la empresa es requerido"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "company_config",
  }
);

/**
 * Metodo estatico para obtener la configuracion activa de la empresa
 * @returns La configuracion activa o null si no existe
 */
CompanyConfigSchema.statics.getActiveConfig = async function () {
  return await this.findOne({ isActive: true });
};

/**
 * Metodo de instancia para obtener informacion publica de la empresa
 * @returns Objeto con la informacion visible publicamente
 */
CompanyConfigSchema.methods.getPublicInfo = function () {
  return {
    companyName: this.companyName,
    email: this.email,
    phone: this.phone,
    address: this.address,
  };
};

/**
 * Interface que extiende el modelo con metodos estaticos personalizados
 */
interface ICompanyConfigModel extends Model<ICompanyConfig> {
  getActiveConfig(): Promise<ICompanyConfig | null>;
}

export const CompanyConfig = mongoose.model<
  ICompanyConfig,
  ICompanyConfigModel
>("CompanyConfig", CompanyConfigSchema);
