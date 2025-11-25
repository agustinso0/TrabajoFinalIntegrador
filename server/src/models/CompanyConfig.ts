import mongoose, { Schema, Document, Model } from "mongoose";

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

  // metodos
  getPublicInfo(): any;
}

const CompanyConfigSchema = new Schema<ICompanyConfig>(
  {
    companyName: {
      type: String,
      required: [true, "El nombre de la empresa es requerido"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
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

// traer la config que esta activa
CompanyConfigSchema.statics.getActiveConfig = async function () {
  return await this.findOne({ isActive: true });
};

// solo la info que puede ver cualquiera
CompanyConfigSchema.methods.getPublicInfo = function () {
  return {
    companyName: this.companyName,
    email: this.email,
    phone: this.phone,
    address: this.address,
  };
};

interface ICompanyConfigModel extends Model<ICompanyConfig> {
  getActiveConfig(): Promise<ICompanyConfig | null>;
}

export const CompanyConfig = mongoose.model<
  ICompanyConfig,
  ICompanyConfigModel
>("CompanyConfig", CompanyConfigSchema);
