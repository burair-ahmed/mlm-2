import mongoose, { Document, Schema } from 'mongoose';
// import dbConnect from '../lib/dbConnect';

// await dbConnect();

export interface IPermission extends Document {

  label: string;
  slug: string; // unique: e.g., "user.view"
}

const PermissionSchema: Schema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  label: {
    type: String,
    required: true,
  }
});

// Auto-generate slug before saving
PermissionSchema.pre('save', function (next) {
  if (!this.isModified('module') && !this.isModified('action')) return next();
  this.slug = `${this.module}.${this.action}`.toLowerCase();
  next();
});

export default mongoose.models.Permission || mongoose.model<IPermission>('Permission', PermissionSchema);
