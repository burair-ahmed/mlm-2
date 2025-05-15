// models/Role.ts
import mongoose, { Document, Schema } from 'mongoose';
import { IPermission } from './Permission';

export interface IRole extends Document {
  name: string;
  permissions: mongoose.Types.ObjectId[] | IPermission[];
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission', required: true }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);
