// models/WithdrawalRequest.ts
import mongoose from 'mongoose';

const WithdrawalRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  method: { type: String, enum: ['Bank Transfer', 'JazzCash', 'EasyPaisa', 'SadaPay', 'Other'], required: true },
  amount: { type: Number, required: true },
  details: {
    accountTitle: String,
    accountNumber: String,
    bankName: String, // For Bank Transfer
    eWalletType: String, // For e-wallets if needed
    extraInfo: String, // Optional additional info
  },
  status: { type: String, enum: ['Pending', 'In Process', 'Completed', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.models.WithdrawalRequest ||
  mongoose.model('WithdrawalRequest', WithdrawalRequestSchema);
