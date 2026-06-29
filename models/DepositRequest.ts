import mongoose, { Document, Schema } from 'mongoose';

export interface IDepositRequest extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  pkrAmount?: number;
  paymentMethod: string;
  notes?: string;
  proofUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const DepositRequestSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  pkrAmount: { type: Number },
  paymentMethod: { type: String, required: true },
  notes: { type: String, default: '' },
  proofUrl: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  rejectionReason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

export default mongoose.models.DepositRequest || 
  mongoose.model<IDepositRequest>('DepositRequest', DepositRequestSchema);
