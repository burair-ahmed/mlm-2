import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import { authenticate } from "../../../../../middleware/auth";
import Transaction from "../../../../../models/Transaction";
import LongTermRental from "../../../../../models/LongTermRental";
import LongTermIndustry from "../../../../../models/LongTermIndustry";
import TradingPackage from "../../../../../models/TradingPackage";
import { Model } from "mongoose"; // Import Model type

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Authenticate the user
    const auth = await authenticate(req);
    if (auth instanceof NextResponse) return auth;
    console.log("✅ Authenticated User:", auth._id);

    // 2️⃣ Connect to Database
    await dbConnect();

    // 3️⃣ Fetch User's Purchased Packages
    const transactions = await Transaction.find({ userId: auth._id, type: "purchase" })
      .sort({ createdAt: -1 }) // Latest first
      .lean();

    if (!transactions.length) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    // 4️⃣ Fetch Package Details for Each Transaction
    const packageDetails = await Promise.all(
      transactions.map(async (tx) => {
        let PackageModel: Model<any> | null = null; // Explicitly set type

        switch (tx.packageType) {
          case "long-term-rental":
            PackageModel = LongTermRental;
            break;
          case "long-term-industry":
            PackageModel = LongTermIndustry;
            break;
          case "trading":
            PackageModel = TradingPackage;
            break;
          default:
            return null;
        }

        if (!PackageModel) return null;

        const packageData = await PackageModel.findById(tx.packageId).lean();
        return packageData
          ? { ...packageData, quantity: tx.quantity, transactionId: tx._id, purchaseDate: tx.createdAt }
          : null;
      })
    );

    // 5️⃣ Filter out null responses (invalid packages)
    const validPackages = packageDetails.filter((pkg) => pkg !== null);

    return NextResponse.json({ success: true, data: validPackages }, { status: 200 });

  } catch (error) {
    console.error("❌ Error Fetching Investments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
