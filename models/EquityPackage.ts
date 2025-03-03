import mongoose, { Schema, Document, Model } from 'mongoose';
import dbConnect from '../lib/dbConnect';

await dbConnect();

export interface IEquityPackage extends Document {
  name: string;
  category: 'short-term' | 'long-term' | 'trading';
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  duration?: { value: number; unit: 'days' | 'weeks' | 'months' | 'years' };
  returnType?: 'fixed' | 'performance-based' | 'both';
  reinvestmentAllowed?: boolean;
  exitPenalty?: number;
  minHoldingPeriod?: number;
  resaleAllowed?: boolean;
  lifespan?: number;
  depreciationModel?: 'fixed' | 'performance-based' | 'company-buyback';
  createdAt: Date;
}

const EquityPackageSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['short-term', 'long-term', 'trading'], required: true },
  totalUnits: { type: Number, required: true },
  availableUnits: { type: Number, required: true },
  equityUnits: { type: Number, required: true },
  duration: {
    value: { type: Number },
    unit: { type: String, enum: ['days', 'weeks', 'months', 'years'] },
  },
  returnType: { type: String, enum: ['fixed', 'performance-based', 'both'] },
  reinvestmentAllowed: { type: Boolean, default: false },
  exitPenalty: { type: Number },
  minHoldingPeriod: { type: Number },
  resaleAllowed: { type: Boolean, default: false },
  lifespan: { type: Number },
  depreciationModel: { type: String, enum: ['fixed', 'performance-based', 'company-buyback'] },
  createdAt: { type: Date, default: Date.now },
});

const EquityPackage: Model<IEquityPackage> =
  mongoose.models.EquityPackage || mongoose.model<IEquityPackage>('EquityPackage', EquityPackageSchema);

export default EquityPackage;
