import mongoose, { Schema, Document } from 'mongoose';
import dbConnect from '../lib/dbConnect';

await dbConnect();

interface IEquityPackage extends Document {
  name: string;
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  createdAt: Date;
}

const EquityPackageSchema = new Schema({
  name: { type: String, required: true },
  totalUnits: { type: Number, required: true },
  availableUnits: { type: Number, required: true },
  equityUnits: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.EquityPackage || 
  mongoose.model<IEquityPackage>('EquityPackage', EquityPackageSchema);
