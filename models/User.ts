import mongoose, { Document, Schema } from 'mongoose';
import dbConnect from '../lib/dbConnect';

await dbConnect();

export interface IUser extends Document {
  email: string;
  password: string;
  referralCode: string;
  referredBy?: mongoose.Types.ObjectId;
  referrals: mongoose.Types.ObjectId[];
  createdAt: Date;
  balance: number;
  hierarchyLevel: number;
  commissionEarned: number;
  equityUnits: number; 
  isAdmin: boolean;
  equityOwnership: Array<{
    packageId: Schema.Types.ObjectId;
    units: number;
    purchaseDate: Date;
  }>;
}


const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
  referrals: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  balance: { type: Number, default: 0 },
  hierarchyLevel: { type: Number, default: 0 },
  commissionEarned: { type: Number, default: 0 },
  equityUnits: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  equityOwnership: [{
    packageId: { type: Schema.Types.ObjectId, ref: 'EquityPackage' },
    units: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now }
  }]
});

UserSchema.virtual('referralHierarchy', {
  ref: 'User',
  localField: '_id',
  foreignField: 'referredBy',
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);