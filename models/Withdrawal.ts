import mongoose, { Document, Schema } from 'mongoose';
import dbConnect from '../lib/dbConnect';

await dbConnect();

export interface IWithdrawal extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: string;
  paymentDetails: object;
  createdAt: Date;
  processedAt?: Date;
}

const WithdrawalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  paymentMethod: { type: String, required: true, enum: ['bank', 'paypal', 'crypto'] },
  paymentDetails: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
  processedAt: Date
});

export default mongoose.models.Withdrawal || 
  mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);