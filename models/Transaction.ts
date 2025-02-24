import mongoose, { Document, Schema } from 'mongoose';
import dbConnect from '../lib/dbConnect';

await dbConnect();

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: 'deposit' | 'purchase' | 'commission' | 'equity_purchase'| 'cash_to_equity';
  equityUnits: number;
  referralLevel?: number;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['deposit', 'purchase', 'commission', 'equity_purchase', 'cash_to_equity'], 
    required: true 
  },  
  equityUnits: { type: Number, required: true, default: 0 },
  referralLevel: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction || 
  mongoose.model<ITransaction>('Transaction', TransactionSchema);