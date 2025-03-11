import mongoose, { Schema, Document, Model } from 'mongoose';
import dbConnect from '../lib/dbConnect';

await dbConnect();

export interface ITradingPackage extends Document {
  name: string;
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  lifespan: number; // Example: 5 years for buffalo investment
  depreciationModel: 'fixed' | 'performance-based' | 'company-buyback';
  createdAt: Date;
}

const TradingPackageSchema: Schema = new Schema({
  name: { type: String, required: true },
  totalUnits: { type: Number, required: true },
  availableUnits: { type: Number, required: true },
  equityUnits: { type: Number, required: true },
  lifespan: { type: Number, required: true },
  depreciationModel: { type: String, enum: ['fixed', 'performance-based', 'company-buyback'], required: true },
  returnType: { type: String, enum: ['fixed', 'performance-based', 'both'], required: true },
  returnPercentage: { type: Number, required: true },
  packageDuration: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ["seconds", "minutes", "days"], required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const TradingPackage: Model<ITradingPackage> =
  mongoose.models.TradingPackage || mongoose.model<ITradingPackage>('TradingPackage', TradingPackageSchema);

export default TradingPackage;
