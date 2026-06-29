// app/api/admin/update-profit/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import PurchasedPackage from "../../../../../models/PurchasedPackage";
import User from "../../../../../models/User";
import Transaction from "../../../../../models/Transaction";
import { authenticate } from "../../../../../middleware/auth";
import { hasPermission } from "../../../../../lib/auth/permissionUtils";
import { createNotification } from "../../../../../lib/notifications";

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await hasPermission(auth, 'profit_update');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { packageId, profitAmount } = await req.json();

  if (!packageId || profitAmount === undefined || typeof profitAmount !== 'number' || profitAmount <= 0) {
    return NextResponse.json({ success: false, message: "Invalid or missing profit amount" }, { status: 400 });
  }

  await dbConnect();

  try {
    const purchased = await PurchasedPackage.findById(packageId);

    if (!purchased) {
      return NextResponse.json({ success: false, message: "Purchased package not found" }, { status: 404 });
    }

    const ownerUser = await User.findById(purchased.userId);
    if (!ownerUser) {
      return NextResponse.json({ success: false, message: "Owner user not found" }, { status: 404 });
    }

    // Determine package details name or fallback
    let packageName = purchased.name;
    if (!packageName) {
      packageName = purchased.packageType === "trading" ? "Trading Package" 
                  : purchased.packageType === "long-term-rental" ? "Long-Term Rental Package"
                  : "Long-Term Industry Package";
    }

    // Add the new profitAmount to the existing profitAmount and set last payout date
    purchased.profitAmount += profitAmount;
    purchased.lastProfitDate = new Date();

    // Credit user balance
    ownerUser.balance += profitAmount;

    // Create a transaction record
    const profitTx = new Transaction({
      userId: ownerUser._id,
      amount: profitAmount,
      type: "profit",
      description: `Profit payout of $${profitAmount.toFixed(2)} for package: ${packageName} (Distributed by Admin: ${auth.email || 'System'})`,
    });

    await purchased.save();
    await ownerUser.save();
    await profitTx.save();

    // Trigger user notification
    await createNotification(ownerUser._id, {
      title: 'Profit Payout Distributed',
      message: `Profit payout of $${profitAmount.toFixed(2)} received for package "${packageName}".`,
      type: 'profit',
      link: '/user?tab=Dashboard'
    });

    return NextResponse.json({ success: true, data: purchased });
  } catch (err) {
    console.error("Error updating profit:", err);
    return NextResponse.json({ success: false, message: "Failed to update profit" }, { status: 500 });
  }
}
