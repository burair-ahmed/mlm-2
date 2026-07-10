import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISystemSettings extends Document {
  key: string;
  value: any;
  updatedAt: Date;
}

const SystemSettingsSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const SystemSettings: Model<ISystemSettings> = mongoose.models.SystemSettings || mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema);
export default SystemSettings;
