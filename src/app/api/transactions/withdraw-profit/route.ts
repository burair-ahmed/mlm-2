import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../../lib/dbConnect";
import User from "../../../../../models/User";
import PurchasedPackage from "../../../../../models/PurchasedPackage";
import Transaction from "../../../../../models/Transaction";
import { authenticate } from "../../../../../middleware/auth";

export async function POST(req: NextRequest) {
  // 1️⃣ Authenticate user
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  console.log("✅ Authenticated User:", auth._id);

  try {
    // 2️⃣ Connect to DB
    await dbConnect();

    // 3️⃣ Parse Request Body
    const { packageId } = await req.json();
    if (!packageId) {
      return NextResponse.json({ error: "Package ID is required" }, { status: 400 });
    }

    // 4️⃣ Start Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 5️⃣ Fetch Purchased Package
      const purchased = await PurchasedPackage.findOne({ _id: packageId, userId: auth._id }).session(session);
      if (!purchased || purchased.profitAmount <= 0) {
        return NextResponse.json({ error: "No withdrawable profit" }, { status: 400 });
      }

      // 6️⃣ Credit Profit to User's Equity Units
      const user = await User.findById(auth._id).session(session);
      if (!user) throw new Error("User not found");

      user.equityUnits += purchased.profitAmount;

      // 7️⃣ Record Transaction
      const tx = new Transaction({
        userId: auth._id,
        packageId: purchased.packageId,
        packageType: purchased.packageType,
        quantity: 0,
        equityUnits: purchased.profitAmount,
        amount: 0,
        type: "profit-withdrawal",
        description: `Withdrew profit (${purchased.profitAmount} units) from ${purchased.packageType} package`,
        status: "completed",
        createdAt: new Date(),
      });

      // 8️⃣ Reset profit
      purchased.profitAmount = 0;

      // 9️⃣ Save all
      await Promise.all([
        user.save({ session }),
        purchased.save({ session }),
        tx.save({ session }),
      ]);

      // 🔟 Commit and Respond
      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        success: true,
        message: "Profit withdrawn as equity units",
        equityUnits: user.equityUnits,
      });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("❌ Profit withdrawal failed:", error);

      return NextResponse.json(
        { error: "Withdrawal failed", message: error instanceof Error ? error.message : "Unknown error" },
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
