import mongoose, { Schema, Document, Model } from 'mongoose';
import dbConnect from '../lib/dbConnect';

await dbConnect();

// Long-Term Rental Schema
export interface ILongTermRental extends Document {
  name: string;
  category: 'industrial-shed' | 'yard' | 'transport';
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  duration: { value: number; unit: 'months' | 'years' };
  returnPercentage: number; 
  minHoldingPeriod: number; 
  minHoldingPeriodUnit: string;
  resaleAllowed: boolean;
  createdAt: Date;
}

const LongTermRentalSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['industrial-shed', 'yard', 'transport'], required: true },
  totalUnits: { type: Number, required: true },
  availableUnits: { type: Number, required: true },
  equityUnits: { type: Number, required: true },
  returnPercentage: { type: Number, required: true }, 
  minHoldingPeriod: { type: Number, required: true },
  minHoldingPeriodUnit: { type: String, enum: ['seconds', 'minutes', 'months', 'years'], required: true },
  resaleAllowed: { type: Boolean, default: false },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const LongTermRental: Model<ILongTermRental> =
  mongoose.models.LongTermRental || mongoose.model<ILongTermRental>('LongTermRental', LongTermRentalSchema);

export default LongTermRental;