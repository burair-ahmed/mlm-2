import mongoose, { Document, Schema } from "mongoose";

interface IPurchasedPackage extends Document {
  userId: mongoose.Types.ObjectId;
  packageType: "long-term-rental" | "long-term-industry" | "trading";
  packageId: mongoose.Types.ObjectId; 
  quantity: number;
  equityUnits: number;
  purchaseDate: Date;
}

const PurchasedPackageSchema = new Schema<IPurchasedPackage>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  packageType: { 
    type: String, 
    enum: ["long-term-rental", "long-term-industry", "trading"], 
    required: true 
  },
  packageId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    validate: {
      validator: async function(value: mongoose.Types.ObjectId) {
        const packageType = this.packageType;
        let isValid = false;
        switch (packageType) {
          case "long-term-rental":
            const rentalPackage = await mongoose.model("LongTermRental").findOne({ _id: value });
            isValid = rentalPackage !== null;
            break;
          case "long-term-industry":
            const industryPackage = await mongoose.model("LongTermIndustry").findOne({ _id: value });
            isValid = industryPackage !== null;
            break;
          case "trading":
            const tradingPackage = await mongoose.model("TradingPackage").findOne({ _id: value });
            isValid = tradingPackage !== null;
            break;
          default:
            isValid = false;
        }
        return isValid;
      },
      message: "Invalid package ID for the specified package type."
    }
  },
  quantity: { type: Number, required: true },
  equityUnits: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
});

export default mongoose.models.PurchasedPackage || mongoose.model<IPurchasedPackage>("PurchasedPackage", PurchasedPackageSchema);
