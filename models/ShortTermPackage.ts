import mongoose, { Schema, Document, Model } from 'mongoose';
import dbConnect from '../lib/dbConnect';

await dbConnect();

export interface IShortTermPackage extends Document {
  name: string;
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  duration: { value: number; unit: 'days' | 'weeks' | 'months' | 'seconds' | 'minutes'};
  returnType: 'fixed' | 'performance-based' | 'both';
  reinvestmentAllowed: boolean;
  exitPenalty?: number;
  createdAt: Date;
}

const ShortTermPackageSchema: Schema = new Schema({
  name: { type: String, required: true },
  totalUnits: { type: Number, required: true },
  availableUnits: { type: Number, required: true },
  equityUnits: { type: Number, required: true },
  duration: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['days', 'weeks', 'months' , 'minutes' , 'seconds'], required: true },
  },
  returnType: { type: String, enum: ['fixed', 'performance-based', 'both'], required: true },
  returnPercentage: { type: Number, required: true },
  reinvestmentAllowed: { type: Boolean, default: false },
  exitPenalty: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const ShortTermPackage: Model<IShortTermPackage> =
  mongoose.models.ShortTermPackage || mongoose.model<IShortTermPackage>('ShortTermPackage', ShortTermPackageSchema);

export default ShortTermPackage;
