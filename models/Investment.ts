import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvestment extends Document {
  userId: string;
  packageId: string;
  packageType: "short-term" | "long-term" | "trading";
  equityUnits: number;
  expectedReturn: number;
  purchaseDate: Date;
}

const InvestmentSchema: Schema = new Schema({
  userId: { type: String, required: true },
  packageId: { type: String, required: true },
  packageType: { type: String, enum: ["short-term", "long-term", "trading"], required: true },
  equityUnits: { type: Number, required: true },
  expectedReturn: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
});

const Investment: Model<IInvestment> =
  mongoose.models.Investment || mongoose.model<IInvestment>("Investment", InvestmentSchema);

export default Investment;
