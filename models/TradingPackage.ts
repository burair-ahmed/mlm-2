import mongoose, { Schema, Document, Model } from 'mongoose';
import dbConnect from '../lib/dbConnect';

await dbConnect();

export interface ITradingPackage extends Document {
  name: string;
  category: 'poultry' | 'dairy' | 'cattle' | 'fruits-vegetables' | 'automobiles' | 'grocery' | 'general' | 'industrial-materials' | 'catering' | 'restaurant-goods';
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  dailyInsights: boolean;
  profitEstimation: 'market-based';
  returnPercentage: number; // Profit range (estimated)
  minHoldingPeriod: number; 
  minHoldingPeriodUnit: string;
  // lockPeriod: number; 
  createdAt: Date;
  image: string; 
}

const TradingPackageSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['poultry', 'dairy', 'cattle', 'fruits-vegetables', 'automobiles', 'grocery', 'general', 'industrial-materials', 'catering', 'restaurant-goods'],
    required: true,
  },
  totalUnits: { type: Number, required: true },
  availableUnits: { type: Number, required: true },
  equityUnits: { type: Number, required: true },
  dailyInsights: { type: Boolean, default: true },
  profitEstimation: { type: String, enum: ['market-based'], required: true },
  returnPercentage: { type: Number, required: true },
  minHoldingPeriod: { type: Number, required: true },
  minHoldingPeriodUnit: { type: String, enum: ['seconds', 'minutes', 'months', 'years'], required: true },
  // lockPeriod: { type: Number, default: 2 },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TradingPackage: Model<ITradingPackage> =
  mongoose.models.TradingPackage || mongoose.model<ITradingPackage>('TradingPackage', TradingPackageSchema);

export default TradingPackage;
