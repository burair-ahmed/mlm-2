import mongoose, { Schema, Document, Model } from 'mongoose';
import dbConnect from '../lib/dbConnect';

await dbConnect();

// Long-Term Industry Schema
export interface ILongTermIndustry extends Document {
  name: string;
  category: 'property' | 'cottage-industry' | 'processing-plant' | 'restaurant' | 'banquet';
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  estimatedReturn: number;
  minHoldingPeriod: number;
  minHoldingPeriodUnit: string;
  buybackOption: boolean;
  resaleAllowed: boolean;
  createdAt: Date;
}

const LongTermIndustrySchema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['property', 'cottage-industry', 'processing-plant', 'restaurant', 'banquet'],
      required: true,
    },
    totalUnits: { type: Number, required: true },
    availableUnits: { type: Number, required: true },
    equityUnits: { type: Number, required: true },
    estimatedReturn: { type: Number, required: true },
    minHoldingPeriod: { type: Number, required: true }, // Keep only value
    minHoldingPeriodUnit: {
      type: String,
      enum: ['seconds', 'minutes', 'months', 'years'],
      required: true,
    },
    buybackOption: { type: Boolean, required: true },
    resaleAllowed: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const LongTermIndustry: Model<ILongTermIndustry> =
  mongoose.models.LongTermIndustry || mongoose.model<ILongTermIndustry>('LongTermIndustry', LongTermIndustrySchema);

export default LongTermIndustry;
