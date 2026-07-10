import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  targetId: mongoose.Types.ObjectId;
  targetModel: string;
  details: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetId: { type: Schema.Types.ObjectId, required: true },
  targetModel: { type: String, required: true },
  details: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

AuditLogSchema.index({ createdAt: -1 });

export default mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
