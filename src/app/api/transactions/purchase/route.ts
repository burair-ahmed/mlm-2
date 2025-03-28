import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "../../../../../models/User";
import Transaction from "../../../../../models/Transaction";
import LongTermRental from "../../../../../models/LongTermRental";
import LongTermIndustry from "../../../../../models/LongTermIndustry";
import TradingPackage from "../../../../../models/TradingPackage";
import dbConnect from "../../../../../lib/dbConnect";
import { authenticate } from "../../../../../middleware/auth";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Authenticate User
    const auth = await authenticate(req);
    if (auth instanceof NextResponse) return auth;
    console.log("✅ Authenticated User:", auth._id);

    // 2️⃣ Connect to Database
    await dbConnect();

    // 3️⃣ Parse Request Data
    const { packageId, packageType, quantity } = await req.json();
    console.log("📩 Request Data:", { packageId, packageType, quantity });

    // Validate Input
    if (!packageId || !packageType || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // 4️⃣ Determine Package Model
    const packageModels: Record<string, any> = {
      "long-term-rental": LongTermRental,
      "long-term-industry": LongTermIndustry,
      "trading": TradingPackage,
    };

    const PackageModel = packageModels[packageType];
    if (!PackageModel) {
      return NextResponse.json({ error: "Invalid package type" }, { status: 400 });
    }

    // 5️⃣ Start MongoDB Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 6️⃣ Fetch Package Details
      const selectedPackage = await PackageModel.findById(packageId).session(session);
      if (!selectedPackage) throw new Error("Package not found");

      // 7️⃣ Calculate Total Cost
      const totalEquityUnits = selectedPackage.equityUnits * quantity;

      // 8️⃣ Fetch User Details
      const user = await User.findById(auth._id).session(session);
      if (!user) throw new Error("User not found");

      // 9️⃣ Validate Purchase
      if (user.equityUnits < totalEquityUnits) {
        return NextResponse.json({ error: "Insufficient equity units" }, { status: 400 });
      }
      if (selectedPackage.availableUnits < quantity) {
        return NextResponse.json({ error: "Not enough available units" }, { status: 400 });
      }

      // 1️⃣0️⃣ Deduct User Equity Units
      user.equityUnits -= totalEquityUnits;
      await user.save({ session });

      // 1️⃣1️⃣ Reduce Available Package Units
      selectedPackage.availableUnits -= quantity;
      await selectedPackage.save({ session });


       const existingEquity = user.equityOwnership.find(
              (ownership: { packageId: mongoose.Types.ObjectId; units: number; purchaseDate: Date }) =>
                ownership.packageId.toString() === packageId
            );
      
            if (existingEquity) {
              existingEquity.units += quantity;
            } else {
              user.equityOwnership.push({
                packageId: selectedPackage._id,
                units: quantity,
                purchaseDate: new Date(),
              });
            }

      await user.save({ session });

      // 1️⃣2️⃣ Create Transaction Record
      const purchaseTx = new Transaction({
        userId: auth._id,
        packageId,
        packageType,
        quantity,
        equityUnits: totalEquityUnits,
        amount: 0, // No fiat currency, only equity units
        type: "purchase",
        description: `Purchased ${quantity} units of ${selectedPackage.name}`,
        status: "completed",
        createdAt: new Date(),
      });

      await purchaseTx.save({ session });

      // 1️⃣3️⃣ Commit Transaction
      await session.commitTransaction();
      session.endSession();

      console.log("✅ Purchase Successful!");
      return NextResponse.json({
        success: true,
        message: "Purchase successful",
        quantity,
        newEquityUnits: user.equityUnits,
      });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("❌ Transaction failed:", error);

      return NextResponse.json(
        { error: "Transaction failed", message: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
