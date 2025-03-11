import mongoose, { Schema, Document, Model } from 'mongoose';
import dbConnect from '../lib/dbConnect';

await dbConnect();

export interface ILongTermPackage extends Document {
  name: string;
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  duration: { value: number; unit: 'months' | 'years' };
  returnType: 'fixed' | 'performance-based' | 'both';
  reinvestmentAllowed: boolean;
  minHoldingPeriod: number;
  resaleAllowed: boolean;
  createdAt: Date;
}

const LongTermPackageSchema: Schema = new Schema({
  name: { type: String, required: true },
  totalUnits: { type: Number, required: true },
  availableUnits: { type: Number, required: true },
  equityUnits: { type: Number, required: true },
  duration: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['months', 'years' , 'seconds' , 'minutes'], required: true },
  },
  returnType: { type: String, enum: ['fixed', 'performance-based', 'both'], required: true },
  returnPercentage: { type: Number, required: true },

  reinvestmentAllowed: { type: Boolean, default: false },
  minHoldingPeriod: { type: Number, required: true },
  resaleAllowed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const LongTermPackage: Model<ILongTermPackage> =
  mongoose.models.LongTermPackage || mongoose.model<ILongTermPackage>('LongTermPackage', LongTermPackageSchema);

export default LongTermPackage;
