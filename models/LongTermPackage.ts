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
  duration: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['months', 'years'], required: true },
  },
  returnPercentage: { type: Number, required: true }, 
  minHoldingPeriod: { type: Number, required: true },
  minHoldingPeriodUnit: { type: String, enum: ['seconds', 'minutes', 'months', 'years'], required: true },
  resaleAllowed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const LongTermRental: Model<ILongTermRental> =
  mongoose.models.LongTermRental || mongoose.model<ILongTermRental>('LongTermRental', LongTermRentalSchema);

// Long-Term Industries Schema
export interface ILongTermIndustry extends Document {
  name: string;
  category: 'property' | 'cottage-industry' | 'processing-plant';
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  duration: { value: number; unit: 'months' | 'years' };
  estimatedReturn: number; 
  minHoldingPeriod: number;
  minHoldingPeriodUnit: string;
  // marketValuation: number;
  buybackOption: boolean;
  resaleAllowed: boolean;
  createdAt: Date;
}

const LongTermIndustrySchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['property', 'cottage-industry', 'processing-plant'], required: true },
  totalUnits: { type: Number, required: true },
  availableUnits: { type: Number, required: true },
  equityUnits: { type: Number, required: true },
  duration: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['months', 'years'], required: true },
  },
  estimatedReturn: { type: Number, required: true }, 
  minHoldingPeriod: { type: Number, required: true },
  minHoldingPeriodUnit: { type: String, enum: ['seconds', 'minutes', 'months', 'years'], required: true },
  // marketValuation: { type: Number, required: true },
  buybackOption: { type: Boolean, default: false },
  resaleAllowed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const LongTermIndustry: Model<ILongTermIndustry> =
  mongoose.models.LongTermIndustry || mongoose.model<ILongTermIndustry>('LongTermIndustry', LongTermIndustrySchema);

export default{ LongTermRental, LongTermIndustry };