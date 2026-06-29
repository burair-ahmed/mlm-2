import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'deposit' | 'withdrawal' | 'kyc' | 'commission' | 'profit' | 'resale' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'kyc', 'commission', 'profit', 'resale', 'system'],
    default: 'system',
    required: true,
  },
  isRead: { type: Boolean, default: false, required: true },
  link: { type: String },
  createdAt: { type: Date, default: Date.now, required: true },
});

// Add an index on userId and createdAt to make query retrieval fast
NotificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema);
