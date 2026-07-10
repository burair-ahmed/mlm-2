import mongoose, { Document, Schema } from 'mongoose';

export interface ITokenBlocklist extends Document {
  token: string;
  expiresAt: Date;
}

const TokenBlocklistSchema: Schema = new Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

// TTL index to automatically remove expired documents from database
TokenBlocklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.TokenBlocklist ||
  mongoose.model<ITokenBlocklist>('TokenBlocklist', TokenBlocklistSchema);
